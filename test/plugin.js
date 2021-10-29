import { readdirSync } from 'fs'
import Vue from 'vue'
import test from 'ava'
import '../lib/plugin.js'

test('Plugin', (t) => {
  const components = readdirSync('./lib/VueD3')
    .filter(f => f.endsWith('.js'))
    .map(f => f.replace(/^.+\//, '').replace(/\.\w+$/, ''))
  components.forEach((name) => {
    t.truthy(Vue.component(name))
  })
})
