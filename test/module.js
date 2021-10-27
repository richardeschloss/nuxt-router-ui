import { resolve as pResolve } from 'path'
import test from 'ava'
import Module from '../lib/module.js'

test('Module', (t) => {
  const opts = { extra: 111 }
  const ctx = {
    Module,
    options: {
      build: {
        templates: []
      },
      plugins: [],
      modules: [],
      routerUI: 123
    },
    addTemplate ({ src, fileName: dst }) {
      ctx.options.build.templates.push({ src, dst })
    },
    addPlugin ({
      ssr,
      src,
      fileName,
      options
    }) {
      ctx.options.plugins.push({ ssr, src, fileName, options })
      t.false(ssr)
      t.is(src, pResolve('./lib/plugin.js'))
      t.is(fileName, 'nuxt-router-ui/plugin.js')
      t.is(
        JSON.stringify(options),
        JSON.stringify({ ...ctx.options.routerUI, ...opts })
      )
    }
  }

  ctx.Module(opts)
  t.true(ctx.options.build.templates.length > 0)
  t.true(ctx.options.plugins.length > 0)
})
