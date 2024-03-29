import 'jsdom-global/register.js'
import BrowserEnv from 'browser-env'
import ava from 'ava'
import { createApp, nextTick } from 'vue'
import D3RouterUI from '../lib/VueD3/D3RouterUI.js'
import './mocks/localStorage.js'
BrowserEnv({ url: 'http://localhost' })
global.ResizeObserver = function (cb) {
  return {
    observe (elm) {
    }
  }
}

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

const { serial: test, beforeEach, afterEach } = ava

const store = {
  $cachedParams: {}
}

function updateCache () {
  localStorage.setItem('$cachedParams', JSON.stringify(store.$cachedParams))
}

const wAddedCbs = {}
const wRemovedCbs = {}

const wMocks = {
  addEventListener (evt, cb) {
    wAddedCbs[evt] = cb
  },
  removeEventListener (evt, cb) {
    wRemovedCbs[evt] = cb
  }
}

Object.assign(window, wMocks)

let App
let comp, mocks
let routesPushed = []

beforeEach(async (t) => {
  routesPushed = []
  mocks = {
    $route: {
      name: 'app123'
    },
    $router: {
      options: {
        routes: [{
          name: 'stories',
          path: '/stories',
          children: [{
            name: 'Markdown',
            path: ':L0?'
          }]
        }, {
          name: 'index',
          path: '/'
        }, {
          name: 'page2',
          path: '/page2'
        }]
      },
      push (path) {
        routesPushed.push(path)
      }
    }
  }
  App = createApp(D3RouterUI)
    .mixin({
      beforeCreate () {
        Object.assign(this, mocks)
      }
    })
  comp = await App.mount('#app')
})

afterEach(() => {
  App.unmount()
})

test('Get Cached Params (not stored)', (t) => {
  const { getCachedParams } = D3RouterUI.methods
  const ctx = {
    cacheKey: '',
    getCachedParams
  }
  const cached = ctx.getCachedParams()
  t.is(JSON.stringify(cached), '{}')
})

test('Routes-ui Modal', (t) => {
  t.truthy(wAddedCbs.keydown)
  wAddedCbs.keydown({})
  t.false(comp.showParamsModal)
  t.false(comp.showRoutesModal)
  wAddedCbs.keydown({
    ctrlKey: true,
    shiftKey: true,
    key: ' '
  })
  t.false(comp.showParamsModal)
  t.true(comp.showRoutesModal)
  App.unmount()
  t.truthy(wRemovedCbs.keydown)

  store.$cachedParams.L0 = 'en'
  updateCache()
  const routes = comp.getRoutes()
  t.is(routes.children[0].children[0].path, '/stories/en')
})

test('Handle Click (path with params)', (t) => {
  const routePath = '/some/:id/:name'
  const pathTemplate = '/some/:id/:name'
  const evt = { shiftKey: false }
  const data = { path: routePath, pathTemplate }
  comp.handleClick({ evt, data })
  t.is(comp.nextPath, routePath)
  t.true(comp.reqdParams.id !== undefined)
  t.true(comp.reqdParams.name !== undefined)
  t.true(comp.showParamsModal)
  t.false(comp.showRoutesModal)
})

test('Handle Click (path with params, partially cached)', (t) => {
  store.$cachedParams.id = 111
  updateCache()
  const routePath = '/some/:id/:name'
  const pathTemplate = '/some/:id/:name'
  const evt = { shiftKey: false }
  const data = { path: routePath, pathTemplate }
  comp.handleClick({ evt, data })
  t.false(comp.reqdParams.id !== undefined)
  t.true(comp.reqdParams.name !== undefined)
  t.true(comp.showParamsModal)
  t.false(comp.showRoutesModal)
})

test('Handle Click (path with params, all cached)', async (t) => {
  store.$cachedParams.id = 111
  store.$cachedParams.name = 'name1'
  updateCache()
  const routePath = '/some/:id/:name'
  const pathTemplate = '/some/:id/:name'
  const evt = { shiftKey: false }
  const data = { path: routePath, pathTemplate }
  comp.handleClick({ evt, data })
  await nextTick()
  t.is(routesPushed[0], routePath)
  t.false(comp.showParamsModal)
  t.false(comp.showRoutesModal)
})

test('Handle click (force prompt)', (t) => {
  const routePath = '/some/:id/:name'
  const pathTemplate = '/some/:id/:name'
  const evt = { shiftKey: true }
  const data = { path: routePath, pathTemplate }
  comp.handleClick({ evt, data })
  t.true(comp.showParamsModal)
  t.false(comp.showRoutesModal)
})

test('Handle Click (force prompt, params not required)', (t) => {
  comp.handleClick(({
    evt: {
      shiftKey: true
    },
    data: {
      path: '/path/no/params',
      pathTemplate: '/path/no/params'
    }
  }))
  t.false(comp.showParamsModal)
  t.false(comp.showRoutesModal)
})

test('Param Modal (input events)', async (t) => {
  store.$cachedParams = {}
  updateCache()
  comp.reqdParams = { id: 'abc123' }
  comp.showParamsModal = true
  await nextTick()
  const input = new Event('input')
  const keyup = new Event('keyup')
  const inputElm = comp.$el.querySelector('input')
  inputElm.dispatchEvent(input)
  await nextTick()
  input.target.value = 'abc123456'
  inputElm.dispatchEvent(input)
  await nextTick()
  t.is(comp.reqdParams.id, 'abc123456')

  inputElm.dispatchEvent(keyup)
  t.true(comp.showParamsModal)
  t.false(comp.showRoutesModal)

  keyup.key = 'Enter'
  inputElm.dispatchEvent(keyup)
  t.false(comp.showParamsModal)
  t.true(comp.showRoutesModal)
})

test('Handle Ok (Params modal)', (t) => {
  comp.nextPath = '/some/:id/:name'
  comp.reqdParams = { id: 123, name: 'SomeName' }
  comp.handleOk()
  t.is(comp.nextPath, '/some/123/SomeName')
  t.is(routesPushed[0], comp.nextPath)

  comp.nextPath = '/some/path/'
  comp.handleOk()
  t.is(comp.nextPath, '/some/path')
})

test('NodeClick Override', (t) => {
  const { clickOverride } = D3RouterUI.props
  process.server = true
  let r = clickOverride.default()
  t.falsy(r)

  process.server = false
  global.navigator = {
    platform: 'win'
  }
  r = clickOverride.default()
  t.is(r, 'ctrlKey')

  global.navigator.platform = 'mac'
  r = clickOverride.default()
  t.is(r, 'metaKey')
})

test('Open Override', (t) => {
  const { openOverride } = D3RouterUI.props
  process.server = true
  let r = openOverride.default()
  t.falsy(r)

  process.server = false
  global.navigator = {
    platform: 'win'
  }
  r = openOverride.default()
  t.is(r, 'ctrlKey')

  global.navigator.platform = 'mac'
  r = openOverride.default()
  t.is(r, 'metaKey')
})

test('Close modals', (t) => {
  comp.showParamsModal = true
  comp.showRoutesModal = false
  comp.closeParams()
  t.false(comp.showParamsModal)
  t.true(comp.showRoutesModal)

  comp.showParamsModal = false
  comp.showRoutesModal = true
  comp.closeRoutes()
  t.false(comp.showParamsModal)
  t.false(comp.showRoutesModal)
})
