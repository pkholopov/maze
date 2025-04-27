import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
import Camera from '../../Camera';
import App from '../../App'
import Movement from '../../Actions/Movement';

export default class Player extends Camera{
  constructor(position) {
    super(position);
    this.app = new App();
    this.canvas = this.app.canvas;
    this.clock = this.app.clock;
    this.position = position
    this.size = 0.25
    this.speed = 1
    this.direction = new THREE.Vector3(0, 0, 0)
    this.audioListener = new THREE.AudioListener();
    this.cameraInstance.add(this.audioListener);
    this.addControls()
    this.addSounds()
    this.movement = new Movement(this)
    this.controls.addEventListener('lock', () => {
      this.movement.connect()
    })
    this.controls.addEventListener('unlock', () => {
      this.movement.disconnect()
    })

    this.movement.addEventListener('move', () => {
      if (!this.walkingSound.isPlaying) this.walkingSound.play()
      
    })

    this.movement.addEventListener('stop', () => {
      this.walkingSound.pause()
    })
  }

  addControls() {
    this.controls = new PointerLockControls(this.cameraInstance, this.canvas);
    this.canvas.addEventListener('click', () => {
      this.controls.lock()
    })
  }

  addSounds() {
    const audioLoader = new THREE.AudioLoader();
    this.walkingSound = new THREE.Audio(this.audioListener);
    audioLoader.load('./walking.mp3', (buffer) => {
      this.walkingSound.setBuffer(buffer);
      this.walkingSound.setLoop(true);
      this.walkingSound.setVolume(1);
    });
  }

  update(delta) {
    this.movement.move(delta)
    this.controls.update(delta)
  }
}
