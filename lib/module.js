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
  setup (moduleOptions, nuxt) {
    // -- Hook never called :( --
    // nuxt.hook('component:dirs', (dirs) => {
    //   dirs.push({
    //     path: resolve(__dirname, 'VueD3'),
    //     prefix: 'NuxtRouterUI'
    //   })
    // })
    // ---
    addPlugin({
      ssr: false,
      src: resolve(__dirname, 'plugin.js')
    })
  }
})
