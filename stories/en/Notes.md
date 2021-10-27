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

* [ ] Update the module and plugin to scan the generate a map of imports. Use this instead of require.context for auto-registering the components.
* [ ] I'm not sure how much I want to rely on bootstrap-vue vs. just using the bootstrap.css on its own. Bootstrap-vue has some nice features.
* [ ] Eventually want this to be able support extremely large trees without it getting sluggish.
  * Thoughts on this might be to have a routesRoot property that will only visualize the routes starting at that provide root and then downward. 
  * The D3Tree component supports a "maxDepth" property to help provide some constraints, and it defaults to 6. The routerUI may wish to respect that property too