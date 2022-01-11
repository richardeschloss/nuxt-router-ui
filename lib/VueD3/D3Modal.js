import { h } from 'vue'
import './reduced.scss'
export default {
  render () {
    const hdr = h('div', {
      class: 'modal-header'
    }, [
      h('h5', {
        class: 'modal-title'
      }, [this.title]),
      h('button', {
        type: 'button',
        class: 'btn-close',
        onClick: this.close
      })
    ])

    const body = h('div', {
      class: 'modal-body'
    }, this.$slots.default())

    const contentChildren = [hdr, body]
    if (!this.hideFooter) {
      const footer = h('div', {
        class: 'modal-footer'
      }, [
        h('button', {
          type: 'button',
          class: 'btn btn-secondary',
          onClick: this.close
        }, 'Cancel'),
        h('button', {
          type: 'button',
          class: 'btn btn-primary ok',
          onClick: this.ok
        }, 'OK')
      ])
      contentChildren.push(footer)
    }

    const content = h('div', {
      class: 'modal-content'
    }, contentChildren)

    const dialog = h('div', {
      class: 'modal-dialog'
    }, [
      content
    ])

    const modal = h('div', {
      class: 'modal fade show',
      style: {
        top: this.show ? '50px' : '-500px',
        display: 'block',
        opacity: this.show ? 1 : 0
      }
    }, [dialog])

    const backdrop = h('div', {
      class: 'modal-backdrop fade show'
    })
    return h('div', {}, [modal, !this.hideBackdrop && this.show ? backdrop : null])
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
