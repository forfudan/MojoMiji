import { defineConfig } from 'vitepress'
import mdFootnote from "markdown-it-footnote"
import path from "node:path"
import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Mojo秘籍",
  description: "从Python出发",
  lang: "zh-Hans-CN",
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
        text: '开启攻略', link: '/docs/introduction'
      },
      { text: 'Mojo官网', link: 'https://www.modular.com/max/mojo/' }
    ],
    sidebar: {
      '/docs': [
        {
          items: [{ text: '简介', link: '/docs/introduction' },]
        },
        {
          items: [{ text: '变量', link: '/docs/variables' },]
        },
        {
          items: [{ text: '类型', link: '/docs/types' },]
        },
        {
          items: [{ text: '所有权', link: '/docs/ownership' },]
        },
        // {
        //   items: [{ text: '', link: '/docs/' },]
        // },
      ],

    },
    footer: {
      message: "Mojo秘籍",
      copyright: "Yuhao Zhu 朱宇浩 © 2024 Under CC BY-NC-ND 4.0 license",
    },
    darkModeSwitchLabel: "黑暗模式",
    langMenuLabel: "选择语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "目录",
    outline: {
      level: "deep",
      label: "本页大纲"
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonAriaLabel: "搜索",
            buttonText: "搜索",
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
      label: '简化汉字',
      lang: 'zh-Hans-CN'
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
          { text: 'Mojo官网', link: 'https://www.modular.com/max/mojo/' }
        ],
        sidebar: {
          '/zht/docs': [
            {
              items: [{ text: '简介', link: '/zht/docs/introduction' },]
            },
            {
              items: [{ text: '变量', link: '/zht/docs/variables' },]
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
