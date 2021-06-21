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

* Tree should update when the data or properties change
* Features:
  - [x] Enable zoom / panning
  - [x] Auto sizing of the tree on initialization 
  - [x] Auto creation of an id (if specified, append "-svg" to the svg elm, otherwise, default to "d3-tree-chart"
  - [x] Auto-size the viewBox when nodes are clicked to make it easier to see things
  - [x] Click should expand / collapse the node's children, if any. 
  - [x] Ctrl+click should emit the "click" event so that parents can work with that event. For example, a router UI may want to know the node information (i.e., `d.path`).
  - [x] Auto start-in feature... to start with a given node as active; for example, for a router UI, may want to have the current route active and expanded.
  - [x] Support image nodes. Set the src attr to `d.data.imageURL` of the given node, if it exists. Blowup the image on mouseover.
  - IFrame support? I.e., may lead way for something like a "preview page" feature for a RouterUI that would use this. Actually, might be a security issue. Omit for now.
* Properties to consider:
  - [x] ~~width~~, ~~height~~, margin, data, orientation (rotation angle, accomplished easily with css transforms!);  The viewBox will auto-update on transitions! (cool!). Update: "width" means "tree breadth", provided by dx property, and "height" means "tree depth", specified by dy, which is auto-calculated as the *element's* width on the page divided by a `maxDepth` property. Only when the orientation is 90 degrees are the dx and dy values swapped.
  - node size and spacing, and styling for the node and node text. Maybe support images in the nodes.
  - [x] node click handlers...not needed as a prop because the click handlers inside emit the click events. Parents just need to specify `@click` and their event is fired actually on ctrl + click.
  - [x] properties for the images, if any
  - [x] startIn, default to an empty string. If set, collapse all others, but expand this one. Perhaps this type can be a string | function. 
  - [x] Use different pictures for example.
