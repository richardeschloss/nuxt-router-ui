import { h } from 'vue'
import Markdown from '@/utils/markdown.js'

export default {
  render () {
    return h('div', {
      class: 'nuxt-router-ui'
    })
  },
  async mounted () {
    const content = await fetch(this.$attrs.src)
      .then(res => res.text())
    const { compiled } = Markdown.parse(content)
    this.$el.innerHTML = compiled
  }
}
