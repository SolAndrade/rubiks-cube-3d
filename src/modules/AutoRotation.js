export default class AutoRotation {
    constructor(cube) {
        this.cube = cube;
        this.autoRotateTimeout = null;
        this.isAutoRotating = false;
        this.autoRotateSpeed = 0.005;

        this.startAutoRotateTimeout();
    }

    startAutoRotateTimeout() {
        clearTimeout(this.autoRotateTimeout);

        this.autoRotateTimeout = setTimeout(() => {
            this.isAutoRotating = true;
        }, 5000);
    }

    update() {
        if (this.isAutoRotating) {
            this.cube.scene.rotation.x += this.autoRotateSpeed;
            this.cube.scene.rotation.y += this.autoRotateSpeed;
        }
    }
}
