/**
 * nuxt-router-ui
 * A dope as f*ck router UI for Nuxt and Vue
 * applications.
 *
 * (c) Richard Schloss 2021
 */

import { resolve } from 'path'
import { defineNuxtModule, addPlugin } from '@nuxt/kit'

export default defineNuxtModule({
  setup () {
    addPlugin({
      src: resolve(__dirname, 'plugin.js')
    })
  }
})
