import { h } from 'vue'
import D3Modal from './D3Modal.js'
import D3Tree from './D3Tree.js'
import Draggable from './Draggable.js'
import './styles.scss'

function vModel (ctx, key) {
  return {
    value: ctx[key],
    onInput (evt) {
      ctx[key] = evt.target.value
    }
  }
}

function prependPath (n, parentPath = '', cachedParams) {
  const nCopy = { ...n }
  nCopy.pathTemplate = parentPath + nCopy.path
  nCopy.path = parentPath +
    n.path
      .replace(/:[A-z,0-9?]+/g, (val) => {
        const key = val.split(':')[1].split('?')[0]
        return cachedParams[key]
          ? cachedParams[key]
          : val
      })

  if (n.children) {
    nCopy.children = n.children.map(c => prependPath(c, n.path + '/', cachedParams))
  }
  return nCopy
}

function getReqdParams (path, cachedParams) {
  const matched = path
    .match(/:[A-z,0-9]+\?*/g)

  if (!matched || matched.length === 0) { return {} }

  return matched
    .reduce((out, p) => {
      const key = p.split(':')[1].split('?')[0]
      if (!cachedParams[key]) {
        out[key] = ''
      }
      return out
    }, {})
}

export default {
  render () {
    const ctx = this
    const D3TreeElm = h(D3Tree, {
      data: this.routes,
      margin: this.margin,
      dx: 45,
      startIn: { name: this.$route.name },
      clickOverride: this.clickOverride,
      onNodeClick: this.handleClick
    })
    const { paramsModalId, routesModalId } = this
    const reqdParams = Object.keys(this.reqdParams)
      .map((key) => {
        return h('div', { key }, [
          h('label', `${key}:`),
          h('input', {
            class: 'form-control',
            onKeyup (evt) {
              if (evt.key === 'Enter') {
                ctx.handleOk()
              }
            },
            ...vModel(ctx.reqdParams, key)
          })
        ])
      })

    const paramsModal = h(D3Modal, {
      class: 'nuxt-router-ui',
      id: paramsModalId,
      title: 'Enter parameters',
      show: this.showParamsModal,
      onOk: this.handleOk,
      onClose: this.closeParams
    }, {
      default () {
        return reqdParams
      }
    })

    const routesModal = h(D3Modal, {
      class: 'nuxt-router-ui',
      id: routesModalId,
      title: 'Routes',
      hideFooter: true,
      show: this.showRoutesModal,
      onClose: this.closeRoutes
    }, {
      default () {
        return [D3TreeElm]
      }
    })

    const DraggableElm = h(Draggable, {
      elmSelector: '.modal-content'
    }, {
      default () {
        return [ctx.showParamsModal ? paramsModal : routesModal]
      }
    })

    return DraggableElm
  },
  props: {
    margin: {
      type: Object,
      default: () => ({ top: 40, right: 60, bottom: 40, left: 60 })
    },
    cacheKey: {
      type: String,
      default: '$cachedParams'
    },
    clickOverride: {
      type: String,
      default () {
        if (process.server) { return }
        return !navigator.platform.toLowerCase().match('mac')
          ? 'ctrlKey'
          : 'metaKey'
      }
    },
    openOverride: {
      type: String,
      default () {
        if (process.server) { return }
        return !navigator.platform.toLowerCase().match('mac')
          ? 'ctrlKey'
          : 'metaKey'
      }
    }
  },
  data () {
    return {
      reqdParams: {},
      name: 'app',
      nextPath: '',
      nextPathTemplate: '',
      forcePrompt: false,
      paramsModalId: 'params-required',
      routesModalId: 'routes-ui',
      routes: {},
      showParamsModal: false,
      showRoutesModal: false
    }
  },
  mounted () {
    this.routes = this.getRoutes()
    window.addEventListener('keydown', this.handleKeyDown)
  },
  destroyed () {
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    closeParams () {
      this.showParamsModal = false
      this.showRoutesModal = true
    },
    closeRoutes () {
      this.showParamsModal = false
      this.showRoutesModal = false
    },
    getRoutes () {
      return {
        name: this.name,
        path: '',
        children: this.$router.options.routes
          .map(r => prependPath(r, '', this.getCachedParams()))
      }
    },
    getCachedParams () {
      return JSON.parse(localStorage.getItem(this.cacheKey) || '{}')
    },
    handleClick ({ evt, data }) {
      const cachedParams = this.getCachedParams()
      this.nextPathTemplate = data.pathTemplate
      this.nextPath = data.path

      this.reqdParams = getReqdParams(
        this.nextPath,
        cachedParams
      )

      this.forcePrompt = evt.shiftKey

      if (this.forcePrompt) {
        this.nextPath = this.nextPathTemplate

        const params = this.nextPathTemplate.match(/:[A-z,0-9]+\?*/g)
        if (params) {
          params.forEach((p) => {
            const param = p.match(/:([A-z,0-9]+)\?*/)[1]
            this.reqdParams[param] = cachedParams[param]
          })
        }
      }

      if (this.reqdParams && Object.keys(this.reqdParams).length > 0) {
        this.showRoutesModal = false
        this.showParamsModal = true
      } else {
        this.$router.push(this.nextPath)
      }
    },
    handleKeyDown (evt) {
      if (evt[this.openOverride] && evt.shiftKey && evt.key === ' ') {
        this.showParamsModal = false
        this.showRoutesModal = true
      }
    },
    handleOk () {
      const cachedParams = this.getCachedParams()
      const { cacheKey, reqdParams, $router } = this

      Object.entries(reqdParams).forEach(([key, val]) => {
        cachedParams[key] = val
        const r = new RegExp(':' + key + '\\?*')
        this.nextPath = this.nextPath.replace(r, val)
      })

      if (this.nextPath.endsWith('/')) {
        this.nextPath = this.nextPath.slice(0, this.nextPath.length - 1)
      }
      localStorage.setItem(cacheKey, JSON.stringify(cachedParams))
      $router.push(this.nextPath)
      this.routes = this.getRoutes()
      this.showParamsModal = false
      this.showRoutesModal = true
    }
  }
}
