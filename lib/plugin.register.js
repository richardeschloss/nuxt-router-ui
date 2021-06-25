import Vue from 'vue'
import { ButtonPlugin, ModalPlugin } from 'bootstrap-vue'

export const register = {
  components (r) {
    r.keys().forEach((filename) => {
      let Component = r(filename)

      Component = Component.default || Component
      Component.name =
        Component.name || filename.replace(/^.+\//, '').replace(/\.\w+$/, '')

      Vue.component(Component.name, Component)
    })
  },
  plugins() {
    const plugins = [
      ButtonPlugin,
      ModalPlugin
    ]
    plugins.forEach((p) => Vue.use(p))
  }
}
