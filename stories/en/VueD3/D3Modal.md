---
title: D3Modal
show: false
show2: false
show3: false
show4: false
---

# Demo

## Simple

<input v-model="show" type="checkbox" > Show
<D3Modal title="Routes" :show="show" v-on:close="() => show = false" >
  Body here.
</D3Modal>

## Draggable

<input v-model="show2" type="checkbox" > Show Draggable
<Draggable elm-selector=".modal-content">
<D3Modal title="Routes" :show="show2" v-on:close="() => show2 = false" >
  Body here.
</D3Modal>
</Draggable>

## Modal from a modal

* nuxt-router-ui v1 used b-modal from Bootstrap-vue and was able to pull off *dragging* the modal in a modal no problem.
* I found it a bit challenging to recreate with the smaller code I was trying to work with, but I found conditionally choosing params modal vs. routes modal worked fine (to still allow dragging)

# Design

* Want it to be similar to Bootstrap-Vue's BModal, and we want it to be draggable without moving the backdrop (only moving the modal)
* Want to be able to trigger it open and closed

## Props

| prop | type | default | 
| --- | --- | --- |
| show | boolean | false |
| hideFooter | boolean | false |
| hideBackdrop | boolean | false |