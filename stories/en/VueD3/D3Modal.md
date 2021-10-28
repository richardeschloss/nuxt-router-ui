---
title: D3Modal
show: false
show2: false
show3: false
show4: false
order: 3
---

# Demo

<input v-model="show" type="checkbox" > Show
<D3Modal title="Routes" :show="show" v-on:close="() => show = false" >
  Body here.
</D3Modal>

# Design

* Want it to be similar to Bootstrap-Vue's BModal, and we want it to be draggable without moving the backdrop (only moving the modal)
* Want to be able to trigger it open and closed

## Props

| prop | type | default | 
| --- | --- | --- |
| show | boolean | false |
| hideFooter | boolean | false |
| hideBackdrop | boolean | false |

# Archive
* nuxt-router-ui v1 used b-modal from Bootstrap-vue which made it easier to have clean dragging after lauching the modal in the modal. For v2, the design goal was to slim down the code needed for the modal, so now, the D3Modal will be used by D3RouterUI instead. 
* D3RouterUI will only show the routesUI or paramsUI modal one at a time, not both at the same time. This makes the design a bit easier (especially to maintain the dragging and have it work cleanly)  
