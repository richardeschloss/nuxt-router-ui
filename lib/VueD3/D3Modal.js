// import { h } from 'vue' // vue3
import './reduced.scss'
export default {
  render (h) {
    const hdr = h('div', {
      staticClass: 'modal-header'
    }, [
      h('h5', {
        staticClass: 'modal-title'
      }, [this.title]),
      h('button', {
        attrs: {
          type: 'button'
        },
        staticClass: 'btn-close',
        on: {
          click: this.close
        }
      }, ['×'])
    ])

    const body = h('div', {
      staticClass: 'modal-body'
    }, this.$slots.default)

    const contentChildren = [hdr, body]
    if (!this.hideFooter) {
      const footer = h('div', {
        staticClass: 'modal-footer'
      }, [
        h('button', {
          attrs: {
            type: 'button'
          },
          staticClass: 'btn btn-secondary',
          on: {
            click: this.close
          }
        }, 'Cancel'),
        h('button', {
          attrs: {
            type: 'button'
          },
          staticClass: 'btn btn-primary ok',
          on: {
            click: this.ok
          }
        }, 'OK')
      ])
      contentChildren.push(footer)
    }

    const content = h('div', {
      staticClass: 'modal-content'
    }, contentChildren)

    const dialog = h('div', {
      staticClass: 'modal-dialog'
    }, [
      content
    ])

    const modal = h('div', {
      staticClass: 'modal fade show',
      style: {
        top: this.show ? '50px' : '-500px',
        display: 'block',
        opacity: this.show ? 1 : 0
      }
    }, [dialog])

    const backdrop = h('div', {
      staticClass: 'modal-backdrop fade show'
    })

    return h('div', {}, [modal, !this.hideBackdrop && this.show ? backdrop : h()])
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    hideBackdrop: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.$emit('close')
      window.focus()
      document.activeElement.blur()
    },
    ok () {
      this.$emit('ok')
    }
  }
}
