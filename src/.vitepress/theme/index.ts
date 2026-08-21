// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { useMediumZoomProvider } from '../hooks'
import './style.css'
import './fonts.css'
import './custom.css'
import './mojoRunner.css'
import { useMojoRunner } from './mojoRunner'
// Group icons plugin
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,

  enhanceApp({ app, router, siteData }) {
    // 图片放大
    useMediumZoomProvider(app, router)
  },

  // Run buttons on Mojo code blocks. This one goes in `setup()` rather than
  // `enhanceApp()`, because it needs to wait for the page to be mounted.
  setup() {
    useMojoRunner()
  }
} satisfies Theme