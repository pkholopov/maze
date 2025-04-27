import * as THREE from 'three'
import App from '../App'

export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.setDirectionalLight();
    this.setAmbientLight();
  }

  setDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight('#ffffff', 1);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.far = 100;
    this.directionalLight.shadow.camera.left = 5;
    this.directionalLight.shadow.camera.top = 5;
    this.directionalLight.shadow.camera.right = -5;
    this.directionalLight.shadow.camera.bottom = -5;
    this.directionalLight.position.set(5, 5, 5);
    this.directionalLight.target.position.set(3, 0, 0);
    this.scene.add(this.directionalLight);
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight('#ffffff', 1);
    this.scene.add(this.ambientLight);
  }
}
