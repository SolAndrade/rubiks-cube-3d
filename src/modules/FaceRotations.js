import * as THREE from 'three';

export default class FaceRotations {
    constructor(cube) {
        this.cube = cube;
    }

    getFrontFaceCubies() {
        return this.cube.cubies.filter(cubie => cubie.position.z === 1);
    }

    rotateFrontFace() {
        const frontFaceCubies = this.getFrontFaceCubies();
        const group = new THREE.Group();
    
        frontFaceCubies.forEach(cubie => {
            // Move cubie to group's local coordinates
            cubie.position.sub(group.position);
            group.add(cubie);
        });
    
        this.cube.scene.add(group);
    
        // Animate the rotation
        const rotationTween = new TWEEN.Tween(group.rotation)
            .to({ z: Math.PI / 2 }, 1000) // 90 degrees rotation over 1 second
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                frontFaceCubies.forEach(cubie => {
                    cubie.geometry.groups.forEach((face, index) => {
                        let newMaterialIndex = face.materialIndex;
    
                        switch (face.materialIndex) {
                            case 0: newMaterialIndex = 3; break; // Right -> Top
                            case 1: newMaterialIndex = 2; break; // Left -> Bottom
                            case 2: newMaterialIndex = 0; break; // Top -> Left
                            case 3: newMaterialIndex = 1; break; // Bottom -> Right
                            case 4: newMaterialIndex = 4; break; // Front -> Front
                            case 5: newMaterialIndex = 5; break; // Back -> Back
                        }
    
                        cubie.geometry.groups[index].materialIndex = newMaterialIndex;
                    });
                    cubie.geometry.groupsNeedUpdate = true; // Update flag to update materials
                });
    
                frontFaceCubies.forEach(cubie => {
                    this.cube.scene.add(cubie);
                });
    
                // Remove the group from the scene after completion
                this.cube.scene.remove(group);
                
            });
    
        rotationTween.start();
    }
}
