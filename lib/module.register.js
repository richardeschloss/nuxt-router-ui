import { readdirSync, readFileSync } from 'fs'
import { dirname, resolve as pResolve } from 'path'
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(readFileSync(pResolve(__dirname, '../package.json'), { encoding: 'utf-8' }))

export const register = {
  modules (ctx, mods = []) {
    mods.forEach((mod) => {
      if (!ctx.options.modules.includes(mod)) {
        ctx.addModule(mod)
      }
    })
  },
  templates (ctx, { dirs = [], files = [] }) {
    dirs.forEach((dir) => {
      const files = readdirSync(pResolve(__dirname, dir))
      files.forEach((f) => {
        ctx.addTemplate({
          src: pResolve(__dirname, dir, f),
          fileName: `${pkg.name}/${dir}/${f}`
        })
      })
    })

    files.forEach((f) => {
      ctx.addTemplate({
        src: pResolve(__dirname, f),
        fileName: `${pkg.name}/${f}`
      })
    })
  }
}