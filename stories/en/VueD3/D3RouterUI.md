---
title: D3RouterUI
order: 2
---

# Description 
A router UI for Vue based on d3. It works by wrapper around the D3Tree component, simply feeding it the data: `window.$router.options.routes`

# Try it here

* Mac users: [CMD + Shift + Space] to open the tree
* Non-mac users: [Ctrl + Shift + Space] to open the tree
* See the <a href="http://localhost:3000/stories/en/Quick%20Start#use-it" target="_blank">keyboard shortcuts</a> in other window as you try it out

<D3RouterUI />

---

# Properties
| name | description | default |
| --- | --- | --- |
| margin | S/A D3Tree | S/A D3 Tree |
| cacheKey | key to use for caching route parameers | $cachedParams |
| clickOverride | key to trigger the "nodeClick" event | 'metaKey' on Mac, 'ctrlKey' on non-mac |
| openOverride | key to partially trigger the "routes UI" event | 'metaKey' on Mac, 'ctrlKey' on non-mac combined with Shift + Space |