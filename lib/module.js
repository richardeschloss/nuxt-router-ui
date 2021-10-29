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

  this.addPlugin({
    ssr: false,
    src: pResolve(__dirname, 'plugin.js'),
    fileName: `${pkg.name}/plugin.js`,
    options
  })
}
