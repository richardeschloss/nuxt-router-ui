<template>
  <client-only>
    <Markdown class="nuxt-container">
      {{ readme }}
    </Markdown>
  </client-only>
</template>

<script>
const readmeURL = 'https://raw.githubusercontent.com/richardeschloss/nuxt-router-ui/master/README.md'
export default {
  fetchOnServer: false,
  async fetch () {
    this.readme = await fetch(readmeURL)
      .then(res => res.text())
  },
  data () {
    return {
      readme: ''
    }
  }
}
</script>

<style>
.nuxt-container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* text-align: center; */
}

#nuxt-router-ui {
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
