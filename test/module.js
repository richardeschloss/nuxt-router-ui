import { resolve as pResolve } from 'path'
import test from 'ava'
import Module from '../lib/module.js'

test('Module', (t) => {
  const _modsAdded = []
  const _tmplsAdded = []
  const opts = { extra: 111 }
  const ctx = {
    Module,
    options: {
      modules: [],
      routerUI: 123
    },
    addModule (mod) {
      _modsAdded.push(mod)
    },
    addTemplate (tmpl) {
      _tmplsAdded.push(tmpl)
    },
    addPlugin ({
      ssr,
      src,
      fileName,
      options
    }) {
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
})
