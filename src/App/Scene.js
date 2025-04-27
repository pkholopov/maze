import * as THREE from "three";

export default class MainScene extends THREE.Scene {
  constructor() {
    super();
    this.background = new THREE.Color(0x101010);
    this.fog = new THREE.Fog(0x101010, 1, 4);
  }
}
