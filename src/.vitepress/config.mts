import { defineConfig } from 'vitepress'
import mdFootnote from "markdown-it-footnote"
import mdContainer from "markdown-it-container"
import path from "node:path"
import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Mojo Miji",
  description: "From Pythonic to Magician",
  lang: "en",
  outDir: "../dist",
  markdown: {
    math: true,
    theme: {
      light: "light-plus",
      dark: "material-theme-palenight",
    },
    config: (md) => {
      md.use(mdFootnote, groupIconMdPlugin)

      // --- a header line on every code block ---------------------------------
      // VitePress draws a tab bar for a `::: code-group`, and it builds that
      // bar from the fences inside the group. So a block standing on its own
      // is wrapped in a group of one here, at build time, and comes out with
      // the same header. No Markdown file has to change.
      //
      // The header names the language, which the faint label in the corner did
      // badly, and it gives the Run button a place of its own.
      //
      // Blocks that are not code in a language are left alone: `console` holds
      // what a program printed, `txt` holds diagrams and file trees. Neither
      // has a name worth putting in a header.
      const plain = new Set(["", "console", "txt", "text", "output"])

      const inGroup = (tokens: any[], i: number): boolean => {
        for (let j = i - 1; j >= 0; j--) {
          if (tokens[j].type === "container_code-group_open") return true
          if (tokens[j].type === "container_code-group_close") return false
        }
        return false
      }

      md.core.ruler.push("miji-code-group", (state) => {
        const tokens = state.tokens
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i]
          if (token.type !== "fence" || token.tag !== "code") continue
          if (plain.has(token.info.trim().split(/\s+/)[0])) continue
          if (inGroup(tokens, i)) continue

          const open = new state.Token("container_code-group_open", "div", 1)
          const close = new state.Token("container_code-group_close", "div", -1)
          open.block = true
          close.block = true
          tokens.splice(i, 0, open)
          tokens.splice(i + 2, 0, close)
          i += 2 // past the fence and the token now closing it
        }
      })

      // --- Run buttons on code blocks ----------------------------------------
      // A block gets a Run button only if it is a complete program. What that
      // means depends on the language, but in every one of these it comes down
      // to the same thing: does the block have a `main`?
      //
      // Mojo and Python are the two the Miji is about. The other five are here
      // because the Miji compares Mojo to them, and because Compiler Explorer
      // runs them all through the very same request. Adding one costs a line.
      const RUNNABLE: Record<string, RegExp> = {
        mojo: /^\s*(def|fn)\s+main\s*\(/m,
        python: /^\s*def\s+main\s*\(/m,
        c: /^\s*(int|void)\s+main\s*\(/m,
        rust: /^\s*fn\s+main\s*\(/m,
        go: /^\s*func\s+main\s*\(/m,
        swift: /^\s*func\s+main\s*\(/m,
        zig: /^\s*pub\s+fn\s+main\s*\(/m,
      }

      // Two markers in the fence line override the guess:
      //   ```mojo run     -- always give this block a Run button
      //   ```mojo norun   -- never give this block a Run button
      // `norun` earns its keep more often than you would think. Godbolt has a
      // bare compiler and no package manager, so a block that imports `decimo`
      // cannot run there; and it stops a program after about twenty seconds,
      // so a deliberately slow one cannot either.
      const isRunnable = (token: any): boolean => {
        const words = token.info.trim().split(/\s+/)
        const rule = RUNNABLE[words[0]]
        if (!rule) return false
        const marked = words.slice(1)
        if (marked.includes("norun")) return false
        return marked.includes("run") || rule.test(token.content)
      }

      // The block itself only gets a mark, naming its language, so that the
      // script knows which compiler to ask, and so that the reader can click
      // the code to edit it.
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
        const token = tokens[idx]
        const words = token.info.trim().split(/\s+/)
        if (!(words[0] in RUNNABLE)) return fence(tokens, idx, opts, env, self)

        const runnable = isRunnable(token)
        // Keep the markers out of the fence line, so that the highlighter
        // never sees them.
        token.info = words.filter((w) => w !== "run" && w !== "norun").join(" ")

        const html = fence(tokens, idx, opts, env, self)
        if (!runnable) return html
        return html.replace(
          /^<div class="language-/,
          `<div data-run="${words[0]}" class="language-`,
        )
      }

      // The button goes at the right end of the header line, and it belongs to
      // whichever tab is open. In a group whose Mojo tab can run and whose
      // Rust tab cannot, it is there on the one and gone on the other; the CSS
      // does that, by looking at which block is showing.
      const button =
        '<button class="mojo-run" type="button" ' +
        'title="Run this program">' +
        '<span class="mojo-run-icon"></span>' +
        '<span class="mojo-btn-text">Run</span></button>'

      const groupOpen = md.renderer.rules["container_code-group_open"]!
      md.renderer.rules["container_code-group_open"] = (
        tokens, idx, opts, env, self,
      ) => {
        const html = groupOpen(tokens, idx, opts, env, self)
        let runnable = false
        for (let i = idx + 1; i < tokens.length; i++) {
          const token = tokens[i]
          if (token.type === "container_code-group_close") break
          if (token.type === "fence" && isRunnable(token)) {
            runnable = true
            break
          }
        }
        if (!runnable) return html
        return html.replace(
          '</div><div class="blocks">',
          `${button}</div><div class="blocks">`,
        )
      }

      // Two containers of our own, on top of VitePress's
      // info / tip / warning / danger / details.
      //   ::: python   -- how the same thing is done in Python
      //   ::: version  -- what changed in which Mojo release
      for (const [name, fallback] of [
        ["python", "COMING FROM PYTHON"],
        ["version", "MOJO VERSIONS"],
      ]) {
        md.use(mdContainer, name, {
          render(tokens, idx) {
            const token = tokens[idx]
            if (token.nesting !== 1) return "</div>\n"
            const title = token.info.trim().slice(name.length).trim()
            return `<div class="${name} custom-block"><p class="custom-block-title">${
              md.renderInline(title || fallback)
            }</p>\n`
          },
        })
      }
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/icon.png', type: 'image/png' }]
  ],
  vite: {
    build: {
      chunkSizeWarningLimit: 1000, // Increase limit to 1000KB to suppress warning
    },
    css: {
      postcss: {
        // plugins: [tailwind(), autoprefixer()],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../../components'),
      }
    },
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          'mojo': 'vscode-icons:file-type-mojo',
          'python': 'vscode-icons:file-type-python',
          'py': 'vscode-icons:file-type-python',
          'bash': 'vscode-icons:file-type-shell',
          'sh': 'vscode-icons:file-type-shell',
          'zsh': 'vscode-icons:file-type-shell',
          'ruby': 'vscode-icons:file-type-ruby',
          'rust': 'vscode-icons:file-type-rust',
          'perl': 'vscode-icons:file-type-perl',
          'c': 'vscode-icons:file-type-c',
          'zig': 'vscode-icons:file-type-zig',
          'go': 'vscode-icons:file-type-go',
          'swift': 'vscode-icons:file-type-swift',
          'toml': 'vscode-icons:file-type-toml',
          'yaml': 'vscode-icons:file-type-yaml',
          'json': 'vscode-icons:file-type-json',
          'md': 'vscode-icons:file-type-markdown',
        }
      })
    ]
  },
  themeConfig: {
    logo: '/icon.png',
    nav: [
      { text: 'Repo of example programs in this Miji', link: 'https://github.com/forfudan/my-first-mojo-project' },
    ],
    logoLink: {
      link: 'https://mojo-lang.com/miji',
      target: '_self',
    },
    sidebar: {
      '/miji': [
        {
          text: 'Table of Content',
          link: '/miji/'
        },
        {
          text: 'Introduction',
          link: '/miji/intro'
        },
        {
          text: 'PART I: START WITH MOJO',
          link: '/miji/start/start',
          items: [
            // {
            //   text: 'Install magic (being deprecated)', link: '/miji/start/magic'
            // },
            {
              text: '1 Install pixi and extension', link: '/miji/start/pixi'
            },
            {
              text: '2 Initiate Mojo project', link: '/miji/start/project'
            },
            {
              text: '3 My first Mojo program', link: '/miji/start/hello'
            }
          ],
        },
        {
          text: 'PART II: MOVE INTO MOJO',
          link: '/miji/move/move',
          items: [
            {
              text: '4 Convert Python code into Mojo', link: '/miji/move/examples'
            },
            {
              text: '5 Things that are in common', link: '/miji/move/common'
            },
            {
              text: '6 Things that are different', link: '/miji/move/different'
            },
          ],
        },
        {
          text: 'PART III: BASIC MOJO',
          link: '/miji/basic/basic',
          items: [
            {
              text: '7 Variables', link: '/miji/basic/variables',
            },
            {
              text: '8 Copy and move', link: '/miji/basic/copy',
            },
            {
              text: '9 Data types - basic', link: '/miji/basic/types',
            },
            {
              text: '10 Data types - composite', link: '/miji/basic/composite',
            },
            {
              text: '11 Data type - string', link: '/miji/basic/string',
            },
            {
              text: '12 Literals and type inference', link: '/miji/basic/literal',
            },
            {
              text: '13 Functions', link: '/miji/basic/functions',
            },
            {
              text: '14 Operators and assignment', link: '/miji/basic/operators',
            },
            {
              text: '15 Control flows', link: '/miji/basic/control',
            },
            {
              text: "16 Error handling and raises", link: '/miji/basic/errors',
            },
            {
              text: '17 Structs', link: '/miji/basic/structs',
            },
            {
              text: "18 Modules and packages", link: '/miji/basic/packages',
            },
            {
              text: '19 Use Python in Mojo', link: '/miji/basic/py4mojo',
            }
          ],
        },
        {
          text: 'PART IV: ADVANCED MOJO', link: '/miji/advanced/advanced',
          items: [
            {
              text: '20 Data type - SIMD', link: '/miji/advanced/simd',
            },
            {
              text: '21 Parameterization', link: '/miji/advanced/parameterization',
            },
            {
              text: '22 Generic and traits', link: '/miji/advanced/generic',
            },
            {
              text: '23 Ownership',
              link: '/miji/advanced/ownership'
            },
            {
              text: '24 References and pointers',
              link: '/miji/advanced/references'
            },
            {
              text: '25 Lifetimes and origins',
              link: '/miji/advanced/lifetimes'
            }
          ]
        },
        {
          text: 'PART V: APPLY MOJO', link: '/miji/apply/apply',
          items: [
            {
              text: '26 Calendar app in Mojo',
              link: '/miji/apply/calendar'
            },
            {
              text: '27 Matrix library in Mojo',
              link: '/miji/apply/matrix'
            },
          ]
        },
        {
          text: 'PART VI: EXTEND MOJO', link: '/miji/extend/extend',
          items: [
            {
              text: '28 Arbitrary-precision numbers',
              link: '/miji/extend/decimo'
            },
            {
              text: '29 Multi-dimensional arrays',
              link: '/miji/extend/numojo'
            },
          ]
        },
        {
          text: 'PART VII: MISCELLANEOUS',
          items: [
            // {
            //   text: 'Memory layout of Mojo objects',
            //   link: '/miji/misc/layout'
            // },
            {
              text: 'Glossary of Mojo terms',
              link: '/miji/misc/glossary'
            },
            {
              text: 'Tips and warnings',
              link: '/miji/misc/tips'
            },
            {
              text: 'Useful resources and links',
              link: '/miji/misc/resources'
            },
            {
              text: 'About the author',
              link: '/miji/misc/author'
            }
          ]
        },
      ],
      '/numojo': [
        { items: [{ text: 'Introduction', link: '/numojo/intro' }] },
        {
          text: 'TYPES',
          items: [
            {
              text: 'NDArray',
              link: '/numojo/ndarray'
            },
            {
              text: 'View of array',
              link: '/numojo/view'
            },
          ]
        },
      ]
    },
    footer: {
      message: "Mojo Miji - A Guide to Mojo Programming Language from A Pythonista's Perspective · 魔咒秘籍 - Pythonista 視角下的 Mojo 編程語言指南",
      copyright: "Yuhao Zhu 朱宇浩 © 2024 Under CC BY-NC-ND 4.0 license",
    },
    darkModeSwitchLabel: "Dark mode",
    langMenuLabel: "Select Language",
    returnToTopLabel: "Back to top",
    sidebarMenuLabel: "Table of content - Miji",
    outline: {
      level: "deep",
      label: "Sections of this chapter"
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonAriaLabel: "Search",
            buttonText: "Search",
          },
          modal: {
            displayDetails: "Display details",
            resetButtonTitle: "Rest keywords",
            noResultsText: "Found nothing, please use other keywords",
            backButtonTitle: "Back",
            footer: {
              selectText: "Go to the page",
              navigateText: "browse",
              navigateDownKeyAriaLabel: "Down",
              navigateUpKeyAriaLabel: "Up",
              closeKeyAriaLabel: "Close",
              closeText: "Quit search",
            },
          },
        },
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/forFudan/MojoMiji' },
    ]
  },

  // locales: {
  //   root: {
  //     label: 'English',
  //     lang: 'en'
  //   },
  //   zht: {
  //     label: "傳統漢字",
  //     lang: "zh-Hans-CN",
  //     title: "Mojo入門指南",
  //     description: "從Python出發",
  //     themeConfig: {
  //       logo: '/icon.png',
  //       nav: [
  //         { text: '開啓攻略', link: '/zht/miji/intro' },
  //         { text: 'Mojo官網', link: 'https://www.modular.com/max/mojo/' }
  //       ],
  //       sidebar: {
  //         '/zht/miji': [
  //           {
  //             items: [{ text: '簡介', link: '/zht/miji/intro' },]
  //           },
  //           {
  //             items: [{ text: '變量', link: '/zht/miji/variables' },]
  //           },
  //           {
  //             items: [{ text: '類型', link: '/zht/miji/types' },]
  //           },
  //         ],
  //       },
  //     }
  //   },
  // },
})
