import { readFileSync } from 'fs'
import { eventHandler } from 'h3'

export default defineNuxtConfig({
  telemetry: false,
  target: process.env.NODE_ENV === 'production'
    ? 'static'
    : 'server',
  head: {
    title: 'nuxt-router-ui',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  modules: [
    '~/lib/module.js'
  ],
  devServerHandlers: [{
    route: '/README.md',
    handler: eventHandler(() => {
      return readFileSync('./README.md', { encoding: 'utf-8' })
    })
  }]
})
