import { writeFileSync } from 'fs'
import Vue from 'vue'
import test from 'ava'

const script = `import Vue from 'vue'
import Draggable from './VueD3/Draggable.js'
Vue.component('Draggable', Draggable)
`
writeFileSync('./lib/components.js', script)

test('Plugin', async (t) => {
  await import('../lib/plugin.js')
  t.truthy(Vue.component('Draggable'))
  t.truthy(Vue._installedPlugins.length > 0)
})
