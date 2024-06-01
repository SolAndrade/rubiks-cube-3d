import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export default class RubiksCube {
    constructor(selector) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.setLights();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector(selector).appendChild(this.renderer.domElement);

        this.cubies = [];

        this.createRubiksCube();
    }

    createCubie(x, y, z) {
        const size = 0.95; // slightly reduce the size to create minimal space

        //const circleGridTexture = this.generateCircleGridTexture();

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

        // Set the position of the cubie
        cubie.position.set(x, y, z);

        // Add the cubie to the scene
        this.scene.add(cubie);

        // Store the cubie for later reference
        this.cubies.push(cubie);
    }

    generateCircleGridTexture() {
        // Create a canvas for generating the texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
    
        // Set background color
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Draw a 8x8 grid of circles centered with a border
        const gridSize = 8;
        const circleRadius = 15; // Increased radius of the circles
        const borderSize = 70; // Border size
        const gridArea = canvas.width - 2 * borderSize;
        const spacing = gridArea / (gridSize - 1);
    
        ctx.fillStyle = '#000000';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = borderSize + spacing * i;
                const y = borderSize + spacing * j;
                ctx.beginPath();
                ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    
        // Create a texture from the canvas
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
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
        this.renderer.render(this.scene, this.camera);
    }

    setDistanceFromCamera(distance) {
        this.camera.position.z = distance;
    }

    setLights() {
        const lightIntensity = 7;
        const lightColor = 0xffffff;

        // Add front top right directional light
        const frontTopRightLight = new THREE.DirectionalLight(lightColor, lightIntensity);
        frontTopRightLight.position.set(-10, 10, 10);
        this.scene.add(frontTopRightLight);

        // Add front top left directional light
        const frontTopLeftLight = new THREE.DirectionalLight(lightColor, lightIntensity);
        frontTopLeftLight.position.set(10, 10, 10);
        this.scene.add(frontTopLeftLight);

        // Add front bottom right directional light
        const frontBottomRightLight = new THREE.DirectionalLight(lightColor, lightIntensity);
        frontBottomRightLight.position.set(-10, -10, 10);
        this.scene.add(frontBottomRightLight);

        // Add front bottom left directional light
        const frontBottomLeftLight = new THREE.DirectionalLight(lightColor, lightIntensity);
        frontBottomLeftLight.position.set(10, -10, 10);
        this.scene.add(frontBottomLeftLight);

        // Add back top right directional light
        const backTopRightLight = new THREE.DirectionalLight(lightColor, lightIntensity);
        backTopRightLight.position.set(-10, 10, -10);
        this.scene.add(backTopRightLight);

        // Add back top left directional light
        const backTopLeftLight = new THREE.DirectionalLight(lightColor, lightIntensity);
        backTopLeftLight.position.set(10, 10, -10);
        this.scene.add(backTopLeftLight);

        // Add back bottom right directional light
        const backBottomRightLight = new THREE.DirectionalLight(lightColor, lightIntensity);
        backBottomRightLight.position.set(-10, -10, -10);
        this.scene.add(backBottomRightLight);

        // Add back bottom left directional light
        const backBottomLeftLight = new THREE.DirectionalLight(lightColor, lightIntensity);
        backBottomLeftLight.position.set(10, -10, -10);
        this.scene.add(backBottomLeftLight);
    }
}
