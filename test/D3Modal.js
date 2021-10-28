import 'jsdom-global/register.js'
import Vue from 'vue'
import test from 'ava'
import D3Modal from '../lib/VueD3/D3Modal.js'

global.window.focus = () => {}

function launchModal (propsData) {
  const Comp = Vue.extend(D3Modal)
  const comp = new Comp({ propsData })
  comp.$mount()
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
  const { comp, modal } = launchModal({
    show: true
  })
  const backdrop = comp.$el.querySelector('.modal-backdrop')
  const okBtn = modal.querySelector('.ok')
  const closeBtn = modal.querySelector('.close')
  t.truthy(modal)
  t.truthy(backdrop)
  return new Promise((resolve) => {
    let doneCnt = 0
    function handleDone () {
      doneCnt++
      if (doneCnt === 2) {
        resolve()
      }
    }
    comp.$on('ok', handleDone)
    comp.$on('close', handleDone)
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
