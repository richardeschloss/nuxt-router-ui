import test from 'ava'
import { setup } from '#app'

test('Plugin', async (t) => {
  const nuxt = {
    vueApp: {
      components: [],
      component (name, obj) {
        nuxt.vueApp.components.push({ name, obj })
      }
    }
  }
  setup(nuxt)
  await import('../lib/plugin.js')

  const expComponents = [
    'D3RouterUI'
  ]
  expComponents.forEach((c, idx) => {
    t.is(nuxt.vueApp.components[idx].name, c)
  })
})
