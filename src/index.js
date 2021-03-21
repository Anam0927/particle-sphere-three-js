import * as THREE from 'three';
import * as dat from 'dat.gui/build/dat.gui';

import './index.scss';

// : VARS
const RADIUS = 1.5;
const NUM_OF_PARTICLES = 800;
let hue = 0;
let speed = 5;
let isLarge = true;

// : UTILS
// -- change color function
const materialColorer = (material) => {
  const HUE =
    material === material1
      ? hue
      : material === material2
      ? hue + 150
      : hue + 300;
  material.color = new THREE.Color(`hsl(${HUE},100%,80%)`);
};

// -- position calculator
const positionCalculator = (radius) => {
  const u = Math.random();
  const v = Math.random();

  const theta = Math.PI * 2 * u;
  const phi = Math.abs(Math.acos(2 * v - 1));

  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);

  return [x, y, z];
};

// -- canvas sizer (css)
const canvasSizer = () => {
  canvas.style.transform = isLarge
    ? 'translate(-50%, 0) scale(1)'
    : 'translate(-50%, 0)  scale(0.2)';
};

// : CANVAS
const canvas = document.querySelector('#canvas');

// : SCENE
// -- main scene
const scene = new THREE.Scene();

// -- sphereLarge Scene
const sphereLarge = new THREE.Object3D();
scene.add(sphereLarge);

// -- sphereSmall Scene
const sphereSmall = new THREE.Object3D();
scene.add(sphereSmall);

// -- sphereSmallest Scene
const sphereSmallest = new THREE.Object3D();
scene.add(sphereSmallest);

// : OBJECTS
// -- create vertices
const vertices1 = [];
for (let i = 0; i < NUM_OF_PARTICLES * 0.33; i++) {
  const [x, y, z] = positionCalculator(RADIUS);
  vertices1.push(x, y, z);
}

const vertices2 = [];
for (let i = 0; i < NUM_OF_PARTICLES * 0.66; i++) {
  const [x, y, z] = positionCalculator((RADIUS / 3) * 2);
  vertices2.push(x, y, z);
}

const vertices3 = [];
for (let i = 0; i < NUM_OF_PARTICLES; i++) {
  const [x, y, z] = positionCalculator(RADIUS / 3);
  vertices3.push(x, y, z);
}

// -- Geometry
const geometry1 = new THREE.BufferGeometry();
geometry1.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(vertices1, 3)
);

const geometry2 = new THREE.BufferGeometry();
geometry2.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(vertices2, 3)
);

const geometry3 = new THREE.BufferGeometry();
geometry3.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(vertices3, 3)
);

// -- Material
const material1 = new THREE.PointsMaterial({
  size: 0.01,
  sizeAttenuation: true,
});

const material2 = new THREE.PointsMaterial({
  size: 0.01,
  sizeAttenuation: true,
});

const material3 = new THREE.PointsMaterial({
  size: 0.01,
  sizeAttenuation: true,
});

// -- points
const points1 = new THREE.Points(geometry1, material1);
sphereLarge.add(points1);

const points2 = new THREE.Points(geometry2, material2);
sphereSmall.add(points2);

const points3 = new THREE.Points(geometry3, material3);
sphereSmallest.add(points3);

// : LIGHT
const pointLight = new THREE.PointLight(0x020887, 100);
pointLight.position.set(0, 0, 2);
scene.add(pointLight);

// : Window Sizes

const sizes = {
  width: Number(
    getComputedStyle(canvas)
      .getPropertyValue('width')
      .split('')
      .slice(0, -2)
      .join('')
  ),
  height: Number(
    getComputedStyle(canvas)
      .getPropertyValue('height')
      .split('')
      .slice(0, -2)
      .join('')
  ),
};

// : CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2.5;
scene.add(camera);

// : RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.sortObjects = false;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// -- Updating on resize
window.addEventListener('resize', () => {
  // Updating Sizes
  sizes.width = Number(
    getComputedStyle(canvas)
      .getPropertyValue('width')
      .split('')
      .slice(0, -2)
      .join('')
  );
  sizes.height = Number(
    getComputedStyle(canvas)
      .getPropertyValue('height')
      .split('')
      .slice(0, -2)
      .join('')
  );

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// : EVENT LISTENER
const button = document.querySelector('button');
button.onclick = () => {
  isLarge = !isLarge;
  canvasSizer();
  button.innerText = isLarge ? 'diminish' : 'enlarge';
};

// : Animation

// -- Main animate function
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  hue += 0.5;

  // -- Update objects
  sphereLarge.rotation.z = speed * 0.5 * elapsedTime;
  sphereLarge.rotation.x = -speed * 0.5 * elapsedTime;

  sphereSmall.rotation.z = -speed * 0.75 * elapsedTime;
  sphereSmall.rotation.y = speed * 0.75 * elapsedTime;

  sphereSmallest.rotation.x = -speed * elapsedTime;
  sphereSmallest.rotation.y = speed * elapsedTime;
  // sphereLarge.rotation.y = 0.5 * elapsedTime;

  // particles.forEach((particle) => materialColorer(particle, hue));
  materialColorer(material1);
  materialColorer(material2);
  materialColorer(material3);
  // particleColorer();

  // -- Render
  renderer.render(scene, camera);

  // -- Call tick() again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
