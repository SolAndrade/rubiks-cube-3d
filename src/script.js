import RubiksCube from './modules/RubiksCube.js';
import MouseInteraction from './modules/MouseInteraction.js';
import AutoRotation from './modules/AutoRotation.js';
import FaceRotations from './modules/FaceRotations.js';
import './style.css'

const cube = new RubiksCube('.experience');
const faceRotations = new FaceRotations(cube);
const mouseInteraction = new MouseInteraction(cube, faceRotations);
const autoRotation = new AutoRotation(cube);

cube.animate();
