import * as THREE from 'three'
import { Octree } from 'three/examples/jsm/math/Octree.js'
import App from '../App'
import Environment from './Environment'
import TestCube from './Objects/TestCube';
import Floor from './Objects/Floor';
import Maze from './Objects/Maze';

export default class World {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    
    this.collidableObjects = new THREE.Group();
    this.scene.add(this.collidableObjects);
    this.collidableObjects.add(
      new Maze().maze
    )
    this.createOctree();

    this.nonCollidableObjects = new THREE.Group();
    this.scene.add(this.nonCollidableObjects);
    this.nonCollidableObjects.add(new Floor().floor);

    this.environment = new Environment();
  }

  createOctree() {
    this.octree = new Octree();
    this.octree.fromGraphNode(this.collidableObjects);
  }
}
