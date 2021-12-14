<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div v-markdown="compiled" style="display:none;">
      <slot />
    </div>
    <div class="compiled nuxt-router-ui" v-html="compiled" />
  </div>
</template>

<script>
import Markdown from '@/utils/markdown.js'
export default {
  directives: {
    markdown: {
      inserted (el, binding, { context }) {
        const input = el.innerHTML.replace(/ {2}/g, '')
        const { compiled } = Markdown.parse(input)
        context.compiled = compiled
      }
    }
  },
  data () {
    return {
      compiled: ''
    }
  }
}
</script>
