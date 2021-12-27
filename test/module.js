import { resolve } from 'path'
import test from 'ava'
import Module from '../lib/module.js'
import { initNuxt, useNuxt } from './utils/module.js'

global.__dirname = '/path/to/lib'

test('Module: adds plugin', async (t) => {
  initNuxt()
  await Module({}, useNuxt())
  const plugin0 = useNuxt().options.plugins[0]
  t.is(plugin0.src, resolve(__dirname, 'plugin.js'))
})
