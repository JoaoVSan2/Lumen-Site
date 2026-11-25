import * as THREE from 'three';

/**
 * Taika — Lumen Society stylized avatar study.
 * Rounded, compact game-character proportions; original procedural geometry.
 * Forward: +Z. T-pose. Approximate height: 1.9 units.
 */
export function createTaikaCharacter() {
  const root = new THREE.Group();
  root.name = 'Taika_Solados';
  root.userData = {
    characterId: 'solados-taika-001',
    version: '0.6.0',
    source: 'Original procedural model based on user-supplied Solados references',
    style: 'soft organic low-poly game character',
    forward: '+Z',
    height: 1.9
  };

  const mat = (color, roughness = 0.9, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const M = {
    skin: mat('#d9b49b'), skinShadow: mat('#b88773'),
    hair: mat('#211b1b'), hairAlt: mat('#382b2a'),
    coat: mat('#171719'), coatShade: mat('#242225'),
    red: mat('#a51f2b'), lining: mat('#511522'),
    shirt: mat('#101012'), mask: mat('#eee9df'),
    maskRed: mat('#a51d2b'), eye: mat('#33231f', 0.48),
    glove: mat('#eee9df'), pants: mat('#202024'),
    boot: mat('#100f10'), sole: mat('#393437'),
    silver: mat('#aaa6a0', 0.38, 0.45)
  };

  const add = (name, geometry, material, parent, position, scale, rotation) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(...position);
    if (scale) mesh.scale.set(...scale);
    if (rotation) mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const group = (name, parent, position = [0, 0, 0]) => {
    const g = new THREE.Group();
    g.name = name;
    g.position.set(...position);
    parent.add(g);
    return g;
  };
  const sphere = new THREE.SphereGeometry(1, 32, 24);
  const capsule = (radius, length) => new THREE.CapsuleGeometry(radius, length, 8, 16);
  const tube = (name, points, radius, material, parent) => {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    return add(name, new THREE.TubeGeometry(curve, 28, radius, 9, false), material, parent, [0, 0, 0]);
  };
  const panel = (name, points, depth, material, parent, position = [0, 0, 0]) => {
    const shape = new THREE.Shape();
    shape.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(p => shape.lineTo(p[0], p[1]));
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelSegments: 3,
      steps: 1, bevelSize: 0.012, bevelThickness: 0.012
    });
    return add(name, geo, material, parent, position);
  };

  // Soft, compact trouser legs with broad knees and rounded boots.
  for (const side of [-1, 1]) {
    const leg = group(side < 0 ? 'leg-left' : 'leg-right', root, [side * 0.12, 0.62, 0]);
    add('upper-trouser-volume', sphere, M.pants, leg, [0, -0.10, 0], [0.115, 0.19, 0.112]);
    add('lower-trouser-volume', capsule(0.095, 0.23), M.pants, leg, [0, -0.34, 0], [1.02, 1.05, 1.02]);
    add('soft-knee-fold', sphere, M.coatShade, leg, [0, -0.24, 0.078], [0.075, 0.035, 0.018]);
    add('boot-shaft', capsule(0.105, 0.16), M.boot, leg, [0, -0.51, 0.015], [1.08, 1, 1.04]);
    add('rounded-boot-toe', sphere, M.boot, leg, [0, -0.575, 0.105], [0.135, 0.09, 0.18]);
    add('boot-sole', sphere, M.sole, leg, [0, -0.635, 0.095], [0.14, 0.026, 0.18]);
    add('boot-buckle', new THREE.BoxGeometry(0.095, 0.028, 0.018), M.silver, leg, [0, -0.48, 0.112], null, [0, 0, -side * 0.08]);
  }

  // A single broad coat silhouette with a soft waist and flared lower half.
  const torso = group('upper-body', root, [0, 1.02, 0]);
  const coatProfile = [
    new THREE.Vector2(0.31, -0.74),
    new THREE.Vector2(0.335, -0.68),
    new THREE.Vector2(0.315, -0.56),
    new THREE.Vector2(0.285, -0.34),
    new THREE.Vector2(0.255, -0.12),
    new THREE.Vector2(0.265, 0.08),
    new THREE.Vector2(0.30, 0.24),
    new THREE.Vector2(0.275, 0.34),
    new THREE.Vector2(0.18, 0.40),
    new THREE.Vector2(0.12, 0.40)
  ];
  const coatGeo = new THREE.LatheGeometry(coatProfile, 48);
  coatGeo.scale(1, 1, 0.78);
  add('one-piece-coat-body', coatGeo, M.coat, torso, [0, -0.05, 0]);
  add('rounded-shoulder-yoke', sphere, M.coatShade, torso, [0, 0.275, -0.005], [0.305, 0.145, 0.225]);
  add('soft-waist-shaping', sphere, M.coat, torso, [0, -0.22, 0], [0.267, 0.205, 0.205]);
  add('inner-shirt', capsule(0.17, 0.24), M.shirt, torso, [0, 0.18, 0], [1, 1.08, 0.78]);

  // Split tails expose the burgundy lining as a deliberate graphic accent.
  panel('left-coat-tail', [[-0.22, -0.29], [-0.012, -0.27], [-0.045, -0.52], [-0.19, -0.78], [-0.33, -0.76], [-0.30, -0.48]], 0.055, M.coatShade, torso, [0, 0, -0.035]);
  panel('right-coat-tail', [[0.012, -0.27], [0.22, -0.29], [0.30, -0.48], [0.33, -0.76], [0.19, -0.78], [0.045, -0.52]], 0.055, M.coatShade, torso, [0, 0, -0.035]);
  panel('left-lining', [[-0.19, -0.40], [-0.13, -0.38], [-0.23, -0.68], [-0.30, -0.74], [-0.27, -0.52]], 0.018, M.lining, torso, [0, 0, 0.026]);
  panel('right-lining', [[0.13, -0.38], [0.19, -0.40], [0.27, -0.52], [0.30, -0.74], [0.23, -0.68]], 0.018, M.lining, torso, [0, 0, -0.078]);
  tube('left-coat-edge', [[-0.30, -0.46, 0.065], [-0.27, -0.61, 0.065], [-0.20, -0.76, 0.06]], 0.009, M.red, torso);
  tube('right-coat-edge', [[0.30, -0.46, 0.065], [0.27, -0.61, 0.065], [0.20, -0.76, 0.06]], 0.009, M.red, torso);

  // Raised collar and bold lapels; larger, cleaner shapes read at game-camera distance.
  panel('collar-left', [[-0.07, 0.30], [-0.24, 0.46], [-0.34, 0.39], [-0.22, 0.20], [-0.08, 0.19]], 0.05, M.coatShade, torso, [0, 0, 0.035]);
  panel('collar-right', [[0.07, 0.30], [0.24, 0.46], [0.34, 0.39], [0.22, 0.20], [0.08, 0.19]], 0.05, M.coatShade, torso, [0, 0, 0.035]);
  tube('collar-red-left', [[-0.24, 0.43, 0.09], [-0.16, 0.35, 0.10], [-0.09, 0.23, 0.11]], 0.012, M.red, torso);
  tube('collar-red-right', [[0.24, 0.43, 0.09], [0.16, 0.35, 0.10], [0.09, 0.23, 0.11]], 0.012, M.red, torso);
  tube('lapel-left', [[-0.19, 0.26, 0.17], [-0.10, 0.18, 0.205], [-0.045, 0.06, 0.20], [-0.12, -0.10, 0.17]], 0.014, M.red, torso);
  tube('lapel-right', [[0.19, 0.26, 0.17], [0.10, 0.18, 0.205], [0.045, 0.06, 0.20], [0.12, -0.10, 0.17]], 0.014, M.red, torso);
  for (let i = 0; i < 3; i++) {
    add('coat-fastener', new THREE.SphereGeometry(0.018, 16, 12), M.silver, torso, [0, -0.04 - i * 0.105, 0.205]);
  }

  // T-pose arms use broad rounded sleeves and mitten-like gloves.
  for (const side of [-1, 1]) {
    const shoulder = group(side < 0 ? 'arm-left' : 'arm-right', torso, [side * 0.255, 0.245, 0.015]);
    shoulder.rotation.z = side * Math.PI / 2;
    add('rounded-shoulder-cap', sphere, M.coat, shoulder, [0, -0.025, 0], [0.135, 0.14, 0.125]);
    add('upper-sleeve', capsule(0.105, 0.22), M.coat, shoulder, [0, -0.17, 0], [1.12, 1.08, 1.06]);
    add('elbow-volume', sphere, M.coat, shoulder, [0, -0.29, 0], [0.105, 0.105, 0.105]);
    add('lower-sleeve', capsule(0.088, 0.12), M.coat, shoulder, [0, -0.37, 0], [1.08, 1, 1.04]);
    add('cuff', capsule(0.092, 0.055), M.coatShade, shoulder, [0, -0.465, 0], [1.04, 1, 1]);
    add('cuff-red-band', new THREE.TorusGeometry(0.09, 0.009, 8, 28), M.red, shoulder, [0, -0.49, 0], [1, 1, 0.95], [Math.PI / 2, 0, 0]);
    add('rounded-glove-palm', sphere, M.glove, shoulder, [0, -0.55, 0.015], [0.09, 0.105, 0.10]);
    add('thumb', capsule(0.026, 0.05), M.glove, shoulder, [side * 0.058, -0.54, 0.07], null, [0, 0, side * 0.75]);
  }

  // Larger rounded head, a signature of the shared cute/stylized game language.
  const head = group('head', root, [0, 1.58, 0.015]);
  add('head-shape', sphere, M.skin, head, [0, 0, 0], [0.265, 0.29, 0.235]);
  add('soft-jaw', sphere, M.skin, head, [0, -0.105, 0.045], [0.205, 0.145, 0.19]);
  add('ear-left', sphere, M.skin, head, [-0.245, -0.025, 0], [0.065, 0.082, 0.052]);
  add('ear-right', sphere, M.skin, head, [0.245, -0.025, 0], [0.065, 0.082, 0.052]);

  // Expression remains understated so the mask and hair define the character.
  add('eye-left', sphere, M.eye, head, [-0.095, 0.015, 0.205], [0.025, 0.028, 0.014]);
  add('eye-right', sphere, M.eye, head, [0.095, 0.015, 0.205], [0.025, 0.028, 0.014]);
  tube('brow-left', [[-0.16, 0.09, 0.19], [-0.10, 0.065, 0.205], [-0.045, 0.085, 0.20]], 0.012, M.hair, head);
  tube('brow-right', [[0.045, 0.085, 0.20], [0.10, 0.065, 0.205], [0.16, 0.09, 0.19]], 0.012, M.hair, head);

  // Angular two-piece domino mask with bold red edge graphics.
  panel('mask-left', [[-0.22, 0.105], [-0.045, 0.085], [-0.04, -0.025], [-0.12, -0.09], [-0.205, -0.035]], 0.018, M.mask, head, [0, 0, 0.19]);
  panel('mask-right', [[0.045, 0.085], [0.22, 0.105], [0.205, -0.035], [0.12, -0.09], [0.04, -0.025]], 0.018, M.mask, head, [0, 0, 0.19]);
  tube('mask-red-left', [[-0.205, 0.09, 0.225], [-0.12, 0.12, 0.23], [-0.045, 0.08, 0.23], [-0.09, -0.045, 0.23], [-0.19, -0.02, 0.225]], 0.012, M.maskRed, head);
  tube('mask-red-right', [[0.205, 0.09, 0.225], [0.12, 0.12, 0.23], [0.045, 0.08, 0.23], [0.09, -0.045, 0.23], [0.19, -0.02, 0.225]], 0.012, M.maskRed, head);
  add('mask-bridge', new THREE.BoxGeometry(0.045, 0.045, 0.022), M.maskRed, head, [0, 0.055, 0.23], null, [0, 0, Math.PI / 4]);

  // One generous hair mass plus a controlled number of large sculptural curls.
  add('hair-main-volume', sphere, M.hair, head, [0, 0.205, -0.005], [0.315, 0.215, 0.255]);
  add('hair-back-volume', sphere, M.hair, head, [0, 0.045, -0.125], [0.275, 0.235, 0.19]);
  const curls = [
    [-0.23, 0.25, 0.035], [-0.16, 0.35, 0.035], [-0.055, 0.39, 0.02],
    [0.06, 0.39, 0.015], [0.17, 0.34, 0.03], [0.245, 0.24, 0.025],
    [-0.24, 0.12, 0.07], [-0.17, 0.19, 0.18], [-0.06, 0.23, 0.205],
    [0.07, 0.23, 0.205], [0.18, 0.18, 0.17], [0.245, 0.11, 0.07],
    [-0.17, 0.30, -0.13], [-0.03, 0.36, -0.17], [0.12, 0.32, -0.14]
  ];
  curls.forEach((p, i) => {
    const s = 0.072 + (i % 3) * 0.006;
    add('sculpted-curl', sphere, i % 4 === 0 ? M.hairAlt : M.hair, head, p, [s * 1.12, s, s]);
  });
  add('sideburn-left', capsule(0.05, 0.11), M.hair, head, [-0.235, -0.055, 0.025], [1, 1, 0.9]);
  add('sideburn-right', capsule(0.05, 0.11), M.hair, head, [0.235, -0.055, 0.025], [1, 1, 0.9]);

  // Pendant.
  add('neck-chain', new THREE.TorusGeometry(0.035, 0.006, 8, 24), M.silver, torso, [0, 0.23, 0.12], null, [Math.PI / 2, 0, 0]);
  add('pendant', new THREE.OctahedronGeometry(0.032, 0), M.silver, torso, [0, 0.17, 0.14], [0.8, 1.15, 0.55]);

  root.userData.rig = { torsoPivot: torso, headPivot: head };
  root.traverse(object => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  return root;
}
