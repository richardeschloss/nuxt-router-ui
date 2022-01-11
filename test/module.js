import { resolve } from 'path'
import test from 'ava'
import Module from '../lib/module.js'
import { initNuxt, useNuxt } from './utils/module.js'

global.__dirname = '/path/to/lib'

test('Module: adds plugin', async (t) => {
  initNuxt()
  await Module({}, useNuxt())
  const nuxt = useNuxt()
  const [plugin] = nuxt.options.plugins
  t.is(plugin.src, resolve(__dirname, 'plugin.js'))
  t.is(nuxt.options.build.transpile[0], __dirname)
})
