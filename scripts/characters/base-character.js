import * as THREE from 'three';

/**
 * Lumen Society — Original Character Base v0.1
 * Procedural, modular character assembled from original Three.js geometry.
 * Local axes: +Y up, +Z forward. Height: approximately 2.0 world units.
 */
export function createBaseCharacter(options = {}) {
  const palette = {
    skin: options.skin ?? '#c98f70',
    skinShadow: options.skinShadow ?? '#a96f58',
    shirt: options.shirt ?? '#6d9c91',
    shirtLight: options.shirtLight ?? '#8bb8a8',
    trousers: options.trousers ?? '#526c78',
    shoes: options.shoes ?? '#e8e1d2',
    sole: options.sole ?? '#b6aa98',
    eyes: '#34443f',
    brows: '#765647',
    mouth: '#8f554d',
    ...options.palette
  };

  const root = new THREE.Group();
  root.name = 'LumenCharacter_Base';
  root.userData = {
    characterId: 'lumen-base-001',
    version: '0.1.0',
    modularSlots: ['head', 'hair', 'face', 'torso', 'top', 'bottom', 'hands', 'feet', 'accessories'],
    forward: '+Z',
    height: 2.0
  };

  const materials = {};
  const mat = (name, color, roughness = 0.92) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0,
      flatShading: false
    });
    materials[name] = material;
    return material;
  };

  const skin = mat('skin', palette.skin);
  const skinShadow = mat('skinShadow', palette.skinShadow);
  const shirt = mat('shirt', palette.shirt);
  const shirtLight = mat('shirtLight', palette.shirtLight);
  const trousers = mat('trousers', palette.trousers);
  const shoes = mat('shoes', palette.shoes);
  const sole = mat('sole', palette.sole);
  const eye = mat('eyes', palette.eyes, 0.55);
  const brow = mat('brows', palette.brows);
  const mouth = mat('mouth', palette.mouth);

  const geometry = {
    head: new THREE.SphereGeometry(0.255, 32, 24),
    torso: new THREE.CapsuleGeometry(0.205, 0.30, 8, 16),
    pelvis: new THREE.SphereGeometry(0.205, 24, 18),
    limb: new THREE.CapsuleGeometry(0.067, 0.205, 6, 12),
    forearm: new THREE.CapsuleGeometry(0.056, 0.185, 6, 12),
    thigh: new THREE.CapsuleGeometry(0.083, 0.20, 6, 12),
    shin: new THREE.CapsuleGeometry(0.065, 0.205, 6, 12),
    hand: new THREE.SphereGeometry(0.073, 20, 16),
    foot: new THREE.SphereGeometry(1, 24, 16),
    eye: new THREE.SphereGeometry(0.027, 16, 12),
    ear: new THREE.SphereGeometry(0.065, 18, 14),
    nose: new THREE.SphereGeometry(0.038, 16, 12),
    neck: new THREE.CylinderGeometry(0.075, 0.085, 0.12, 20)
  };

  const mesh = (name, geo, material, parent, position, scale) => {
    const item = new THREE.Mesh(geo, material);
    item.name = name;
    item.position.set(...position);
    if (scale) item.scale.set(...scale);
    item.castShadow = true;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  };

  const group = (name, parent, position = [0, 0, 0]) => {
    const item = new THREE.Group();
    item.name = name;
    item.position.set(...position);
    parent.add(item);
    return item;
  };

  // ROOT + pelvis + torso: the upper body is its own pivot for future animation.
  const body = group('body', root);
  mesh('pelvis', geometry.pelvis, trousers, body, [0, 0.91, 0], [0.92, 0.78, 0.72]);
  const torsoPivot = group('torso-pivot', body, [0, 1.03, 0]);
  mesh('torso', geometry.torso, shirt, torsoPivot, [0, 0.205, 0], [1.0, 1.08, 0.82]);
  mesh('collar', new THREE.TorusGeometry(0.083, 0.018, 8, 24), shirtLight, torsoPivot, [0, 0.405, 0]);
  const neck = mesh('neck', geometry.neck, skin, body, [0, 1.49, 0]);

  // Head is a clean, hair-ready base. Hair is deliberately a separate slot.
  const headPivot = group('head-slot', root, [0, 1.66, 0]);
  mesh('head', geometry.head, skin, headPivot, [0, 0, 0], [0.94, 1.08, 0.91]);
  mesh('ear-left', geometry.ear, skin, headPivot, [-0.238, -0.015, 0], [0.72, 0.92, 0.62]);
  mesh('ear-right', geometry.ear, skin, headPivot, [0.238, -0.015, 0], [0.72, 0.92, 0.62]);
  mesh('eye-left', geometry.eye, eye, headPivot, [-0.091, 0.018, 0.225]);
  mesh('eye-right', geometry.eye, eye, headPivot, [0.091, 0.018, 0.225]);
  mesh('brow-left', new THREE.CapsuleGeometry(0.012, 0.055, 4, 8), brow, headPivot, [-0.091, 0.079, 0.224], [1, 0.55, 0.55]);
  mesh('brow-right', new THREE.CapsuleGeometry(0.012, 0.055, 4, 8), brow, headPivot, [0.091, 0.079, 0.224], [1, 0.55, 0.55]);
  mesh('nose', geometry.nose, skinShadow, headPivot, [0, -0.035, 0.244], [0.72, 0.85, 0.7]);

  const smileCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.052, -0.112, 0.229),
    new THREE.Vector3(0, -0.128, 0.24),
    new THREE.Vector3(0.052, -0.112, 0.229)
  ]);
  mesh('mouth-smile', new THREE.TubeGeometry(smileCurve, 12, 0.008, 6, false), mouth, headPivot, [0, 0, 0]);

  // Arms: independent shoulder and elbow pivots for later rigging/animation.
  const arms = {};
  for (const side of [-1, 1]) {
    const label = side < 0 ? 'left' : 'right';
    const shoulder = group(`shoulder-${label}`, torsoPivot, [side * 0.235, 0.335, 0]);
    mesh(`upper-arm-${label}`, geometry.limb, shirt, shoulder, [0, -0.135, 0], [1.05, 1, 1]);
    const elbow = group(`elbow-${label}`, shoulder, [0, -0.275, 0]);
    mesh(`forearm-${label}`, geometry.forearm, skin, elbow, [0, -0.13, 0], [1, 1, 1]);
    mesh(`hand-${label}`, geometry.hand, skin, elbow, [0, -0.275, 0], [0.92, 1.08, 0.9]);
    arms[label] = { shoulder, elbow };
  }

  // Legs: thigh + shin + shoe are separate parts, ready for a future skeleton.
  const legs = {};
  for (const side of [-1, 1]) {
    const label = side < 0 ? 'left' : 'right';
    const hip = group(`hip-${label}`, body, [side * 0.105, 0.86, 0]);
    mesh(`thigh-${label}`, geometry.thigh, trousers, hip, [0, -0.15, 0]);
    const knee = group(`knee-${label}`, hip, [0, -0.29, 0]);
    mesh(`shin-${label}`, geometry.shin, trousers, knee, [0, -0.145, 0]);
    const ankle = group(`ankle-${label}`, knee, [0, -0.29, 0]);
    mesh(`shoe-${label}`, geometry.foot, shoes, ankle, [0, -0.205, 0.055], [0.105, 0.075, 0.19]);
    mesh(`shoe-sole-${label}`, geometry.foot, sole, ankle, [0, -0.253, 0.06], [0.108, 0.027, 0.192]);
    legs[label] = { hip, knee, ankle };
  }

  // Small shirt details make the silhouette readable without locking in a style.
  mesh('shirt-pocket', new THREE.BoxGeometry(0.095, 0.09, 0.018), shirtLight, torsoPivot, [0.105, 0.23, 0.17]);
  mesh('shirt-button-1', new THREE.SphereGeometry(0.012, 10, 8), shoes, torsoPivot, [0, 0.31, 0.17]);
  mesh('shirt-button-2', new THREE.SphereGeometry(0.012, 10, 8), shoes, torsoPivot, [0, 0.22, 0.17]);

  const slots = group('attachment-slots', root);
  slots.userData.attachments = {
    hair: headPivot,
    hat: headPivot,
    glasses: headPivot,
    earrings: headPivot,
    backpack: body,
    necklace: torsoPivot,
    top: torsoPivot,
    bottom: body
  };

  root.userData.rig = { body, torsoPivot, headPivot, arms, legs, slots };
  root.userData.materials = materials;
  root.userData.geometries = geometry;

  // Feet at y=0; total silhouette reaches about y=1.95.
  root.position.y = 0;
  root.traverse(object => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  return root;
}
