import * as THREE from 'three'
import App from '../../App'

export default class TestCube {
  constructor() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00c000, metalness: 0.9, roughness: 0.5 });
    this.mesh = new THREE.Mesh(geometry, material);
  }
}
