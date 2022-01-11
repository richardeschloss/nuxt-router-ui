import 'jsdom-global/register.js'
import BrowserEnv from 'browser-env'
import { createApp, h } from 'vue'
import test from 'ava'
import D3Modal from '../lib/VueD3/D3Modal.js'
BrowserEnv()

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

global.window.focus = () => {}

function launchModal (propsData) {
  const App = createApp({
    render () {
      return h(D3Modal, propsData, { // D3Modal has a slot...expects to be a wrapper...
        default () {
          return []
        }
      })
    }
  })
  const comp = App.mount('#app')
  const modal = comp.$el.querySelector('.modal')
  return { comp, modal }
}

test('D3Modal: defaults', (t) => {
  const title = 'Some Modal'
  const { modal } = launchModal({ title })
  const modalTitle = modal.querySelector('.modal-title')
  t.is(modalTitle.textContent, title)
})

test('D3Modal: show modal, trigger events', (t) => {
  return new Promise((resolve) => {
    let doneCnt = 0
    function handleDone () {
      doneCnt++
      if (doneCnt === 2) {
        resolve()
      }
    }

    const { comp, modal } = launchModal({
      show: true,
      onOk: handleDone,
      onClose: handleDone
    })
    const backdrop = comp.$el.querySelector('.modal-backdrop')
    const okBtn = modal.querySelector('.ok')
    const closeBtn = modal.querySelector('.btn-close')
    t.truthy(modal)
    t.truthy(backdrop)
    okBtn.click()
    closeBtn.click()
  })
})

test('D3Modal: show modal, hide footer and backdrop', (t) => {
  const { modal } = launchModal({
    show: true,
    hideBackdrop: true,
    hideFooter: true
  })
  const footer = modal.querySelector('.modal-footer')
  const backdrop = modal.querySelector('.modal-backdrop')
  t.truthy(modal)
  t.falsy(footer)
  t.falsy(backdrop)
})
