import * as THREE from "three";

export default class Maze {
  constructor() {
    this.maze = new THREE.Group();
    this.map = [
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 1, 1, 1, 0, 1, 1, 1], 
      [0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1]
    ]
    this.geometry = new THREE.BoxGeometry(1, 7, 1)
    this.material = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.5 })
    this.create()
  }

  create() {
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (this.map[i][j] === 1) {
          const mesh = new THREE.Mesh(this.geometry, this.material)
          this.mesh = mesh
          this.mesh.castShadow = true
          this.mesh.receiveShadow = true
          this.mesh.position.set(j, 3, i)
          this.maze.add(this.mesh)
        }
      }
    }
  }
}
