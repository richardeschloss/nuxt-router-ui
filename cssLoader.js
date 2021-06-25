import { URL, pathToFileURL } from 'url'

const baseURL = pathToFileURL(`${process.cwd()}/`).href

export function resolve (specifier, context, defaultResolve) {
  const { parentURL = baseURL } = context
  if (specifier.endsWith('.css') || specifier.endsWith('.scss')) {
    return {
      url: new URL(specifier, parentURL).href
    }
  }

  // Let Node.js handle all other specifiers.
  return defaultResolve(specifier, context, defaultResolve)
}

export function getFormat (url, context, defaultGetFormat) {
  // This loader assumes all network-provided JavaScript is ES module code.
  if (url.endsWith('.css') || url.endsWith('.scss')) {
    return {
      format: 'module'
    }
  }

  // Let Node.js handle all other URLs.
  return defaultGetFormat(url, context, defaultGetFormat)
}

export function transformSource (source, context, defaultGetSource) {
  const { url } = context
  if (url.endsWith('.css') || url.endsWith('.scss')) {
    return {
      source: ''
    }
  }

  // Let Node.js handle all other URLs.
  return defaultGetSource(source, context, defaultGetSource)
}
