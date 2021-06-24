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
        staticClass: 'close',
        on: {
          click: this.close
        }
      }, ['×'])
    ])

    const body = h('div', {
      staticClass: 'modal-body'
    }, this.$slots.default)

    const contentChildren = [hdr, body]
    if (!this.noFooter) {
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
          staticClass: 'btn btn-primary',
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
    }, [content])

    const modal = h('div', {
      staticClass: 'modal fade',
      class: {
        show: this.show
      },
      style: {
        display: this.show ? 'block' : 'none'
      }
    }, [dialog])

    const elms = [modal]
    if (this.show) {
      const backdrop = h('div', {
        staticClass: 'modal-backdrop',
        class: {
          show: this.show
        }
      }, [])
      elms.push(backdrop)
    }

    return h('div', elms)

    // return modal
    return h('div', {
      staticClass: 'fade',
      class: {
        show: this.showModal,
        modal: this.showModal
      }
    }, [
      h('div', {
        staticClass: 'modal-dialog'
      }, [
        h('div', {
          staticClass: 'modal-content'
        }, [
          hdr
        ])
      ])
    ])
  },
  props: {
    title: { type: String },
    'no-footer': { type: Boolean },
    show: { type: Boolean, default: false }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    ok () {
      console.log('ok')
    }
  }
}
