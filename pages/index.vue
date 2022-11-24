<template>
  <Markdown class="nuxt-container" src="/README.md" />
</template>

<style>
.nuxt-container {
  margin: 0 auto;
  min-height: 100vh;
  /* display: flex; */
  justify-content: center;
  align-items: center;
  /* text-align: center; */
  width: 50vw;
}

#nuxt-router-ui {
  text-align: center;
}

img[src="https://cdn-images-1.medium.com/max/800/1*z8zQ1Tc6B3GkKsYjaFMCBA.gif"] {
  width: 100%;
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
