export default class MouseInteraction {
    constructor(cube) {
        this.cube = cube;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };

        // Event listeners
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('wheel', this.onMouseWheel.bind(this));

        // Auto rotation timer
        this.autoRotationTimer = null;
        this.startAutoRotationTimer();
        this.shouldRotate = false;
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.shouldRotate = false;
        this.clearAutoRotationTimer();
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    onMouseMove(event) {
        if (this.isDragging) {
            this.shouldRotate = false;
            const deltaMove = {
                x: event.clientX - this.previousMousePosition.x,
                y: event.clientY - this.previousMousePosition.y
            };

            const rotationX = this.cube.scene.rotation.x + deltaMove.y * 0.01;
            const rotationY = this.cube.scene.rotation.y + deltaMove.x * 0.01;

            // Limit the rotation.x to prevent flipping upside down
            this.cube.scene.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationX));
            this.cube.scene.rotation.y = rotationY;

            this.previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
    }

    onMouseUp() {
        this.isDragging = false;
        this.shouldRotate = false;
        this.startAutoRotationTimer();
    }

    onMouseWheel(event) {
        // Adjust camera position based on scroll direction
        if (event.deltaY < 0) {
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
        }, 5000); // 5 seconds
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
}
