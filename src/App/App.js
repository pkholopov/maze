import * as THREE from "three"
import Sizes from "./Utils/Sizes"
import MainScene from "./Scene"
import Camera from "./Camera"
import Renderer from "./Renderer"
import World from "./World/World"
import Player from "./World/Objects/Player"

export default class App {
  constructor(canvas) {
    if (App._instance) {
      return App._instance
    }
    App._instance = this

    this.canvas = canvas
    this.sizes = new Sizes()
    this.clock = new THREE.Clock()
    this.scene = new MainScene()
    this.world = new World()
    this.player = new Player(new THREE.Vector3(2, 0, 4))
    this.renderer = new Renderer()
    
    

    this.sizes.addEventListener("resize", () => {
      
      this.resize()
    })

    window.requestAnimationFrame(() => {
      this.tick(this.clock.getDelta())
    })
  }

  resize() {
    this.player.resize()
    this.renderer.resize()
  }

  tick(delta) {
    this.player.update(delta)

    this.renderer.update()

    window.requestAnimationFrame(() => {
      this.tick(this.clock.getDelta())
    })
  }
}
