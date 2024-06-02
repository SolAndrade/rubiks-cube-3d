import * as THREE from 'three';

export default class MouseInteraction {
    constructor(cube, faceRotations) {
        this.cube = cube;
        this.faceRotations = faceRotations;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.intersectedFace = null;

        // Event listeners for both mouse and touch events
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('wheel', this.onMouseWheel.bind(this));

        document.addEventListener('touchstart', this.onTouchStart.bind(this));
        document.addEventListener('touchmove', this.onTouchMove.bind(this));
        document.addEventListener('touchend', this.onTouchEnd.bind(this));

        // Auto rotation timer
        this.autoRotationTimer = null;
        this.shouldRotate = true;
        this.autoRotate();

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    // Mouse events
    onMouseDown(event) {
        this.handleMouseDown(event.clientX, event.clientY);
    }

    onMouseMove(event) {
        this.handleMouseMove(event.clientX, event.clientY);
    }

    onMouseUp() {
        this.handleMouseUp();
    }

    onMouseWheel(event) {
        this.handleZoom(event.deltaY);
    }

    // Touch events
    onTouchStart(event) {
        const touch = event.touches[0];
        this.handleMouseDown(touch.clientX, touch.clientY);
    }

    onTouchMove(event) {
        const touch = event.touches[0];
        this.handleMouseMove(touch.clientX, touch.clientY);
    }

    onTouchEnd() {
        this.handleMouseUp();
    }

    handleMouseDown(clientX, clientY) {
        this.isDragging = true;
        this.shouldRotate = false;
        this.clearAutoRotationTimer();
        this.previousMousePosition = {
            x: clientX,
            y: clientY
        };

        // Get the intersected face
        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.cube.camera);
        const intersects = this.raycaster.intersectObjects(this.cube.cubies);

        if (intersects.length > 0) {
            this.intersectedFace = this.getFaceFromNormal(intersects[0].face.normal);
        }

        if (this.intersectedFace === 'front') {
            this.faceRotations.rotateFrontFace();
        }
    }

    handleMouseMove(clientX, clientY) {
        if (this.isDragging && this.intersectedFace) {
            this.shouldRotate = false;
            const deltaMove = {
                x: clientX - this.previousMousePosition.x,
                y: clientY - this.previousMousePosition.y
            };

            const rotationX = this.cube.scene.rotation.x + deltaMove.y * 0.01;
            const rotationY = this.cube.scene.rotation.y + deltaMove.x * 0.01;

            // Limit the rotation.x to prevent flipping upside down
            this.cube.scene.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationX));
            this.cube.scene.rotation.y = rotationY;

            this.previousMousePosition = {
                x: clientX,
                y: clientY
            };
        }
    }

    handleMouseUp() {
        this.isDragging = false;
        this.shouldRotate = false;
        this.startAutoRotationTimer();
    }

    handleZoom(deltaY) {
        // Adjust camera position based on scroll direction
        if (deltaY < 0) {
            this.cube.camera.position.z -= 0.5;
        } else {
            this.cube.camera.position.z += 0.5;
        }

        this.clearAutoRotationTimer();
        this.startAutoRotationTimer();
    }

    startAutoRotationTimer() {
        this.autoRotationTimer = setTimeout(() => {
            this.shouldRotate = true;
            this.autoRotate();
        }, 3000); // 3 seconds
    }

    clearAutoRotationTimer() {
        if (this.autoRotationTimer) {
            clearTimeout(this.autoRotationTimer);
            this.autoRotationTimer = null;
        }
    }

    autoRotate() {
        if (!this.shouldRotate) {
            return;
        }
        const rotateSpeed = 0.003;

        this.cube.scene.rotation.y += rotateSpeed;

        requestAnimationFrame(() => this.autoRotate());
    }

    getFaceFromNormal(normal) {
        if (normal.equals(new THREE.Vector3(0, 0, 1))) return 'front';
        if (normal.equals(new THREE.Vector3(0, 0, -1))) return 'back';
        if (normal.equals(new THREE.Vector3(-1, 0, 0))) return 'left';
        if (normal.equals(new THREE.Vector3(1, 0, 0))) return 'right';
        if (normal.equals(new THREE.Vector3(0, 1, 0))) return 'top';
        if (normal.equals(new THREE.Vector3(0, -1, 0))) return 'bottom';
    }
}
