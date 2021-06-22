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

- [x] Update docs
  - [ ] Include short animated GIF
  - [x] Include shields
