import { resolve } from 'path'
import test from 'ava'
import Module from '../lib/module.js'

global.__dirname = '/path/to/lib'

test('Module: adds plugin', (t) => {
  const ctx = {
    nuxt: {
      version: '3.0',
      hook () {},
      options: {
        plugins: []
      },
      /**
       * @param {any} plugin
       */
      addPlugin (plugin) {
        this.options.plugins.push(plugin)
      }
    },
    Module
  }
  ctx.Module({})
  const plugin0 = ctx.nuxt.options.plugins[0]
  t.is(plugin0.src, resolve(__dirname, 'plugin.js'))
})
