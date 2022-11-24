import { h } from 'vue'
import { linkHorizontal } from 'd3-shape'
import { hierarchy, tree as d3Tree } from 'd3-hierarchy'
import { create as d3Create, select as d3Select, selection as d3Selection } from 'd3-selection'
import { transition as d3Transition } from 'd3-transition'
import { zoom as d3Zoom } from 'd3-zoom'
import './D3Tree.css'

/* c8 ignore start */
// This is already covered and tested in d3-selection-multi
function attrsFunction (selection, map) {
  return selection.each(function () {
    const x = map.apply(this, arguments); const s = d3Select(this)
    for (const name in x) { s.attr(name, x[name]) }
  })
}

function attrsObject (selection, map) {
  for (const name in map) { selection.attr(name, map[name]) }
  return selection
}

d3Transition.prototype.attrs = d3Selection.prototype.attrs = function (map) {
  return (typeof map === 'function' ? attrsFunction : attrsObject)(this, map)
}
/* c8 ignore stop */

export default {
  render () {
    return h('div')
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    depth: {
      type: Number,
      default: 1
    },
    duration: {
      type: Number,
      default: 250
    },
    orientation: {
      type: Number,
      default: 0
    },
    margin: {
      type: Object,
      default: () => ({
        top: 40,
        right: 60,
        bottom: 40,
        left: 60
      })
    },
    /* width between nodes (width measured along breadth) */
    dx: {
      type: Number,
      default: 10
    },
    /* node radius */
    nodeSize: {
      type: Number,
      default: 2.5
    },
    containerClass: {
      type: String,
      default: 'tree-container'
    },
    linkColor: {
      type: String,
      default: '#555'
    },
    linkWidth: {
      type: Number,
      default: 1.5
    },
    maxDepth: {
      type: Number,
      default: 6
    },
    nodeActiveFill: {
      type: String,
      default: '#555'
    },
    nodeInActiveFill: {
      type: String,
      default: '#999'
    },
    imageSize: {
      type: Number,
      default: 25
    },
    blowupFactor: {
      type: Number,
      default: 3
    },
    startIn: {
      /* { [prop]: val } means look up node by property "prop" and match the val;
       * i.e., startIn = { path: /my/page1 }
       */
      type: Object,
      default: () => ({})
    },
    clickOverride: {
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
      svg: null
    }
  },
  mounted () {
    this.registerListeners()
    this.buildTree()
    this.$watch('data', this.buildTree)
  },
  methods: {
    buildTree () {
      this.svg = null
      const ctx = this
      const { width: _width } = window.getComputedStyle(this.$el)
      if (_width === 'auto') { return }
      /* width as in "breadth" of the tree */
      const width = parseFloat(_width)
      const {
        blowupFactor,
        duration,
        data,
        imageSize,
        margin,
        nodeActiveFill,
        nodeInActiveFill,
        nodeSize,
        orientation,
        startIn
      } = this
      let dx, dy
      if (orientation === 90) {
        dx = width / this.maxDepth / 2
        dy = this.dx * 2
      } else {
        dx = this.dx
        dy = width / this.maxDepth
      }

      const tree = d3Tree().nodeSize([dx, dy])
      const diagonal = linkHorizontal().x(d => d.y).y(d => d.x)

      let startInProp, startInVal
      const startInEntries = Object.entries(startIn)[0]

      if (startInEntries && startInEntries.length > 0) {
        startInProp = startInEntries[0]
        startInVal = startInEntries[1]
      }

      const root = hierarchy(data)

      root.x0 = 0
      root.y0 = 0
      function showParent (d) {
        if (d.parent) {
          d.parent.children = d.parent._children
          showParent(d.parent)
        }
      }

      root.descendants().forEach((d, i) => {
        d.id = i
        d._children = d.children
        if (startInEntries && startInEntries.length > 0) {
          if (d.data[startInProp] === startInVal) {
            d.children = d._children
            showParent(d)
          } else {
            d.children = null
          }
        } else if (d.depth >= this.depth) { d.children = null }
      })

      const id = this.$attrs.id
        ? this.$attrs.id + '-svg'
        : 'd3-tree-chart'

      /* Tree SVG */
      const svg = d3Create('svg')
        .attrs({
          id,
          viewBox: [
            -margin.left, // min-x
            -margin.top, // min-y
            width, // width
            dx // height
          ],
          transform: `rotate(${orientation})`,
          class: this.containerClass
        })

      if (orientation === 90) {
        svg.attr('style', `height: ${_width}; width: 100%;`)
      }

      /* Tree links */
      const gLink = svg.append('g')
        .attrs({
          fill: 'none',
          stroke: this.linkColor,
          'stroke-opacity': 0.4,
          'stroke-width': this.linkWidth
        })

      const gNode = svg.append('g')
        .attrs({
          cursor: 'pointer',
          'pointer-events': 'all'
        })

      /* Enable zooming (and panning) */

      svg.call(
        d3Zoom()
          .extent([[0, 0], [width, dx]])
          .scaleExtent([1, 8])
          .on('zoom', ({ transform }) => {
            /* c8 ignore start */
            gLink.attr('transform', transform)
            gNode.attr('transform', transform)
            /* c8 ignore stop */
          })
      )

      function update (source) {
        const nodes = root.descendants().reverse()
        const links = root.links()

        // Compute the new tree layout.
        tree(root)

        let left = root
        let right = root
        root.eachBefore((node) => {
          if (node.x < left.x) { left = node }
          if (node.x > right.x) { right = node }
        })

        const nodeHeight = right.x - left.x + margin.top + margin.bottom // node "height" as in "depth"

        const transition = svg.transition()
          .duration(duration)
          .attr('viewBox', [
            -margin.left,
            left.x - margin.top,
            width,
            nodeHeight
          ])
          /* c8 ignore next */
          .tween('resize', window.ResizeObserver ? null : () => () => svg.dispatch('toggle'))

        // Update the nodes…
        const node = gNode.selectAll('g')
          .data(nodes, d => d.id)

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append('g')
          .attrs({
            transform: d => `translate(${source.y0},${source.x0})`,
            'fill-opacity': 0,
            'stroke-opacity': 0
          })
          .on('click', (evt, d) => ctx.handleNodeClick(evt, d, update))

        nodeEnter.append('circle')
          .attrs({
            r: nodeSize,
            fill: d => d._children ? nodeActiveFill : nodeInActiveFill,
            'stroke-width': 10
          })

        const textPosition = nodeSize * 2 + 1
        const text = nodeEnter.append('text')
          .attrs({
            dy: '0.31em',
            transform: `rotate(-${orientation})`
          })
          .text(d => d.data.name)

        if (orientation === 90) {
          text.attrs({
            'text-anchor': 'middle',
            y: imageSize
          })
        } else {
          text.attrs({
            'text-anchor': d => d._children ? 'end' : 'start',
            // If node has no children, place text on right side, otherwise, left side.
            x: (d) => {
              const position = d.data.imageURL ? (imageSize + textPosition) / 2 : textPosition
              return (d._children ? -1 : 1) * position
            }
          })
        }

        text.clone(true).lower()
          .attrs({
            'stroke-linejoin': 'round',
            'stroke-width': 3,
            stroke: 'white'
          })

        const imageAttrs = {
          x: -imageSize / 2,
          y: -imageSize / 2,
          width: imageSize,
          height: imageSize
        }
        const scaledImageAttrs = {
          x: -imageSize * blowupFactor / 2,
          y: -imageSize * blowupFactor / 2,
          width: imageSize * blowupFactor,
          height: imageSize * blowupFactor
        }

        // Append images if the imageURL exists (otherwise image placeholders)
        nodeEnter.append('image')
          .attrs({
            'xlink:href': d => d.data.imageURL ? d.data.imageURL : null,
            style: `transition-duration: ${duration}ms`,
            transform: `rotate(-${orientation})`
          })
          .attrs(imageAttrs)
          .on('mouseover', (event, d) => d3Select(event.target).attrs(scaledImageAttrs))
          .on('mouseout', (event, d) => d3Select(event.target).attrs(imageAttrs))

        // Transition nodes to their new position.
        const transitionOpts = {
          'fill-opacity': 1,
          'stroke-opacity': 1
        }

        /* c8 ignore start */
        if (process.client) {
          // jsdom issue https://github.com/jsdom/jsdom/issues/2531
          transitionOpts.transform = d => `translate(${d.y},${d.x})`
        }
        /* c8 ignore stop */

        node.merge(nodeEnter).transition(transition)
          .attrs(transitionOpts)

        // Transition exiting nodes to the parent's new position.
        node.exit().transition(transition).remove()
          .attrs({
            /* c8 ignore next */
            transform: d => `translate(${source.y},${source.x})`,
            'fill-opacity': 0,
            'stroke-opacity': 0
          })

        // Update the links…
        const link = gLink.selectAll('path')
          .data(links, d => d.target.id)

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append('path')
          .attr('d', (d) => {
            /* c8 ignore start */
            const o = { x: source.x0, y: source.y0 }
            return diagonal({ source: o, target: o })
            /* c8 ignore stop */
          })

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
          .attr('d', diagonal)

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
          .attr('d', (d) => {
            /* c8 ignore start */
            const o = { x: source.x, y: source.y }
            return diagonal({ source: o, target: o })
            /* c8 ignore stop */
          })

        // Stash the old positions for transition.
        root.eachBefore((d) => {
          d.x0 = d.x
          d.y0 = d.y
        })
      }

      update(root)

      this.$nextTick(() => {
        this.svg = svg.node()
      })
    },
    handleNodeClick (evt, d, update) {
      if (evt[this.clickOverride]) {
        const { data } = d
        this.$emit('nodeClick', { evt, data })
      } else {
        d.children = d.children ? null : d._children
        update(d)
      }
    },
    registerListeners () {
      const context = this
      const { $el: el } = this
      let prevWidth = 0
      const resizeObserver = new ResizeObserver(function () {
        const { offsetWidth: width } = el
        if (width && Math.abs(width - prevWidth) > 5) {
          context.buildTree()
          prevWidth = width
        }
      })
      resizeObserver.observe(el)

      let svgElm
      context.$watch('svg', (n, o) => {
        if (o === null) {
          if (!svgElm) {
            svgElm = n
            el.appendChild(svgElm)
          } else {
            el.replaceChild(n, svgElm)
            svgElm = n
          }
        }
      })
    }
  }
}
