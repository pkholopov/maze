import * as THREE from "three";
import App from "./App";

export default class Camera {
  constructor(position) {
    this.app = new App();
    this.sizes = this.app.sizes;
    this.scene = this.app.scene;
    this.canvas = this.app.canvas;
    this.position = position

    this.setInstance();
  }

  setInstance() {
    this.cameraInstance = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.01,
      1000
    );
    this.cameraInstance.position.copy(this.position);
    this.scene.add(this.cameraInstance);
  }

  resize() {
    this.cameraInstance.aspect = this.sizes.width / this.sizes.height;
    this.cameraInstance.updateProjectionMatrix();
    
  }

}

