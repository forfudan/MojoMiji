/**
 * Run buttons on code blocks.
 *
 * The button itself is written into the HTML at build time (see `config.mts`),
 * so it is there before any JavaScript runs. It sits in the header line of the
 * block, which is the tab bar of a `::: code-group`, and it belongs to the tab
 * the reader has open. This file only listens for clicks on it.
 *
 * The code is compiled and run by Compiler Explorer (godbolt.org), the same
 * free service that Modular's own Mojo playground uses. Nothing runs on our
 * server, and the reader's browser talks to godbolt directly.
 *
 * Godbolt runs seven of the languages this Miji writes about, all through one
 * request, so the button is not only for Mojo. What differs between them is
 * three things, and they all live in the table below: which compiler, which
 * flags, and whether the program needs a nudge to start.
 */

import { inBrowser } from "vitepress"

interface Runner {
  /** The compiler on godbolt. Bump these when the Miji moves on. */
  compiler: string
  /**
   * Flags. `rustc` and `gcc` do not optimise unless told to, and the Miji uses
   * these buttons to compare speed, so an unoptimised build would lie.
   */
  args?: string
  /**
   * Most of these languages start at `main()` on their own. Python and Swift
   * do not: they run a file from the top. The Miji writes them in Mojo's style
   * all the same, with a `main()` that nothing calls, so the call is added
   * here before the program is sent. This is the one liberty we take with the
   * reader's code, and it is the very thing Chapter "My first Mojo program"
   * says out loud: in Mojo you do not need to write the last line.
   */
  needsMainCall?: boolean
  /** What to call the file in error messages, in place of godbolt's `<source>`. */
  file: string
}

export const RUNNERS: Record<string, Runner> = {
  mojo: { compiler: "mojo_1_0_0", file: "main.mojo" },
  python: { compiler: "python314", file: "main.py", needsMainCall: true },
  c: { compiler: "cg162", args: "-O3", file: "main.c" },
  rust: { compiler: "r1970", args: "-O", file: "main.rs" },
  go: { compiler: "gl1260", file: "main.go" },
  swift: { compiler: "swift633", args: "-O", file: "main.swift", needsMainCall: true },
  // Pinned to 0.15: in 0.16 `std.time.Timer` moved and the writer API changed.
  zig: { compiler: "z0152", args: "-O ReleaseFast", file: "main.zig" },
}

export interface MojoRunResult {
  /** Did the program compile? */
  built: boolean
  /** Did the program actually run? */
  ran: boolean
  /** Exit code of the program. Zero means success. */
  exitCode: number
  /** What the program printed. */
  stdout: string
  /** What the program wrote to the error stream. */
  stderr: string
  /** What the compiler said. Errors if it failed, warnings if it did not. */
  buildStderr: string
  /** Set when we could not reach the compiler at all. */
  network: string | null
  /** Godbolt stops a program that has run for about twenty seconds. */
  killed: boolean
}

// ---------------------------------------------------------------------------
// Talking to the compiler
// ---------------------------------------------------------------------------

type GodboltLine = { text?: string }

/**
 * `rustc` and `go` colour their errors. In a terminal that is helpful; here it
 * would put `[0m[1m[38;5;9merror` in front of the reader.
 */
