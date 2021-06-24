import Vue from 'vue'
// import { BButton } from 'bootstrap-vue'
// import { ButtonPlugin } from 'bootstrap-vue/src/components/button/index.js'
// import { ModalPlugin } from 'bootstrap-vue/src/components/modal/index.js'

// Vue.component('b-button', BButton)
// Vue.use(ButtonPlugin)
// Vue.use(ModalPlugin) // modal uses the bbutton

export const register = {
  components (r) {
    r.keys().forEach((filename) => {
      let Component = r(filename)

      Component = Component.default || Component
      Component.name =
        Component.name || filename.replace(/^.+\//, '').replace(/\.\w+$/, '')

      Vue.component(Component.name, Component)
    })
  }
}
