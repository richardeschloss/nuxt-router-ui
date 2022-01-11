/**
 * nuxt-router-ui
 * A router UI for Nuxt and Vue applications.
 *
 * (c) Richard Schloss 2022
 */

import { resolve } from 'path'
import { defineNuxtModule, addPlugin } from '@nuxt/kit'

export default defineNuxtModule({
  setup (_, nuxt) {
    nuxt.options.build.transpile.push(__dirname)
    addPlugin({
      src: resolve(__dirname, 'plugin.js')
    })
  }
})
