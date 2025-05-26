import { defineConfig } from 'vitepress'
import mdFootnote from "markdown-it-footnote"
import path from "node:path"
import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"

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
      md.use(mdFootnote)
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.png', type: 'image/png' }]
  ],
  vite: {
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../../components'),
      }
    }
  },
  themeConfig: {
    logo: '/logo.png',
    nav: [
      {
        text: 'Open Miji', link: '/docs/'
      },
      { text: 'Mojo official', link: 'https://www.modular.com/max/mojo/' },
      { text: 'Repo', link: 'https://github.com/forFudan/MojoMiji' }
    ],
    sidebar: {
      '/docs': [
        {
          text: 'Table of Content',
          link: '/docs/'
        },
        {
          text: 'Introduction',
          link: '/docs/intro'
        },
        {
          text: 'PART I: START WITH MOJO',
          link: '/docs/start/start',
          items: [
            {
              text: 'Install Magic', link: '/docs/start/install'
            },
            {
              text: 'Initiate Mojo project', link: '/docs/start/initiate'
            },
            {
              text: 'My first Mojo program', link: '/docs/start/hello'
            }
          ],
        },
        {
          text: 'PART II: MOVE INTO MOJO',
          link: '/docs/move/move',
          items: [
            {
              text: 'Convert Python code into Mojo', link: '/docs/move/examples'
            },
            {
              text: 'Things that are in common', link: '/docs/move/common'
            },
            {
              text: 'Things that are different', link: '/docs/move/different'
            },
          ],
        },
        {
          text: 'PART III: BASIC MOJO',
          link: '/docs/basic/basic',
          items: [
            {
              text: 'Variables', link: '/docs/basic/variables',
            },
            {
              text: 'Functions', link: '/docs/basic/functions',
            },
            {
              text: 'Data types', link: '/docs/basic/types',
              items: [
                { text: "Numeric types" },
                { text: "String" },
                { text: "Boolean" },
                { text: "Composite types" },
              ]
            },
            {
              text: 'Data type - SIMD', link: '/docs/basic/simd',
            },
            {
              text: 'Operators', link: '/docs/basic/operators',
            },
          ],
        },
        {
          text: 'PART IV: ADVANCED MOJO', link: '/docs/advanced/advanced',
          items: [
            {
              text: 'Ownership',
              link: '/docs/advanced/ownership'
            },
          ]
        },
        {
          text: 'PART VI: EXTENDED MOJO', link: '/docs/extensions/extensions',
          items: [
            {
              text: 'DeciMojo',
              link: '/docs/extensions/decimojo'
            },
            {
              text: 'NuMojo',
              link: '/docs/extensions/numojo'
            },
          ]
        },
        {
          text: 'PART VI: MISCELLANEOUS',
          items: [
            {
              text: 'Memory layout of Mojo objects',
              link: '/docs/misc/layout'
            },
            {
              text: 'Reference system',
              link: '/docs/misc/reference'
            },
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
      message: "Mojo Miji · Mojo 秘籍",
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
      { icon: 'github', link: 'https://github.com/forFudan/' },
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
  //       logo: '/logo.png',
  //       nav: [
  //         { text: '開啓攻略', link: '/zht/docs/intro' },
  //         { text: 'Mojo官網', link: 'https://www.modular.com/max/mojo/' }
  //       ],
  //       sidebar: {
  //         '/zht/docs': [
  //           {
  //             items: [{ text: '簡介', link: '/zht/docs/intro' },]
  //           },
  //           {
  //             items: [{ text: '變量', link: '/zht/docs/variables' },]
  //           },
  //           {
  //             items: [{ text: '類型', link: '/zht/docs/types' },]
  //           },
  //         ],
  //       },
  //     }
  //   },
  // },
})
