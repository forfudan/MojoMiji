"""Copy the decimo manuals into the site, under /decimo.

The manuals are written for GitHub, and the copy has to read the same here.
Four things differ between the two renderers, and this script handles each:

1. GitHub makes heading anchors one way and VitePress another. "Part I —
   BigInt" is `#part-i--bigint` on GitHub and `#part-i-—-bigint` here. Every
   heading is given its GitHub anchor explicitly, as `{#...}`, so that the
   manual's own links keep working.
2. The hand-written table of contents at the top is dropped. The outline on
   the right of the page does the same job.
3. A code block that imports decimo cannot run on Compiler Explorer, so Mojo
   and Python blocks are marked `norun`.
4. The sidebar is written from the `##` headings, to `sidebar.json`, which the
   config imports. A new part in the manual shows up in the sidebar on the
   next sync without touching the config.

Callouts need nothing. The manuals use GitHub alerts (`> [!NOTE]`), and
VitePress renders those as its own info, tip, warning and danger blocks.

Usage:
    python tools/sync_decimo.py --src ../../decimo
    python tools/sync_decimo.py --src path/to/decimo --ref v0.16.0
"""

import argparse
import json
import re
import subprocess
from pathlib import Path

REPO = "https://github.com/forfudan/decimo"

# source file in decimo -> (page in the site, title in the sidebar)
PAGES = {
    "docs/user_manual.md": ("index.md", "User manual"),
    "docs/user_manual_cli.md": ("cli.md", "CLI calculator"),
}

FENCE = re.compile(r"^(\s*)(`{3,}|~{3,})(.*)$")
HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*$")
TOC_LINE = re.compile(r"^\s*- \[.*\]\(#[^)]*\)\s*$")
COMMENT = re.compile(r"\s*<!--.*?-->\s*")


def github_slug(text: str, seen: dict[str, int]) -> str:
    """The anchor GitHub gives a heading, following github-slugger."""
    text = COMMENT.sub(" ", text).strip()
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)  # links keep their text
    # Code spans keep their contents as they are; emphasis markers outside
    # them go.
    parts = re.split(r"(`+[^`]*`+)", text)
    text = "".join(
        p.strip("`") if p.startswith("`") else re.sub(r"[*_]{1,3}(?=\S)|(?<=\S)[*_]{1,3}", "", p)
        for p in parts
    )
    slug = re.sub(r"[^\w\- ]", "", text.lower()).replace(" ", "-")
    if slug in seen:
        seen[slug] += 1
        return f"{slug}-{seen[slug]}"
    seen[slug] = 0
    return slug


def plain(text: str) -> str:
    """A heading as text for the sidebar: no comment, no backticks."""
    return COMMENT.sub(" ", text).replace("`", "").strip()


def convert(source: str, page: str, origin: str, ref: str):
    """The page's Markdown, and its `##` headings for the sidebar."""
    lines = source.splitlines()
    out: list[str] = []
    sidebar: list[tuple[str, str]] = []
    seen: dict[str, int] = {}
    fence = ""  # the fence we are inside, or "" outside one
    before_first_section = True
    toc_done = False
    i = 0

    while i < len(lines):
        line = lines[i]
        match = FENCE.match(line)

        if fence:
            if match and match.group(2).startswith(fence) and not match.group(3).strip():
                fence = ""
            out.append(line)
            i += 1
            continue

        if match:
            indent, marks, info = match.groups()
            fence = marks
            words = info.split()
            if words and words[0] in ("mojo", "python") and "run" not in words:
                if "norun" not in words:
                    words.append("norun")
                line = f"{indent}{marks}{' '.join(words)}"
            out.append(line)
            i += 1
            continue

        # The hand-written table of contents: the first run of anchor-link
        # list items before the first section.
        if before_first_section and not toc_done and TOC_LINE.match(line):
            while i < len(lines) and TOC_LINE.match(lines[i]):
                i += 1
            toc_done = True
            continue

        heading = HEADING.match(line)
        if heading:
            hashes, text = heading.groups()
            slug = github_slug(text, seen)
            text = COMMENT.sub(" ", text).strip()
            if len(hashes) == 1:
                out.append(f"{hashes} {text}")
                out.append("")
                out.append(f"::: info Decimo {ref}")
                out.append(
                    f"This page is the manual in [`{origin}`]({REPO}/blob/{ref}/{origin}) "
                    f"of the Decimo repository, at {ref}."
                )
                out.append(":::")
            else:
                out.append(f"{hashes} {text} {{#{slug}}}")
                if len(hashes) == 2:
                    before_first_section = False
                    link = "/decimo/" if page == "index.md" else f"/decimo/{page[:-3]}"
                    sidebar.append((plain(text), f"{link}#{slug}"))
            i += 1
            continue

        out.append(line)
        i += 1

    header = (
        f"<!-- Generated by tools/sync_decimo.py from {origin} in "
        f"forfudan/decimo at {ref}. Edit the source there, not this file. -->\n\n"
    )
    return header + "\n".join(out).rstrip() + "\n", sidebar


def describe(src: Path) -> str:
    """The tag the decimo checkout sits on, or its commit."""
    for args in (["describe", "--tags", "--exact-match"], ["rev-parse", "--short", "HEAD"]):
        result = subprocess.run(["git", "-C", str(src), *args], capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout.strip()
    raise SystemExit(f"{src} is not a git checkout; pass --ref")


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--src", type=Path, required=True, help="a decimo checkout")
    parser.add_argument("--ref", help="the tag or commit to name (default: the checkout's)")
    parser.add_argument("--out", type=Path, default=Path(__file__).parent.parent / "src" / "decimo")
    args = parser.parse_args()

    ref = args.ref or describe(args.src)
    args.out.mkdir(parents=True, exist_ok=True)
    sidebar = []

    for origin, (page, title) in PAGES.items():
        text, sections = convert((args.src / origin).read_text(), page, origin, ref)
        (args.out / page).write_text(text)
        link = "/decimo/" if page == "index.md" else f"/decimo/{page[:-3]}"
        sidebar.append(
            {
                "text": title,
                "link": link,
                "collapsed": False,
                "items": [{"text": t, "link": l} for t, l in sections],
            }
        )
        print(f"{origin} -> {args.out / page} ({len(sections)} sections)")

    (args.out / "sidebar.json").write_text(json.dumps(sidebar, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
