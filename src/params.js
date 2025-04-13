import * as THREE from 'three'

export default {
  // Camera
  cameraFov: 45,
  cameraNear: 0.01,
  cameraFar: 100,
  cameraPosition: new THREE.Vector3(4, 0, 5),

  // Scene
  background: new THREE.Color(0x101010),
  isFog: true,
  fogColor: new THREE.Color(0x101010),
  fogNear: 1,
  fogFar: 4,

  // Renderer
  antialias: true
}
