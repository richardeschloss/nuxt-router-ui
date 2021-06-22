---
title: Quick Start
order: 0
---
[![npm](https://img.shields.io/npm/v/nuxt-router-ui.svg)](https://www.npmjs.com/package/nuxt-router-ui)
[![npm](https://img.shields.io/npm/dt/nuxt-router-ui.svg)](https://www.npmjs.com/package/nuxt-router-ui)
[![](https://gitlab.com/richardeschloss/nuxt-router-ui/badges/master/pipeline.svg)](https://gitlab.com/richardeschloss/nuxt-router-ui)
[![](https://gitlab.com/richardeschloss/nuxt-router-ui/badges/master/coverage.svg)](https://gitlab.com/richardeschloss/nuxt-router-ui)
[![NPM](https://img.shields.io/npm/l/nuxt-router-ui.svg)](https://github.com/richardeschloss/nuxt-router-ui/blob/development/LICENSE)

# nuxt-router-ui

A dope AF router UI for Nuxt and VueJS. 

## Easy-as-pie Usage

### Install it

```bash
$ npm i -D nuxt-router-ui
```

### Nuxt Config (one-line)

`nuxt.config.js`
```js
export default {
  ...,
  modules: ['nuxt-router-ui'],
  ...
}

```

### Vue-only config

`your-globals.js` 
```js
import Vue from 'vue'
import D3RouterUI from 'nuxt-router-ui/lib/D3RouterUI.js"

Vue.component('D3RouterUI', D3RouterUI)
```

### Embed it

The component to embed is `<D3RouterUI />`. Find a part of your app that is pretty much fixed, like the footer:

`layouts/default.vue`
```html
<template>
  <div>
    <Nuxt />
    <D3RouterUI />
  </div>
</template>
```

### Use it

| Action | Result |
| --- | --- |
| Ctrl + Shift + Space | Opens Router UI |
| Click (on node) | Opens the path's children, if any |
| Ctrl + Click (on node) | Navigates to that route's path. If it's a parameterized route, you'll be prompted for parameters before navigation (only if parameters are required)* |
| Ctrl + Shift + Click (on node) | Similar as Ctrl + Click, but force opens the prompt for the parameterized route, whether the parameters are required or not |

(*Note: after parameters are input and submitted, they are cached to localStorage so that you don't have to keep re-entering the parameters.)

The router UI will always start with the current route's node expanded to show it's children.
