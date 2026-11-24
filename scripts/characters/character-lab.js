import * as THREE from 'three';
import { createTaikaCharacter } from './taika-character.js';

const host = document.getElementById('character-canvas');
if (!host) throw new Error('Character Lab canvas host not found.');

const scene = new THREE.Scene();
scene.background = null;
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
camera.position.set(0, 1.18, 5.7);
camera.lookAt(0, 1.08, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
const touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, touch ? 1.35 : 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight('#fff8e9', '#738b7b', 2.1));
const key = new THREE.DirectionalLight('#fff0d9', 2.5);
key.position.set(-3.5, 6, 4);
key.castShadow = true;
key.shadow.mapSize.set(touch ? 512 : 1024, touch ? 512 : 1024);
key.shadow.camera.left = -3;
key.shadow.camera.right = 3;
key.shadow.camera.top = 4;
key.shadow.camera.bottom = -2;
key.shadow.bias = -0.0003;
scene.add(key);
const fill = new THREE.DirectionalLight('#c5e4df', 1.0);
fill.position.set(4, 2, -3);
scene.add(fill);

const character = createTaikaCharacter();
const turntable = new THREE.Group();
turntable.add(character);
scene.add(turntable);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(2.1, 64),
  new THREE.MeshStandardMaterial({ color: '#d9e6d9', roughness: 1, transparent: true, opacity: 0.78 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.012;
floor.receiveShadow = true;
scene.add(floor);

const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.ShadowMaterial({ color: '#587563', opacity: 0.15 })
);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.y = -0.01;
shadowPlane.receiveShadow = true;
scene.add(shadowPlane);

let dragging = false;
let previousX = 0;
let previousY = 0;
let targetRotation = 0;
let targetTilt = 0;
let zoom = 1;

renderer.domElement.addEventListener('pointerdown', event => {
  dragging = true;
  previousX = event.clientX;
  previousY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
});
renderer.domElement.addEventListener('pointermove', event => {
  if (!dragging) return;
  targetRotation += (event.clientX - previousX) * 0.009;
  targetTilt = THREE.MathUtils.clamp(targetTilt + (event.clientY - previousY) * 0.002, -0.12, 0.12);
  previousX = event.clientX;
  previousY = event.clientY;
});
const stopDrag = () => { dragging = false; };
renderer.domElement.addEventListener('pointerup', stopDrag);
renderer.domElement.addEventListener('pointercancel', stopDrag);
renderer.domElement.addEventListener('wheel', event => {
  event.preventDefault();
  zoom = THREE.MathUtils.clamp(zoom + Math.sign(event.deltaY) * -0.08, 0.82, 1.28);
}, { passive: false });

function resize() {
  const width = Math.max(1, host.clientWidth);
  const height = Math.max(1, host.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.fov = width < 600 ? 41 : 36;
  camera.position.z = (width < 600 ? 6.2 : 5.7) / zoom;
  camera.updateProjectionMatrix();
}
const observer = new ResizeObserver(resize);
observer.observe(host);
resize();

const clock = new THREE.Clock();
function animate() {
  const elapsed = clock.getElapsedTime();
  if (!dragging) targetRotation += 0.0018;
  turntable.rotation.y += (targetRotation - turntable.rotation.y) * 0.08;
  turntable.rotation.x += (targetTilt - turntable.rotation.x) * 0.08;
  character.userData.rig.torsoPivot.scale.y = 1 + Math.sin(elapsed * 1.6) * 0.003;
  character.userData.rig.headPivot.rotation.z = Math.sin(elapsed * 0.9) * 0.008;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