// eslint-disable-next-line no-control-regex
const ANSI = /\u001b\[[0-9;]*m/g

function join(lines: GodboltLine[] | undefined, file: string): string {
  return (lines ?? [])
    .map((line) => line.text ?? "")
    // Godbolt reports its own install path, which means nothing to a reader.
    .filter((text) => !text.startsWith("/opt/compiler-explorer/"))
    .join("\n")
    .replaceAll(ANSI, "")
    .replaceAll("<source>:", `${file}:`)
    .replaceAll("./example.", `${file.split(".")[0]}.`)
    .trimEnd()
}

/** Does the program already start itself? */
const CALLS_MAIN = /^main\(\)/m

/**
 * Compile and run one program. Exported on purpose: an exercise checker can
 * reuse this later without touching any of the DOM code below.
 */
export async function runProgram(
  lang: string,
  source: string,
  signal?: AbortSignal,
): Promise<MojoRunResult> {
  const empty: MojoRunResult = {
    built: false,
    ran: false,
    exitCode: -1,
    stdout: "",
    stderr: "",
    buildStderr: "",
    network: null,
    killed: false,
  }

  const runner = RUNNERS[lang]
  if (!runner) {
    return { ...empty, network: `There is no compiler here for ${lang}.` }
  }

  const program =
    runner.needsMainCall && !CALLS_MAIN.test(source)
      ? `${source.trimEnd()}\n\nmain()\n`
      : source

  let response: Response
  try {
    response = await fetch(`https://godbolt.org/api/compiler/${runner.compiler}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal,
      body: JSON.stringify({
        source: program,
        lang,
        allowStoreCodeDebug: true,
        options: {
          userArguments: runner.args ?? "",
          executeParameters: { args: [], stdin: "" },
          compilerOptions: { executorRequest: true, skipAsm: true },
          filters: { execute: true },
          tools: [],
          libraries: [],
        },
      }),
    })
  } catch (error) {
    const name = (error as Error)?.name
    if (name === "AbortError") throw error
    return { ...empty, network: "Could not reach the compiler. Are you online?" }
  }

  if (!response.ok) {
    return { ...empty, network: `The compiler service answered HTTP ${response.status}.` }
  }

  let data: any
  try {
    data = await response.json()
  } catch {
    return { ...empty, network: "The compiler service sent an answer we could not read." }
  }

  const build = data.buildResult ?? {}
  const stdout = join(data.stdout, runner.file)
  const stderr = join(data.stderr, runner.file)
  return {
    built: build.code === 0,
    ran: Boolean(data.didExecute),
    exitCode: typeof data.code === "number" ? data.code : -1,
    stdout,
    stderr,
    buildStderr: join(build.stderr, runner.file),
    network: null,
    // Godbolt gives a long-running program about twenty seconds, then kills it.
    killed: /processing time exceeded|SIGKILL/.test(`${stdout}\n${stderr}`),
  }
}

// ---------------------------------------------------------------------------
// The buttons on the page
// ---------------------------------------------------------------------------

/**
 * Same program, same answer. Saves godbolt a round trip and the reader a wait.
 * The language has to be part of the key: `def main(): print("Hello, world!")`
 * is the very same text in Mojo and in Python, and this Miji is full of pairs
 * exactly like it.
 */
const cache = new Map<string, MojoRunResult>()

/** One in-flight request per block, so a second click can cancel the first. */
const running = new WeakMap<HTMLElement, AbortController>()

/**
 * The block a button in the header line belongs to: the one on show. In a
 * `mojo` + `python` group that is whichever tab the reader has open, which is
 * also why the button disappears on a tab that cannot be run.
 */
function blockOf(button: HTMLElement): HTMLElement | null {
  const group = button.closest(".vp-code-group")
  return group?.querySelector<HTMLElement>(".blocks > [data-run].active") ?? null
}

/** The header line of the group a block sits in. */
function tabsOf(block: HTMLElement): HTMLElement | null {
  return (
    block.closest(".vp-code-group")?.querySelector<HTMLElement>(":scope > .tabs") ??
    null
  )
}

/** Which language a block is written in. `config.mts` wrote it there. */
function langOf(block: HTMLElement): string {
  return block.dataset.run ?? "mojo"
}

/** Read the program out of a code block, the way the copy button does. */
function readSource(block: HTMLElement): string {
  const editor = editorOf(block)
  if (editor) return editor.value
  const pre = block.querySelector("pre")
  if (!pre) return ""
  const clone = pre.cloneNode(true) as HTMLElement
  clone.querySelectorAll(".vp-copy-ignore, .diff.remove").forEach((n) => n.remove())
  return clone.textContent ?? ""
}

/**
 * The output goes under the whole group, not inside it. VitePress switches
 * tabs by counting the blocks in `.blocks`, so anything we put in there would
 * throw that count off and hand the reader the wrong tab.
 */
function anchorOf(block: HTMLElement): HTMLElement {
  return (block.closest(".vp-code-group") as HTMLElement | null) ?? block
}

/** Which block an open panel is showing the output of. */
const owner = new WeakMap<HTMLElement, HTMLElement>()

/**
 * What each block printed the last time it was run. A `mojo` + `python` group
 * has one panel between the two tabs, so switching tab has to put the other
 * tab's output back. Kept until the reader closes the panel, edits the code,
 * or leaves the page.
 */
const shown = new WeakMap<HTMLElement, { result: MojoRunResult; seconds: string }>()

/** Hand a panel over to a block, taking it off whichever block had it. */
function claim(panel: HTMLElement, block: HTMLElement): void {
  const before = owner.get(panel)
  if (before && before !== block) before.classList.remove("mojo-open")
  owner.set(panel, block)
  block.classList.add("mojo-open")
}

/** The panel of a block, if it has one open. */
function panelOf(block: HTMLElement): HTMLElement | null {
  const next = anchorOf(block).nextElementSibling
  return next?.classList.contains("mojo-output") ? (next as HTMLElement) : null
}

/** The output panel that belongs to a block, created on first use. */
function outputPanel(block: HTMLElement): HTMLElement {
  const open = panelOf(block)
  if (open) {
    claim(open, block)
    return open
  }

  const panel = document.createElement("div")
  panel.className = "mojo-output"
  panel.innerHTML =
    '<div class="mojo-output-head">' +
    '<span class="mojo-output-title"></span>' +
    '<span class="mojo-output-note"></span>' +
    '<button class="mojo-output-close" type="button" title="Hide the output">&times;</button>' +
    "</div>" +
    '<pre class="mojo-output-body"></pre>'
  anchorOf(block).after(panel)
  claim(panel, block)
  return panel
}

function closePanel(panel: HTMLElement): void {
  owner.get(panel)?.classList.remove("mojo-open")
  owner.delete(panel)
  panel.remove()
}

/** The reader is finished with this output. Take it away and forget it. */
function dismissPanel(panel: HTMLElement): void {
  const block = owner.get(panel)
  if (block) shown.delete(block)
  closePanel(panel)
}

/**
 * Show the open tab's own output again after a tab switch, or take the panel
 * away if that tab has not been run yet.
 */
function restore(group: HTMLElement): void {
  const block = group.querySelector<HTMLElement>(".blocks > .active")
  const next = group.nextElementSibling
  const panel = next?.classList.contains("mojo-output") ? (next as HTMLElement) : null
  const kept = block ? shown.get(block) : undefined

  if (!block || !kept) {
    if (panel) closePanel(panel)
    return
  }

  const target = panel ?? outputPanel(block)
  claim(target, block)
  render(target, kept.result, kept.seconds)
}

/** Count the warnings the compiler produced, so we can label the fold. */
function countWarnings(text: string): number {
  return (text.match(/\bwarning:/g) ?? []).length
}

function show(
  panel: HTMLElement,
  state: "busy" | "ok" | "fail" | "error",
  title: string,
  body: string,
  note = "",
): void {
  panel.dataset.state = state
  panel.querySelector(".mojo-output-warnings")?.remove()
  ;(panel.querySelector(".mojo-output-title") as HTMLElement).textContent = title
  ;(panel.querySelector(".mojo-output-note") as HTMLElement).textContent = note
  const target = panel.querySelector(".mojo-output-body") as HTMLElement
  target.textContent = body
  target.classList.toggle("mojo-output-quiet", body === "(no output)")
}

/** Turn a result into what the reader sees. */
function render(panel: HTMLElement, result: MojoRunResult, seconds: string): void {
  if (result.network) {
    show(panel, "error", "Cannot run", result.network)
    return
  }

  if (!result.built) {
    show(panel, "error", "Compile error", result.buildStderr || "The program did not compile.")
    return
  }

  // Some programs in this Miji are slow on purpose. Say so plainly, rather
  // than showing the reader "exit code 143". Whatever the program managed to
  // print before it was stopped is worth keeping: it is often the point.
  if (result.killed) {
    const note =
      "[Compiler Explorer gives a program about twenty seconds, and this one " +
      "wanted more. It would finish on your own computer.]"
    show(
      panel,
      "fail",
      "Stopped: the program ran too long",
      result.stdout ? `${result.stdout}\n\n${note}` : note,
      seconds,
    )
    return
  }

  const printed = [result.stdout, result.stderr].filter(Boolean).join("\n")
  const ok = result.ran && result.exitCode === 0
  show(
    panel,
    ok ? "ok" : "fail",
    ok ? "Output" : `Program stopped with exit code ${result.exitCode}`,
    printed || "(no output)",
    seconds,
  )

  // Warnings are worth seeing, but not worth shouting about. Fold them away.
  const warnings = countWarnings(result.buildStderr)
  if (warnings > 0) {
    const fold = document.createElement("details")
    fold.className = "mojo-output-warnings"
    fold.innerHTML = `<summary>${warnings} compiler warning${warnings > 1 ? "s" : ""}</summary>`
    const pre = document.createElement("pre")
    pre.textContent = result.buildStderr
    fold.append(pre)
    panel.append(fold)
  }
}

async function handleRun(button: HTMLElement): Promise<void> {
  const block = blockOf(button)
  if (!block) return

  // A second click while it is working means "stop".
  const inFlight = running.get(block)
  if (inFlight) {
    inFlight.abort()
    running.delete(block)
    button.removeAttribute("data-busy")
    const open = panelOf(block)
    if (open) dismissPanel(open)
    return
  }

  const lang = langOf(block)
  const source = readSource(block)
  const panel = outputPanel(block)

  const key = `${lang}\n${source}`
  const cached = cache.get(key)
  if (cached) {
    shown.set(block, { result: cached, seconds: "" })
    render(panel, cached, "")
    return
  }

  show(panel, "busy", "Compiling and running", "")
  button.setAttribute("data-busy", "")

  const controller = new AbortController()
  running.set(block, controller)
  const started = performance.now()

  try {
    const result = await runProgram(lang, source, controller.signal)
    if (!panel.isConnected) return
    cache.set(key, result)
    const seconds = `${((performance.now() - started) / 1000).toFixed(1)} s`
    shown.set(block, { result, seconds })
    render(panel, result, seconds)
  } catch {
    // Aborted by the reader. Nothing to report.
  } finally {
    running.delete(block)
    button.removeAttribute("data-busy")
  }
}

// ---------------------------------------------------------------------------
// Editing the code
// ---------------------------------------------------------------------------
// Click a runnable block and its code becomes a plain text box that you can
// type in. The colours go away while you edit: the highlighting is worked out
// once, when the site is built, and it cannot follow your typing. The Reset
// button puts the original, coloured version back.
//
// No editor library is involved. What a text box does not give us for free,
// and what a Python user would badly miss, is indentation, so Tab, Shift+Tab
// and Enter are handled by hand below.

/** The untouched highlighted markup of every block we turned into a text box. */
const original = new WeakMap<HTMLElement, string>()

function editorOf(block: HTMLElement): HTMLTextAreaElement | null {
  return block.querySelector("textarea.mojo-editor")
}

/** Grow the box to fit its text, so that it never scrolls inside itself. */
function fit(editor: HTMLTextAreaElement): void {
  editor.style.height = "auto"
  editor.style.height = `${editor.scrollHeight}px`
}

/** Type into the box the way a keyboard would, so that undo keeps working. */
function type(editor: HTMLTextAreaElement, text: string): void {
  if (!document.execCommand("insertText", false, text)) {
    editor.setRangeText(text, editor.selectionStart, editor.selectionEnd, "end")
    editor.dispatchEvent(new Event("input", { bubbles: true }))
  }
}

/** Where in the program did the reader click? -1 if we cannot tell. */
function clickOffset(pre: HTMLElement, event: MouseEvent): number {
  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null
    caretPositionFromPoint?: (
      x: number,
      y: number,
    ) => { offsetNode: Node; offset: number } | null
  }

  let node: Node | null = null
  let offset = 0
  if (doc.caretRangeFromPoint) {
    const range = doc.caretRangeFromPoint(event.clientX, event.clientY)
    if (range) [node, offset] = [range.startContainer, range.startOffset]
  } else if (doc.caretPositionFromPoint) {
    const position = doc.caretPositionFromPoint(event.clientX, event.clientY)
    if (position) [node, offset] = [position.offsetNode, position.offset]
  }
  if (!node || !pre.contains(node)) return -1

  // How much text lies between the start of the block and that point?
  const measure = document.createRange()
  measure.selectNodeContents(pre)
  measure.setEnd(node, offset)
  return measure.toString().length
}

function startEditing(block: HTMLElement, offset: number): void {
  if (editorOf(block)) return
  const pre = block.querySelector("pre")
  if (!pre) return

  const text = readSource(block)
  original.set(block, pre.innerHTML)

  const editor = document.createElement("textarea")
  editor.className = "mojo-editor"
  editor.spellcheck = false
  editor.value = text
  editor.setAttribute("aria-label", `${langOf(block)} program, editable`)

  // The copy button reads the `<pre>`, which is now out of sight. Keep a plain
  // copy of the text in there, and keep it up to date, so that copying still
  // gives you what you see.
  const mirror = document.createElement("code")
  mirror.textContent = text
  pre.replaceChildren(mirror)
  pre.style.display = "none"
  pre.after(editor)

  // Reset goes up into the header line, beside Run, and is built the same
  // way: an icon and a word.
  const reset = document.createElement("button")
  reset.className = "mojo-reset"
  reset.type = "button"
  reset.title = "Put the original code back"
  reset.innerHTML =
    '<span class="mojo-reset-icon"></span>' +
    '<span class="mojo-btn-text">Reset</span>'
  tabsOf(block)?.append(reset)
  block.classList.add("mojo-editing")

  editor.addEventListener("input", () => {
    mirror.textContent = editor.value
    fit(editor)
  })
  editor.addEventListener("keydown", (event) => onKey(block, editor, event))

  fit(editor)
  editor.focus()
  if (offset >= 0) editor.setSelectionRange(offset, offset)
}

function stopEditing(block: HTMLElement): void {
  const editor = editorOf(block)
  const pre = block.querySelector("pre")
  const html = original.get(block)
  if (!editor || !pre || html === undefined) return

  editor.remove()
  pre.innerHTML = html
  pre.style.removeProperty("display")
  tabsOf(block)?.querySelector("button.mojo-reset")?.remove()
  block.classList.remove("mojo-editing")
  original.delete(block)

  // The output on screen belongs to the code we just threw away.
  const panel = panelOf(block)
  if (panel) dismissPanel(panel)
}

/** Move whole lines in or out by four spaces, the way an editor would. */
function shift(editor: HTMLTextAreaElement, out: boolean): void {
  const { value, selectionStart, selectionEnd } = editor
  if (selectionStart === selectionEnd && !out) {
    type(editor, "    ")
    return
  }

  const from = value.lastIndexOf("\n", selectionStart - 1) + 1
  const end = value.indexOf("\n", selectionEnd)
  const to = end === -1 ? value.length : end
  const moved = value
    .slice(from, to)
    .split("\n")
    .map((line) => (out ? line.replace(/^ {1,4}/, "") : `    ${line}`))
    .join("\n")

  editor.setSelectionRange(from, to)
  type(editor, moved)
  editor.setSelectionRange(from, from + moved.length)
}

function onKey(
  block: HTMLElement,
  editor: HTMLTextAreaElement,
  event: KeyboardEvent,
): void {
  // Ctrl+Enter, or Cmd+Enter on a Mac, runs the program.
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    const run = tabsOf(block)?.querySelector<HTMLElement>("button.mojo-run")
    if (run) void handleRun(run)
    return
  }

  if (event.key === "Escape") {
    editor.blur()
    return
  }

  // Tab would otherwise jump to the next link on the page.
  if (event.key === "Tab") {
    event.preventDefault()
    shift(editor, event.shiftKey)
    return
  }

  // Mojo, like Python, is written by indentation, so a new line starts where
  // the previous one did, and one step deeper after a colon. The curly-brace
  // languages do not need this, but they read better with it too, so an open
  // brace counts as well.
  if (event.key === "Enter") {
    const start = editor.selectionStart
    const line = editor.value.slice(
      editor.value.lastIndexOf("\n", start - 1) + 1,
      start,
    )
    const indent = /^[ \t]*/.exec(line)![0]
    const deeper = /[:{]\s*(\/\/.*|#.*)?$/.test(line) ? "    " : ""
    event.preventDefault()
    type(editor, `\n${indent}${deeper}`)
    fit(editor)
  }
}

export function useMojoRunner(): void {
  if (!inBrowser) return

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null
    if (!target) return

    const button = target.closest("button.mojo-run") as HTMLElement | null
    if (button) {
      void handleRun(button)
      return
    }

    const reset = target.closest("button.mojo-reset") as HTMLElement | null
    if (reset) {
      const block = blockOf(reset)
      if (block) stopEditing(block)
      return
    }

    // Clicking the code turns it into a text box. Not while the reader is
    // selecting something, though: that is a copy in the making, not an edit.
    const pre = target.closest("[data-run] > pre") as HTMLElement | null
    if (pre) {
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed) return
      startEditing(pre.parentElement as HTMLElement, clickOffset(pre, event))
      return
    }

    const close = target.closest("button.mojo-output-close")
    if (close) {
      dismissPanel(close.parentElement!.parentElement as HTMLElement)
      return
    }

    // Each tab keeps its own output. Wait for VitePress to move the `active`
    // class, then swap the panel over to the tab the reader has just opened.
    const tab = target.closest(".vp-code-group .tabs label")
    if (tab) {
      const group = tab.closest(".vp-code-group") as HTMLElement | null
      if (group) requestAnimationFrame(() => restore(group))
    }
  })
}
