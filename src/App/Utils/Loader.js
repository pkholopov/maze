import * as THREE from 'three'

export default class Loader extends THREE.EventDispatcher {
  constructor(resources) {
    this.resources = resources
    this.queue = resources.length
    this.loaded = 0
  }
}
