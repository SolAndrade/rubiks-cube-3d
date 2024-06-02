import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export default class RubiksCube {
    constructor(selector) {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 6;

        this.setLights();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector(selector).appendChild(this.renderer.domElement);

        this.groups = {
            'front': new THREE.Group(),
            'back': new THREE.Group(),
            'left': new THREE.Group(),
            'right': new THREE.Group(),
            'top': new THREE.Group(),
            'bottom': new THREE.Group()
        };

        // Add groups to the scene
        Object.values(this.groups).forEach(group => this.scene.add(group));

        this.cubies = [];

        this.createRubiksCube();
    }

    createCubie(x, y, z) {
        const size = 0.95; // slightly reduce the size to create minimal space

        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xB4247B, metalness: 1.0, roughness: 0.1 }), // Right (red)
            new THREE.MeshStandardMaterial({ color: 0x6B3277, metalness: 1.0, roughness: 0.1 }), // Left (orange)
            new THREE.MeshStandardMaterial({ color: 0xA95F69, metalness: 1.0, roughness: 0.1 }), // Top (yellow)
            new THREE.MeshStandardMaterial({ color: 0x881A1E, metalness: 1.0, roughness: 0.1 }), // Bottom (white)
            new THREE.MeshStandardMaterial({ color: 0x2DB274, metalness: 1.0, roughness: 0.1 }), // Front (blue)
            new THREE.MeshStandardMaterial({ color: 0x15798B, metalness: 1.0, roughness: 0.1 })  // Back (green)
        ];

        // Create a rounded box geometry
        const geometry = new RoundedBoxGeometry(size, size, size, 2, 0.1);

        // Create a mesh with the geometry and the materials
        const cubie = new THREE.Mesh(geometry, materials);

        cubie.geometry.groups.forEach((face, index) => {
            cubie.geometry.groups[index].materialIndex = index;
        });

        // Set the position of the cubie
        cubie.position.set(x, y, z);

        // Add the cubie to the scene
        this.scene.add(cubie);

        // Store the cubie for later reference
        this.cubies.push(cubie);
    }

    createRubiksCube() {
        const positions = [-1, 0, 1];

        positions.forEach(x => {
            positions.forEach(y => {
                positions.forEach(z => {
                    this.createCubie(x, y, z);
                });
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
    }

    setDistanceFromCamera(distance) {
        this.camera.position.z = distance;
    }

    setLights() {
        const lightIntensity = 7;
        const lightColor = 0xffffff;

        const lightPositions = [
            [-10, 10, 10], [10, 10, 10], [-10, -10, 10], [10, -10, 10],
            [-10, 10, -10], [10, 10, -10], [-10, -10, -10], [10, -10, -10]
        ];

        lightPositions.forEach(position => {
            const light = new THREE.DirectionalLight(lightColor, lightIntensity);
            light.position.set(...position);
            this.scene.add(light);
        });
    }

}
