import { resolve } from 'path'
import test from 'ava'
import Module from '../lib/module.js'
import { wrapModule } from './utils/module.js'

global.__dirname = '/path/to/lib'

const delay = ms => new Promise(resolve =>
  setTimeout(resolve, ms)
)

test('Module: adds plugin', async (t) => {
  const ctx = wrapModule(Module)
  ctx.Module({})
  await delay(100)
  const plugin0 = ctx.nuxt.options.plugins[0]
  t.is(plugin0.src, resolve(__dirname, 'plugin.js'))
})
