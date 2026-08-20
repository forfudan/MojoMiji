/**
 * Run buttons on Mojo code blocks.
 *
 * The button itself is written into the HTML at build time (see `config.mts`),
 * so it is there before any JavaScript runs. It sits in the header line of the
 * block, which is the tab bar of a `::: code-group`, and it belongs to the tab
 * the reader has open. This file only listens for clicks on it.
 *
 * The code is compiled and run by Compiler Explorer (godbolt.org), the same
 * free service that Modular's own Mojo playground uses. Nothing runs on our
 * server, and the reader's browser talks to godbolt directly.
 */

import { inBrowser } from "vitepress"

/** Which Mojo the Run buttons use. Bump this when the Miji moves on. */
export const MOJO_COMPILER = "mojo_1_0_0"

const ENDPOINT = `https://godbolt.org/api/compiler/${MOJO_COMPILER}/compile`

/** The name we show in error messages, in place of godbolt's `<source>`. */
const FILE_NAME = "main.mojo"

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
}

// ---------------------------------------------------------------------------
// Talking to the compiler
// ---------------------------------------------------------------------------

type GodboltLine = { text?: string }

function join(lines: GodboltLine[] | undefined): string {
  return (lines ?? [])
    .map((line) => line.text ?? "")
    // Godbolt reports its own install path, which means nothing to a reader.
    .filter((text) => !text.startsWith("/opt/compiler-explorer/"))
    .join("\n")
    .replaceAll("<source>:", `${FILE_NAME}:`)
    .trimEnd()
}

/**
 * Compile and run one Mojo program. Exported on purpose: an exercise checker
 * can reuse this later without touching any of the DOM code below.
 */
export async function runMojo(
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
  }

  let response: Response
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      signal,
      body: JSON.stringify({
        source,
        lang: "mojo",
        allowStoreCodeDebug: true,
        options: {
          userArguments: "",
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
  return {
    built: build.code === 0,
    ran: Boolean(data.didExecute),
    exitCode: typeof data.code === "number" ? data.code : -1,
    stdout: join(data.stdout),
    stderr: join(data.stderr),
    buildStderr: join(build.stderr),
    network: null,
  }
}

// ---------------------------------------------------------------------------
// The buttons on the page
// ---------------------------------------------------------------------------

/** Same source, same answer. Saves godbolt a round trip and the reader a wait. */
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
  return group?.querySelector<HTMLElement>(".blocks > [data-mojo-run].active") ?? null
}

/** The header line of the group a block sits in. */
function tabsOf(block: HTMLElement): HTMLElement | null {
  return (
    block.closest(".vp-code-group")?.querySelector<HTMLElement>(":scope > .tabs") ??
    null
  )
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

/** The panel of a block, if it has one open. */
function panelOf(block: HTMLElement): HTMLElement | null {
  const next = anchorOf(block).nextElementSibling
  return next?.classList.contains("mojo-output") ? (next as HTMLElement) : null
}

/** The output panel that belongs to a block, created on first use. */
function outputPanel(block: HTMLElement): HTMLElement {
  const open = panelOf(block)
  if (open) {
    owner.set(open, block)
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
  owner.set(panel, block)
  block.classList.add("mojo-open")
  return panel
}

function closePanel(panel: HTMLElement): void {
  owner.get(panel)?.classList.remove("mojo-open")
  owner.delete(panel)
  panel.remove()
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
    if (open) closePanel(open)
    return
  }

  const source = readSource(block)
  const panel = outputPanel(block)

  const cached = cache.get(source)
  if (cached) {
    render(panel, cached, "")
    return
  }

  show(panel, "busy", "Compiling and running", "")
  button.setAttribute("data-busy", "")

  const controller = new AbortController()
  running.set(block, controller)
  const started = performance.now()

  try {
    const result = await runMojo(source, controller.signal)
    if (!panel.isConnected) return
    cache.set(source, result)
    render(panel, result, `${((performance.now() - started) / 1000).toFixed(1)} s`)
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
  editor.setAttribute("aria-label", "Mojo program, editable")

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
  if (panel) closePanel(panel)
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
  // the previous one did, and one step deeper after a colon.
  if (event.key === "Enter") {
    const start = editor.selectionStart
    const line = editor.value.slice(
      editor.value.lastIndexOf("\n", start - 1) + 1,
      start,
    )
    const indent = /^[ \t]*/.exec(line)![0]
    const deeper = /:\s*(#.*)?$/.test(line) ? "    " : ""
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
    const pre = target.closest("[data-mojo-run] > pre") as HTMLElement | null
    if (pre) {
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed) return
      startEditing(pre.parentElement as HTMLElement, clickOffset(pre, event))
      return
    }

    const close = target.closest("button.mojo-output-close")
    if (close) {
      closePanel(close.parentElement!.parentElement as HTMLElement)
      return
    }

    // Switching tab would leave the output of the old tab hanging under the
    // new one. Clear it away.
    const tab = target.closest(".vp-code-group .tabs label")
    if (tab) {
      const next = tab.closest(".vp-code-group")?.nextElementSibling
      if (next?.classList.contains("mojo-output")) {
        closePanel(next as HTMLElement)
      }
    }
  })
}
