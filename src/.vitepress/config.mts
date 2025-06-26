import { defineConfig } from 'vitepress'
import mdFootnote from "markdown-it-footnote"
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
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/icon.png', type: 'image/png' }]
  ],
  vite: {
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
          'ruby': 'vscode-icons:file-type-ruby',
          'rust': 'vscode-icons:file-type-rust',
          'perl': 'vscode-icons:file-type-perl',
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
      // {
      //   text: 'Open Miji', link: '/miji/'
      // },
      { text: 'List of Mojo resources', link: '/miji/misc/resources' },
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
              text: 'Install pixi and extension', link: '/miji/start/pixi'
            },
            {
              text: 'Initiate Mojo project', link: '/miji/start/project'
            },
            {
              text: 'My first Mojo program', link: '/miji/start/hello'
            }
          ],
        },
        {
          text: 'PART II: MOVE INTO MOJO',
          link: '/miji/move/move',
          items: [
            {
              text: 'Convert Python code into Mojo', link: '/miji/move/examples'
            },
            {
              text: 'Things that are in common', link: '/miji/move/common'
            },
            {
              text: 'Things that are different', link: '/miji/move/different'
            },
          ],
        },
        {
          text: 'PART III: BASIC MOJO',
          link: '/miji/basic/basic',
          items: [
            {
              text: 'Variables', link: '/miji/basic/variables',
            },
            {
              text: 'Data types - basic', link: '/miji/basic/types',
            },
            {
              text: 'Data types - composite', link: '/miji/basic/composite',
            },
            {
              text: 'Data type - string', link: '/miji/basic/string',
            },
            {
              text: 'Literals and type inference', link: '/miji/basic/literal',
            },
            {
              text: 'Functions', link: '/miji/basic/functions',
            },
            {
              text: 'Operators and assignment', link: '/miji/basic/operators',
            },
            {
              text: 'Control flows', link: '/miji/basic/control',
            },
            {
              text: 'Structs', link: '/miji/basic/structs',
            },
            {
              text: "Modules and packages", link: '/miji/basic/packages',
            }
          ],
        },
        {
          text: 'PART IV: ADVANCED MOJO', link: '/miji/advanced/advanced',
          items: [
            {
              text: 'Data type - SIMD', link: '/miji/advanced/simd',
            },
            {
              text: 'Parameterization', link: '/miji/advanced/parameterization',
            },
            {
              text: 'Generic and traits', link: '/miji/advanced/generic',
            },
            {
              text: 'Ownership',
              link: '/miji/advanced/ownership'
            },
            {
              text: 'References and pointers',
              link: '/miji/advanced/references'
            },
            {
              text: 'Lifetimes and origins',
              link: '/miji/advanced/lifetimes'
            }
          ]
        },
        {
          text: 'PART V: APPLY MOJO', link: '/miji/apply/apply',
          items: [
            {
              text: 'Design of MatMojo library',
              link: '/miji/apply/design'
            },
            {
              text: 'Make it work',
              link: '/miji/apply/work'
            },
          ]
        },
        {
          text: 'PART VI: EXTEND MOJO', link: '/miji/extend/extend',
          items: [
            {
              text: 'Arbitrary-precision numbers',
              link: '/miji/extend/decimojo'
            },
            {
              text: 'Multi-dimensional arrays',
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
              text: 'Wishes for extra features',
              link: '/miji/misc/wishes'
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
    sidebarMenuLabel: "Table of content",
    outline: {
      level: "deep",
      label: "Headings"
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
