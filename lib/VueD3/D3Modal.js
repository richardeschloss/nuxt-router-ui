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

    return h('div', [modal, this.show ? backdrop : h()])
  },
  props: {
    title: { type: String },
    'no-footer': { type: Boolean }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    close () {
      this.show = false
      this.$emit('close')
    },
    ok () {
      this.show = false
      this.$emit('ok')
    },
    open () {
      this.show = true
    }
  }
}
