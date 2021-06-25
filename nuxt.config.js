import { promisify } from 'util'
import Glob from 'glob'

async function staticRoutes () {
  const glob = promisify(Glob)
  const files = await glob('./stories/**/*.{vue,js,md}')
  const routes = files
    .map(f => f
      .replace('./', '/')
      .replace(/(.js|.vue|.md)/, ''))

  return routes
}

export default {
  telemetry: false,
  target: process.env.NODE_ENV === 'production'
    ? 'static'
    : 'server',
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'nuxt-router-ui',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    'nuxt-stories',
    '~/lib/module.js'
  ],

  stories: { forceBuild: true, staticHost: process.env.NODE_ENV === 'production' },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    babel: {
      compact: true
    }
  },

  generate: {
    routes () {
      return staticRoutes()
    }
  }
}
