import 'jsdom-global/register.js'
import { promisify } from 'util'
import ava from 'ava'
import Vue from 'vue'
import d3Tree from '../lib/VueD3/D3Tree.js'

global.ResizeObserver = function (cb) {
  _resizeObservers.push(cb)
  return {
    observe (elm) {
      _observedElms.push(elm)
    }
  }
}

window.Date = global.Date = Date

Vue.config.devtools = false
Vue.config.productionTip = false
Vue.config.silent = true

const { serial: test, beforeEach, afterEach } = ava
const D3Tree = Vue.extend(d3Tree)

let _resizeObservers = []
let _observedElms = []
let comp
const nodes = {
  name: 'rootNode',
  children: [{
    name: 'child1',
    imageURL: '/path/to/img'
  }, {
    name: 'child2'
  }]
}

beforeEach(() => {
  _resizeObservers = []
  _observedElms = []
  comp = new D3Tree({
    propsData: {
      data: nodes
    }
  })
  comp.$nextTickP = promisify(comp.$nextTick)
})

afterEach(() => {
  comp.$destroy()
})

test('Mount (width auto)', (t) => {
  window.getComputedStyle = () => {
    return { width: 'auto' }
  }
  const comp = new D3Tree().$mount()
  comp.$mount()
  t.is(comp.svg, null)
})

test('Mount (various prop inputs)', async (t) => {
  window.getComputedStyle = () => {
    return { width: '500px' }
  }
  comp.$mount()
  await comp.$nextTickP()

  const Wrapper = Vue.extend({
    components: {
      D3Tree: d3Tree
    },
    render (h) {
      return h('D3Tree', {
        attrs: {
          id: 'abc123',
          data: nodes,
          orientation: 90,
          startIn: {
            name: 'child1'
          }
        },
        ref: 'myTree'
      })
    }
  })
  const c = new Wrapper({}).$mount()
  const comp2 = c.$refs.myTree
  comp2.$nextTickP = promisify(comp2.$nextTick)
  await comp2.$nextTickP()

  t.truthy(comp.svg)
  t.truthy(comp2.svg)
  t.is(comp.svg.getAttribute('id'), 'd3-tree-chart')
  t.is(comp2.svg.getAttribute('id'), 'abc123-svg')
  t.not(comp.svg.innerHTML, comp2.svg.innerHTML)
})

test('Chart container (directives)', (t) => {
  const { registerListeners } = d3Tree.methods
  let callCnt = 0
  const children = []
  const _watchers = {}
  const el = {
    appendChild (n) {
      children.push(n)
    },
    replaceChild (n, o) {
      const idx = children.findIndex(i => i.id === o.id)
      children[idx] = n
    }
  }
  const context = {
    $el: el,
    buildTree () {
      callCnt++
    },
    $watch (label, cb) {
      _watchers[label] = cb
    },
    registerListeners
  }
  context.registerListeners()
  t.true(_resizeObservers.length > 0)
  t.true(_observedElms.length > 0)
  t.truthy(_watchers.svg)
  el.offsetWidth = 3
  _resizeObservers[0]()
  t.is(callCnt, 0)
  el.offsetWidth = 30
  _resizeObservers[0]()
  t.is(callCnt, 1)

  _watchers.svg({ id: 'svg1' }, null)
  t.is(children[0].id, 'svg1')
  _watchers.svg({ id: 'svg2' }, null)
  t.is(children[0].id, 'svg2')
})

test('Handle Click and Ctrl+Click (on node)', (t) => {
  let callCnt = 0
  const evt = {}
  const d = {
    data: {
      name: 'aaa',
      children: [{
        name: 'bbb'
      }]
    }
  }
  d._children = [...d.data.children]
  const update = () => callCnt++
  const _emitted = {}
  const ctx = d3Tree.methods
  ctx.$emit = (label, msg) => {
    _emitted[label] = msg
  }
  ctx.clickOverride = 'ctrlKey'
  ctx.handleNodeClick(evt, d, update)
  t.is(callCnt, 1)
  t.truthy(d.children)

  ctx.handleNodeClick(evt, d, update)
  t.is(callCnt, 2)
  t.is(d.children, null)

  evt.ctrlKey = true
  ctx.handleNodeClick(evt, d, update)
  t.truthy(_emitted.nodeClick)
  t.truthy(_emitted.nodeClick.evt)
  t.truthy(_emitted.nodeClick.data)
})

test('NodeClick Override', (t) => {
  const { clickOverride } = d3Tree.props
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
