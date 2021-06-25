import { URL, pathToFileURL } from 'url'
import * as compiler from 'vue-template-compiler'
import { parse, compileTemplate, compileStyle } from '@vue/component-compiler-utils'

const baseURL = pathToFileURL(`${process.cwd()}/`).href

/**
 * @param {any} source
 * @param {string} url
 */
function transformVue (source, url) {
  const filename = '/' + url.split(baseURL)[1]
  const parsed = parse({
    source,
    // @ts-ignore
    compiler,
    filename,
    needMap: true
  })
  
  const compiledTemplate = compileTemplate({
    filename,
    source: parsed.template.content,
    // @ts-ignore
    compiler
  })
  console.log('compiled template', compiledTemplate.code)

  const compiledStyle = compileStyle({
    filename,
    source: parsed.styles[0].content,
    // @ts-ignore
    compiler,
    scoped: true
  })
  console.log('compiled style', compiledStyle)

  return compiledTemplate.code +
    (parsed.script
      ? parsed.script.content
        .replace('export default {\n', 'export default {\n  render,\n  staticRenderFns,\n')
      : 'export default {\n  render,\n  staticRenderFns\n, _compiled: true\n }')
}

/**
 * @param {string} specifier
 * @param {{ parentURL?: string; url: any; }} context
 * @param {(arg0: any, arg1: any, arg2: any) => any} defaultResolve
 */
export function resolve (specifier, context, defaultResolve) {
  const { parentURL = baseURL } = context
  if (specifier.endsWith('.vue')) {
    return {
      url: new URL(specifier, parentURL).href
    }
  }

  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve)
}

/**
 * @param {string} url
 * @param {any} context
 * @param {(arg0: any, arg1: any, arg2: any) => any} defaultGetFormat
 */
export function getFormat (url, context, defaultGetFormat) {
  // This loader assumes all network-provided JavaScript is ES module code.
  if (url.endsWith('.vue')) {
    return {
      format: 'module'
    }
  }

  // Let Node.js handle all other URLs.
  return defaultGetFormat(url, context, defaultGetFormat)
}

/**
 * @param {{ toString: () => any; }} source
 * @param {{ url: any; }} context
 * @param {(arg0: any, arg1: any, arg2: any) => any} defaultGetSource
 */
export function transformSource (source, context, defaultGetSource) {
  const { url } = context
  if (url.endsWith('.vue')) {
    return {
      source: transformVue(source.toString(), url)
    }
  }

  // Let Node.js handle all other URLs.
  return defaultGetSource(source, context, defaultGetSource)
}
