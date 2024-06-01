import RubiksCube from './modules/RubiksCube.js';
import MouseInteraction from './modules/MouseInteraction.js';
import AutoRotation from './modules/AutoRotation.js';
import './style.css'

const cube = new RubiksCube('.experience');
const mouseInteraction = new MouseInteraction(cube);
const autoRotation = new AutoRotation(cube);

cube.animate();
