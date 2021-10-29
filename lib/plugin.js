import D3RouterUI from './VueD3/D3RouterUI.js'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('D3RouterUI', D3RouterUI)
})
