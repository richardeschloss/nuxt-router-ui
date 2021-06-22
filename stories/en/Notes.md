---
title: Notes
order: 100
tree: { name: 'root', children: [{name: 'child1'}] }
---

# Dev-only mode

To only use these or any components in dev mode, use `$nuxt.context.isDev`:

## Example: 
<div v-if="$nuxt.context.isDev">
  <D3Tree :data="tree" />
</div>

# Tasks

* [ ] Eventually want this to be able support extremely large trees without it getting sluggish.
  * Thoughts on this might be to have a routesRoot property that will only visualize the routes starting at that provide root and then downward. 
  * The D3Tree component supports a "maxDepth" property to help provide some constraints, and it defaults to 6. The routerUI may wish to respect that property too