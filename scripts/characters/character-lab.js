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

let targetRotation = 0;
let targetTilt = 0;
let zoom = 1;
let baseCameraDistance = 5.7;
let smallScalePreview = false;
const minZoom = 0.65;
const maxZoom = 2.4;
const pointers = new Map();
let dragOrigin = null;
let pinchOrigin = null;

function updateZoom(nextZoom) {
  zoom = THREE.MathUtils.clamp(nextZoom, minZoom, maxZoom);
  camera.position.z = baseCameraDistance / zoom;
  camera.updateProjectionMatrix();
}

function setSmallScalePreview(enabled) {
  smallScalePreview = enabled;
  character.scale.setScalar(enabled ? 0.52 : 1);
  const button = document.getElementById('small-scale-preview');
  if (button) {
    button.setAttribute('aria-pressed', String(enabled));
    button.textContent = enabled ? '1:1' : '½';
    button.title = enabled
      ? 'Voltar à escala normal'
      : 'Visualizar personagem em escala reduzida';
  }
}

function setPinchOrigin() {
  if (pointers.size < 2) {
    pinchOrigin = null;
    return;
  }
  const points = [...pointers.values()];
  const dx = points[0].x - points[1].x;
  const dy = points[0].y - points[1].y;
  pinchOrigin = { distance: Math.max(1, Math.hypot(dx, dy)), zoom };
}

renderer.domElement.addEventListener('pointerdown', event => {
  renderer.domElement.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 1) {
    dragOrigin = { x: event.clientX, y: event.clientY };
  } else if (pointers.size === 2) {
    dragOrigin = null;
    setPinchOrigin();
  }
});

renderer.domElement.addEventListener('pointermove', event => {
  if (!pointers.has(event.pointerId)) return;
  const previous = pointers.get(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (pointers.size >= 2) {
    if (!pinchOrigin) setPinchOrigin();
    const points = [...pointers.values()];
    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;
    const distance = Math.max(1, Math.hypot(dx, dy));
    updateZoom(pinchOrigin.zoom * (distance / pinchOrigin.distance));
    return;
  }

  if (dragOrigin) {
    targetRotation += (event.clientX - previous.x) * 0.009;
    targetTilt = THREE.MathUtils.clamp(targetTilt + (event.clientY - previous.y) * 0.002, -0.12, 0.12);
  }
});

function releasePointer(event) {
  pointers.delete(event.pointerId);
  if (pointers.size === 1) {
    const remaining = [...pointers.values()][0];
    dragOrigin = { x: remaining.x, y: remaining.y };
    pinchOrigin = null;
  } else if (pointers.size === 0) {
    dragOrigin = null;
    pinchOrigin = null;
  } else {
    setPinchOrigin();
  }
}
renderer.domElement.addEventListener('pointerup', releasePointer);
renderer.domElement.addEventListener('pointercancel', releasePointer);
renderer.domElement.addEventListener('lostpointercapture', releasePointer);

renderer.domElement.addEventListener('wheel', event => {
  event.preventDefault();
  updateZoom(zoom * Math.exp(-event.deltaY * 0.0015));
}, { passive: false });

document.getElementById('zoom-in')?.addEventListener('click', () => updateZoom(zoom * 1.18));
document.getElementById('zoom-out')?.addEventListener('click', () => updateZoom(zoom / 1.18));
document.getElementById('zoom-reset')?.addEventListener('click', () => updateZoom(1));
document.getElementById('small-scale-preview')?.addEventListener('click', () => {
  setSmallScalePreview(!smallScalePreview);
});

function resize() {
  const width = Math.max(1, host.clientWidth);
  const height = Math.max(1, host.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.fov = width < 600 ? 41 : 36;
  baseCameraDistance = width < 600 ? 6.2 : 5.7;
  updateZoom(zoom);
}
const observer = new ResizeObserver(resize);
observer.observe(host);
resize();

const clock = new THREE.Clock();
function animate() {
  const elapsed = clock.getElapsedTime();
  if (pointers.size === 0) targetRotation += 0.0018;
  turntable.rotation.y += (targetRotation - turntable.rotation.y) * 0.08;
  turntable.rotation.x += (targetTilt - turntable.rotation.x) * 0.08;
  character.userData.rig.torsoPivot.scale.y = 1 + Math.sin(elapsed * 1.6) * 0.003;
  character.userData.rig.headPivot.rotation.z = Math.sin(elapsed * 0.9) * 0.008;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
