[![npm](https://img.shields.io/npm/v/nuxt-router-ui.svg)](https://www.npmjs.com/package/nuxt-router-ui)
[![npm](https://img.shields.io/npm/dt/nuxt-router-ui.svg)](https://www.npmjs.com/package/nuxt-router-ui)
[![](https://gitlab.com/richardeschloss/nuxt-router-ui/badges/master/pipeline.svg)](https://gitlab.com/richardeschloss/nuxt-router-ui)
[![](https://gitlab.com/richardeschloss/nuxt-router-ui/badges/master/coverage.svg)](https://gitlab.com/richardeschloss/nuxt-router-ui)
[![NPM](https://img.shields.io/npm/l/nuxt-router-ui.svg)](https://github.com/richardeschloss/nuxt-router-ui/blob/development/LICENSE)

[📖 **Release Notes**](./CHANGELOG.md)

# nuxt-router-ui

A dope AF router UI for Nuxt and VueJS. Stash it in the footer and just use it when you need it! Hide it when you don't!

## Demo
![](https://cdn-images-1.medium.com/max/800/1*z8zQ1Tc6B3GkKsYjaFMCBA.gif)

| Action | Result |
| --- | --- |
| Ctrl + Shift + Space | Opens the Router UI |
| Click (on node) | Opens the route's children, if any |
| Ctrl + Click (on node) | Navigates to that route's path. If it's a parameterized route, you'll be prompted for parameters before navigation (only if parameters are required)* |
| Ctrl + Shift + Click (on node) | Similar as Ctrl + Click, but force opens the prompt for the parameterized route, whether the parameters are required or not |

(*Note: after parameters are input and submitted, they are cached to localStorage so that you don't have to keep re-entering the parameters.)

The router UI will always start with the current route's node expanded to show it's children.

More info in the [Quick Start](https://nuxt-router-ui.netlify.app/stories/en/Quick%20Start)