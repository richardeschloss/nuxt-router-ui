import './Markdown.scss'
import { h } from 'vue'
import Markdown from '@/utils/markdown.js'

export default {
  render () {
    return h('div', {
      class: 'nuxt-router-ui nuxt-router-ui-demo'
    })
  },
  async mounted () {
    const content = await fetch(this.$attrs.src)
      .then(res => res.text())
    const { compiled } = Markdown.parse(content)
    this.$el.innerHTML = compiled
  }
}
