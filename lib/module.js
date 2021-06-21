/**
 * nuxt-router-ui
 * A dope as f*ck router UI for Nuxt and Vue
 * applications.
 *
 * (c) Richard Schloss 2021
 */

import { readFileSync } from 'fs'
import { dirname, resolve as pResolve } from 'path'
import { fileURLToPath } from 'url'
import { register } from './module.register.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const { name: pkgName } = JSON.parse(readFileSync(pResolve(__dirname, '../package.json'), { encoding: 'utf-8' }))

export default function module (moduleOptions) {
  const options = Object.assign({}, this.options.routerUI, moduleOptions)

  register.modules(this, ['bootstrap-vue/nuxt'])
  register.templates(this, { dirs: ['VueD3'], files: ['plugin.register.js'] })

  this.addPlugin({
    ssr: false,
    src: pResolve(__dirname, 'plugin.js'),
    fileName: `${pkgName}/plugin.js`,
    options
  })
}
