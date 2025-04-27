import * as THREE from "three";
import App from "./App";

export default class Renderer {
  constructor() {
    this.app = new App();
    this.sizes = this.app.sizes;
    this.scene = this.app.scene;
    this.camera = this.app.camera ?? this.app.player;
    this.canvas = this.app.canvas;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.canvas.appendChild(this.instance.domElement);
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.physicallyCorrectLights = true;
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.5;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.resize();    
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(2, this.sizes.pixelRatio));
  }

  update() {
    this.instance.render(this.scene, this.camera.cameraInstance);
  }

}
