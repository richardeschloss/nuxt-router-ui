---
title: D3Modal
showIt: false
---

Revisit...

In Vue Dev Tools, navigate to the `D3Modal` component to toggle it on/off...

<input v-model="showIt" type="checkbox" > Show
<D3Modal id="myModal" title="Routes" ref="myModal" v-on:close="show = showIt" >
  Body here.
</D3Modal>
