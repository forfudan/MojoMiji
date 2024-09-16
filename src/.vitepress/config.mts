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
    ['link', { rel: 'icon', href: '/logo.jpg', type: 'image/png' }]
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
    logo: '/logo.jpg',
    nav: [
      {
        text: 'Open Miji', link: '/docs/introduction'
      },
      { text: 'Mojo official', link: 'https://www.modular.com/max/mojo/' },
      { text: 'Repo', link: 'https://github.com/forFudan/MojoMiji'}
    ],
    sidebar: {
      '/docs': [
        {
          items: [{ text: 'Introduction', link: '/docs/introduction' },]
        },
        {
          items: [{ text: 'variables', link: '/docs/variables' },]
        },
        {
          items: [{ text: 'types', link: '/docs/types' },]
        },
        {
          items: [{ text: 'ownership', link: '/docs/ownership' },]
        },
        // {
        //   items: [{ text: '', link: '/docs/' },]
        // },
      ],
    },
    footer: {
      message: "Mojo Miji",
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
            displayDetails: "展示详细内容",
            resetButtonTitle: "清空关键词",
            noResultsText: "搜索不到，请换个关键词",
            backButtonTitle: "返回",
            footer: {
              selectText: "进入网页",
              navigateText: "浏览",
              navigateDownKeyAriaLabel: "下键",
              navigateUpKeyAriaLabel: "上键",
              closeKeyAriaLabel: "关闭",
              closeText: "取消搜索",
            },
          },
        },
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/forFudan/' },
    ]
  },


  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    zhs: {
      label: "简化汉字",
      lang: "zh-Hans-CN",
      title: "Mojo入门指南",
      description: "从Python出发",
      themeConfig: {
        logo: '/logo.jpg',
        nav: [
          { text: '开启攻略', link: '/zhs/docs/introduction' },
          { text: 'Mojo官网', link: 'https://www.modular.com/max/mojo/' }
        ],
        sidebar: {
          '/zhs/docs': [
            {
              items: [{ text: '简介', link: '/zhs/docs/introduction' },]
            },
            {
              items: [{ text: '变量', link: '/zhs/docs/variables' },]
            },
            {
              items: [{ text: '類型', link: '/zhs/docs/types' },]
            },
          ],
        },
      }
    },
    zht: {
      label: "傳統漢字",
      lang: "zh-Hans-CN",
      title: "Mojo入門指南",
      description: "從Python出發",
      themeConfig: {
        logo: '/logo.jpg',
        nav: [
          { text: '開啓攻略', link: '/zht/docs/introduction' },
          { text: 'Mojo官網', link: 'https://www.modular.com/max/mojo/' }
        ],
        sidebar: {
          '/zht/docs': [
            {
              items: [{ text: '簡介', link: '/zht/docs/introduction' },]
            },
            {
              items: [{ text: '變量', link: '/zht/docs/variables' },]
            },
            {
              items: [{ text: '類型', link: '/zht/docs/types' },]
            },
          ],
        },
      }
    },
  },
})
