<template>
  <footer class="footer border">
    <div class="container">
      <D3RouterUI v-if="devMode" />
      <span class="text-muted">© Richard Schloss 2021</span>
    </div>
  </footer>
</template>

<script>
export default {
  data () {
    return {
      devMode: true
    }
  }
}
</script>

<style scoped>

</style>
