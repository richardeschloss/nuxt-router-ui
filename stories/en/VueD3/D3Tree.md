---
title: D3Tree
order: 1
fetch:
  flare: /data/flare.json | json
  img: /data/images.json | json
margin: {top: 40, right: 60, bottom: 40, left: 60}
dx: 45
orientation: 0
nodeSize: 5
linkWidth: 1.5

---

# Without images
<D3Tree v-if="fetched.flare" :data="fetched.flare" :dx="dx" :margin="margin" :linkWidth="linkWidth" 
  :nodeSize="nodeSize"
  :orientation="0"
  :startIn="{ name: 'interpolate' }"
/>

# With Images
<D3Tree v-if="fetched.img" :data="fetched.img" :dx="dx" :margin="margin" :linkWidth="linkWidth" 
  :nodeSize="nodeSize"
  :orientation="90"
  :startIn="{ name: 'FlareVis' }"
/>

---

# Features:
  - [x] Tree updates when the data or certain properties change
  - [x] Enable zoom / panning
  - [x] Auto sizing of the tree on initialization 
  - [x] Auto creation of an id (if specified, append "-svg" to the svg elm, otherwise, default to "d3-tree-chart"
  - [x] Auto-size the viewBox when nodes are clicked to make it easier to see things
  - [x] Click should expand / collapse the node's children, if any. 
  - [x] Ctrl+click should emit the "click" event so that parents can work with that event. For example, a router UI may want to know the node information (i.e., `d.path`).
  - [x] Auto start-in feature... to start with a given node as active; for example, for a router UI, may want to have the current route active and expanded.
  - [x] Support image nodes. Set the src attr to `d.data.imageURL` of the given node, if it exists. Blowup the image on mouseover.

# Properties

| name | description | default |
| --- | --- | --- |
| data | data as a tree json. d3js expects each node to have "name" and "children". The component will also respect an "imageURL" on each node. Any other properties can exist on the nodes, but that information won't be visualized in this tree | {} |
| depth | the depth of the tree to visualize on initialization | 1 |
| duration | animation duration in ms | 250 ms
| orientation | rotation angle of the tree in deg | 0
| margin | margin of the tree svg inside the container | { top: 40, bottom: 40, left: 60, right: 60 } |
| dx | width between nodes (tree breadth) | 10 |
| nodeSize | node radius | 2.5 |
| containerClass | class to provide to the container | 'tree-container' |
| linkColor | tree link color | #555 |
| linkWidth | tree link width | 1.5 |
| maxDepth | max levels to show in the tree | 6 | 
| nodeActiveFill | fill color on active node | #555 |
| nodeInActiveFill | #999 |
| imageSize | the size of the image edge, treating the image as a square | 25 (means 25 x 25 sqaure) |
| blowupFactor | the factor by which to scale the image on mouseover | 3 (as in 3x size) |
| startIn | an object { [prop]: value } to match a node to be active on start; i.e., { name: 'John' } means to start the tree with John and his children expanded, all others closed. (Useful for the router UI, which tries to match the current route path) | {} |
| clickOverride | key to trigger the "nodeClick" event | 'metaKey' on Mac, 'ctrlKey' on non-mac

# Events

| Name | Trigger | Notes |
| --- | --- | --- |
| nodeClick | Mac: Cmd + click any node, non-mac: Ctrl + Click any node | Can be overridden with `clickOverride` prop |

