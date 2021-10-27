import Vue from 'vue'
import { ButtonPlugin, ModalPlugin } from 'bootstrap-vue'
import './components.js'

const plugins = [
  ButtonPlugin,
  ModalPlugin
]
plugins.forEach(p => Vue.use(p))
