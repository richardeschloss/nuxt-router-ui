/**
 * nuxt-router-ui
 * A dope as f*ck router UI for Nuxt and Vue
 * applications.
 *
 * (c) Richard Schloss 2021
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, resolve as pResolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(pResolve(__dirname, '../package.json'), { encoding: 'utf-8' }))

export default function module (moduleOptions) {
  const options = {
    ...this.options.routerUI,
    ...moduleOptions
  }

  const dir = 'VueD3'
  const files = readdirSync(pResolve(__dirname, dir))
  files.forEach((f) => {
    this.addTemplate({
      src: pResolve(__dirname, dir, f),
      fileName: `${pkg.name}/${dir}/${f}`
    })
  })

  let autoImportScript = 'import Vue from \'vue\'\r\n'
  const components = this.options.build.templates
    .filter(entry => entry.dst.startsWith(`${pkg.name}/${dir}`) && entry.dst.endsWith('.js'))
    .map(({ dst }) => {
      return {
        name: dst.replace(/^.+\//, '').replace(/\.\w+$/, ''),
        dst: dst.replace(pkg.name, '.')
      }
    })

  autoImportScript += components
    .map(entry => `import ${entry.name} from '${entry.dst}'`)
    .join('\r\n') +
      '\r\n\r\n'

  autoImportScript += components
    .map(entry => `Vue.component('${entry.name}', ${entry.name})`)
    .join('\r\n') +
      '\r\n'

  const componentsTmpl = {
    src: pResolve(__dirname, 'components.js'),
    fileName: `${pkg.name}/components.js`
  }
  writeFileSync(componentsTmpl.src, autoImportScript)
  this.addTemplate(componentsTmpl)

  this.addPlugin({
    ssr: false,
    src: pResolve(__dirname, 'plugin.js'),
    fileName: `${pkg.name}/plugin.js`,
    options
  })
}
