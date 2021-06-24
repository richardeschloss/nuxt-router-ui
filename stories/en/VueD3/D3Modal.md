---
title: D3Modal
show: false
---
<D3RouterUI />

<input type="checkbox" v-model="show"/>

<D3Modal title="Routes" :show="show" v-on:close="show = false" >
  Body here.
</D3Modal>
