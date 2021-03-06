import { URL, pathToFileURL } from 'url'

const baseURL = pathToFileURL(`${process.cwd()}/`).href
const regex = /(\.ts|\.s*css)$/

/**
 * @param {string} specifier
 * @param {{ parentURL?: string; url: any; }} context
 * @param {(arg0: any, arg1: any, arg2: any) => any} defaultResolve
 */
export function resolve (specifier, context, defaultResolve) {
  const { parentURL = baseURL } = context
  if (regex.test(specifier)) {
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
  if (regex.test(url)) {
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
  if (url.endsWith('vue.runtime.esm.js')) {
    return {
      source: source.toString()
    }
  } else if (url.endsWith('.ts')) {
    return {
      source: source.toString()
    }
  } else if (url.match(/\.s*css$/)) {
    return {
      source: 'export default {}'
    }
  }

  // Let Node.js handle all other URLs.
  return defaultGetSource(source, context, defaultGetSource)
}
