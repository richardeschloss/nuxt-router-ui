import 'jsdom-global/register.js'
import { promisify } from 'util'
import ava from 'ava'
import Vue from 'vue'
import d3RouterUI from '../lib/VueD3/D3RouterUI.js'

window.Date = global.Date = Date
Vue.config.devtools = false
Vue.config.productionTip = false
Vue.config.silent = true

const { serial: test, beforeEach, afterEach } = ava
const D3RouterUI = Vue.extend(d3RouterUI)

const store = {
  $cachedParams: {}
}

const gMocks = {
  localStorage: {
    getItem (label) {
      return JSON.stringify(store[label])
    },
    setItem (label, value) {
      store[label] = JSON.parse(value)
    }
  }
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

Object.assign(global, gMocks)
Object.assign(window, wMocks)

function fullRender (h) {
  return h('div', this.$attrs, this.$slots.default)
}

function shallowRender (h) {
  return h('div')
}

const stubs = {
  'b-modal': { render: shallowRender },
  D3Tree: { render: shallowRender },
  Draggable: { render: shallowRender }
}

Object.entries(stubs).forEach(([name, comp]) => {
  Vue.component(name, comp)
})

let modalShown, modalHidden, comp, mocks
let routesPushed = []

beforeEach((t) => {
  routesPushed = []
  modalShown = false
  modalHidden = false
  mocks = {
    $bvModal: {
      show (id) {
        modalShown = id
      },
      hide (id) {
        modalShown = false
        modalHidden = id
      }
    },
    $route: {
      name: 'app'
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
  comp = new D3RouterUI({})
  Object.assign(comp, mocks)
})

afterEach(() => {
  comp.$destroy()
})

test('Get Cached Params (not stored)', (t) => {
  const { getCachedParams } = d3RouterUI.methods
  const ctx = {
    cacheKey: '',
    getCachedParams
  }
  const cached = ctx.getCachedParams()
  t.is(JSON.stringify(cached), '{}')
})

test('Routes-ui Modal', (t) => {
  comp.$mount()
  t.truthy(wAddedCbs.keydown)
  wAddedCbs.keydown({})
  t.false(modalShown)
  wAddedCbs.keydown({
    ctrlKey: true,
    shiftKey: true,
    key: ' '
  })
  t.is(modalShown, 'routes-ui')
  comp.$destroy()
  t.truthy(wRemovedCbs.keydown)

  store.$cachedParams.L0 = 'en'
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
  t.is(modalShown, 'params-required')
})

test('Handle Click (path with params, partially cached)', (t) => {
  store.$cachedParams.id = 111
  const routePath = '/some/:id/:name'
  const pathTemplate = '/some/:id/:name'
  const evt = { shiftKey: false }
  const data = { path: routePath, pathTemplate }
  comp.handleClick({ evt, data })
  t.false(comp.reqdParams.id !== undefined)
  t.true(comp.reqdParams.name !== undefined)
  t.is(modalShown, 'params-required')
})

test('Handle Click (path with params, all cached)', (t) => {
  store.$cachedParams.name = 'name1'
  const routePath = '/some/:id/:name'
  const pathTemplate = '/some/:id/:name'
  const evt = { shiftKey: false }
  const data = { path: routePath, pathTemplate }
  comp.handleClick({ evt, data })
  t.is(routesPushed[0], routePath)
  t.false(modalShown)
})

test('Handle click (force prompt)', (t) => {
  const routePath = '/some/:id/:name'
  const pathTemplate = '/some/:id/:name'
  const evt = { shiftKey: true }
  const data = { path: routePath, pathTemplate }
  comp.handleClick({ evt, data })
  t.is(modalShown, 'params-required')
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
  t.false(modalShown)
})

test('Param Modal (input events)', async (t) => {
  const input = new Event('input')
  const keyup = new Event('keyup')

  const comp = new D3RouterUI({
    components: {
      'b-modal': { render: fullRender },
      D3Tree: { render: shallowRender }
    }
  })
  Object.assign(comp, mocks)
  comp.$nextTickP = promisify(comp.$nextTick)
  comp.$mount()

  comp.reqdParams = { id: 'abc123' }
  await comp.$nextTickP()
  const inputElm = comp.$el.getElementsByTagName('input')[0]
  inputElm.dispatchEvent(input)
  input.target.value = 'abc123456'
  inputElm.dispatchEvent(input)
  t.is(comp.reqdParams.id, 'abc123456')

  inputElm.dispatchEvent(keyup)
  t.false(modalHidden)

  keyup.key = 'Enter'
  inputElm.dispatchEvent(keyup)
  t.is(modalHidden, 'params-required')
})

test('Handle Ok (Params modal)', (t) => {
  comp.nextPath = '/some/:id/:name'
  comp.reqdParams = { id: 123, name: 'SomeName' }
  comp.$mount()
  comp.handleOk()
  t.is(comp.nextPath, '/some/123/SomeName')
  t.is(routesPushed[0], comp.nextPath)

  comp.nextPath = '/some/path/'
  comp.handleOk()
  t.is(comp.nextPath, '/some/path')
})

test('NodeClick Override', (t) => {
  const { clickOverride } = d3RouterUI.props
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
  const { openOverride } = d3RouterUI.props
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
