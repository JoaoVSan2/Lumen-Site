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
    version: '1.0.0',
    source: 'Original procedural model based on user-supplied Solados references',
    style: 'rounded sculpted low-poly game character',
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

  // Open-front coat panels make the burgundy lining readable from the front and sides.
  panel('left-coat-tail', [[-0.22, -0.24], [-0.025, -0.25], [-0.045, -0.54], [-0.19, -0.79], [-0.34, -0.77], [-0.30, -0.47]], 0.065, M.coatShade, torso, [0, 0, -0.025]);
  panel('right-coat-tail', [[0.025, -0.25], [0.22, -0.24], [0.30, -0.47], [0.34, -0.77], [0.19, -0.79], [0.045, -0.54]], 0.065, M.coatShade, torso, [0, 0, -0.025]);

  // Broad wine-colored inner facings remain visible even at reduced character scale.
  panel('left-inner-facing', [[-0.205, 0.23], [-0.105, 0.19], [-0.075, -0.12], [-0.20, -0.48], [-0.285, -0.70], [-0.31, -0.58], [-0.235, -0.30]], 0.024, M.lining, torso, [0, 0, 0.105]);
  panel('right-inner-facing', [[0.105, 0.19], [0.205, 0.23], [0.235, -0.30], [0.31, -0.58], [0.285, -0.70], [0.20, -0.48], [0.075, -0.12]], 0.024, M.lining, torso, [0, 0, 0.105]);
  panel('left-lining-tail', [[-0.205, -0.36], [-0.145, -0.34], [-0.17, -0.43], [-0.205, -0.54], [-0.255, -0.65], [-0.285, -0.70], [-0.27, -0.57], [-0.235, -0.45]], 0.014, M.lining, torso, [0, 0, 0.132]);
  panel('right-lining-tail', [[0.145, -0.34], [0.205, -0.36], [0.235, -0.45], [0.27, -0.57], [0.285, -0.70], [0.255, -0.65], [0.205, -0.54], [0.17, -0.43]], 0.014, M.lining, torso, [0, 0, 0.132]);
  tube('left-coat-edge', [[-0.30, -0.43, 0.17], [-0.27, -0.60, 0.17], [-0.20, -0.77, 0.15]], 0.011, M.red, torso);
  tube('right-coat-edge', [[0.30, -0.43, 0.17], [0.27, -0.60, 0.17], [0.20, -0.77, 0.15]], 0.011, M.red, torso);
  tube('coat-hem-red', [[-0.30, -0.765, 0.04], [-0.16, -0.79, 0.075], [0, -0.795, 0.08], [0.16, -0.79, 0.075], [0.30, -0.765, 0.04]], 0.009, M.red, torso);

  // Taller folded collar with a visible burgundy inner surface.
  panel('collar-left', [[-0.065, 0.29], [-0.255, 0.53], [-0.365, 0.43], [-0.245, 0.18], [-0.075, 0.17]], 0.065, M.coatShade, torso, [0, 0, 0.045]);
  panel('collar-right', [[0.065, 0.29], [0.255, 0.53], [0.365, 0.43], [0.245, 0.18], [0.075, 0.17]], 0.065, M.coatShade, torso, [0, 0, 0.045]);
  panel('collar-lining-left', [[-0.235, 0.445], [-0.16, 0.39], [-0.095, 0.235], [-0.18, 0.235]], 0.018, M.lining, torso, [0, 0, 0.118]);
  panel('collar-lining-right', [[0.235, 0.445], [0.16, 0.39], [0.095, 0.235], [0.18, 0.235]], 0.018, M.lining, torso, [0, 0, 0.118]);
  tube('collar-red-left', [[-0.255, 0.50, 0.13], [-0.17, 0.39, 0.145], [-0.09, 0.23, 0.15]], 0.014, M.red, torso);
  tube('collar-red-right', [[0.255, 0.50, 0.13], [0.17, 0.39, 0.145], [0.09, 0.23, 0.15]], 0.014, M.red, torso);
  tube('lapel-left', [[-0.205, 0.25, 0.19], [-0.12, 0.15, 0.215], [-0.055, 0.015, 0.215], [-0.13, -0.16, 0.18]], 0.016, M.red, torso);
  tube('lapel-right', [[0.205, 0.25, 0.19], [0.12, 0.15, 0.215], [0.055, 0.015, 0.215], [0.13, -0.16, 0.18]], 0.016, M.red, torso);

  // Back yoke and center seam give the rear coat a deliberate silhouette.
  panel('back-yoke-raised', [[-0.255, 0.19], [-0.18, 0.255], [0, 0.285], [0.18, 0.255], [0.255, 0.19], [0.18, 0.145], [0, 0.17], [-0.18, 0.145]], 0.018, M.coatShade, torso, [0, 0, -0.205]);
  tube('back-yoke-seam', [[-0.245, 0.19, -0.19], [-0.12, 0.235, -0.207], [0, 0.255, -0.211], [0.12, 0.235, -0.207], [0.245, 0.19, -0.19]], 0.008, M.red, torso);
  add('back-tail-volume', sphere, M.coatShade, torso, [0, -0.49, -0.155], [0.205, 0.285, 0.055]);
  tube('back-center-seam', [[0, 0.15, -0.212], [0, -0.16, -0.214], [0, -0.47, -0.205], [0, -0.75, -0.15]], 0.009, M.coatShade, torso);
  panel('back-vent-lining', [[-0.035, -0.53], [0.035, -0.53], [0.075, -0.67], [0.105, -0.755], [0.055, -0.775], [0, -0.75], [-0.055, -0.775], [-0.105, -0.755], [-0.075, -0.67]], 0.012, M.lining, torso, [0, 0, -0.213]);

  for (let i = 0; i < 3; i++) {
    add('coat-fastener', new THREE.SphereGeometry(0.018, 16, 12), M.silver, torso, [0, -0.04 - i * 0.105, 0.225]);
  }

  // T-pose arms use broad rounded sleeves and mitten-like gloves.
  for (const side of [-1, 1]) {
    const shoulder = group(side < 0 ? 'arm-left' : 'arm-right', torso, [side * 0.255, 0.245, 0.015]);
    shoulder.rotation.z = side * Math.PI / 2;
    add('rounded-shoulder-cap', sphere, M.coat, shoulder, [0, -0.035, 0], [0.145, 0.15, 0.13]);
    add('continuous-sleeve-core', capsule(0.102, 0.43), M.coat, shoulder, [0, -0.265, 0], [1.16, 1.0, 1.08]);
    add('upper-sleeve-volume', sphere, M.coat, shoulder, [0, -0.145, 0], [0.125, 0.19, 0.12]);
    add('soft-elbow-volume', sphere, M.coat, shoulder, [0, -0.31, 0], [0.116, 0.115, 0.112]);
    add('lower-sleeve-volume', sphere, M.coat, shoulder, [0, -0.405, 0], [0.105, 0.13, 0.105]);
    add('cuff', sphere, M.coatShade, shoulder, [0, -0.49, 0], [0.098, 0.065, 0.102]);
    add('cuff-red-band', new THREE.TorusGeometry(0.083, 0.008, 8, 28), M.red, shoulder, [0, -0.49, 0], [1, 1, 0.92], [Math.PI / 2, 0, 0]);
    add('rounded-glove-palm', sphere, M.glove, shoulder, [0, -0.555, 0.012], [0.071, 0.083, 0.078]);
    add('thumb', sphere, M.glove, shoulder, [side * 0.047, -0.535, 0.055], [0.032, 0.043, 0.034]);
    // Three subtle rounded finger forms add hand readability without breaking the mitten-like style.
    for (const fingerX of [-0.038, 0, 0.038]) {
      add('glove-finger', sphere, M.glove, shoulder, [fingerX, -0.625, 0.035], [0.021, 0.047, 0.024]);
    }
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
  panel('mask-left', [[-0.235, 0.12], [-0.035, 0.105], [-0.035, -0.075], [-0.12, -0.145], [-0.215, -0.085]], 0.035, M.mask, head, [0, 0, 0.205]);
  panel('mask-right', [[0.035, 0.105], [0.235, 0.12], [0.215, -0.085], [0.12, -0.145], [0.035, -0.075]], 0.035, M.mask, head, [0, 0, 0.205]);
  tube('mask-red-left', [[-0.22, 0.10, 0.252], [-0.13, 0.125, 0.255], [-0.04, 0.085, 0.255], [-0.085, -0.09, 0.255], [-0.19, -0.055, 0.252]], 0.009, M.maskRed, head);
  tube('mask-red-right', [[0.22, 0.10, 0.252], [0.13, 0.125, 0.255], [0.04, 0.085, 0.255], [0.085, -0.09, 0.255], [0.19, -0.055, 0.252]], 0.009, M.maskRed, head);
  panel('mask-center-bridge', [[-0.035, 0.105], [0.035, 0.105], [0.045, -0.075], [0, -0.115], [-0.045, -0.075]], 0.035, M.mask, head, [0, 0, 0.222]);
  panel('mask-red-relief-left', [[-0.225, 0.105], [-0.145, 0.132], [-0.075, 0.095], [-0.105, 0.045], [-0.205, 0.055]], 0.012, M.maskRed, head, [0, 0, 0.246]);
  panel('mask-red-relief-right', [[0.145, 0.132], [0.225, 0.105], [0.205, 0.055], [0.105, 0.045], [0.075, 0.095]], 0.012, M.maskRed, head, [0, 0, 0.246]);
  panel('mask-side-fin-left', [[-0.225, 0.085], [-0.265, 0.13], [-0.255, -0.055], [-0.205, -0.09]], 0.026, M.mask, head, [0, 0, 0.19]);
  panel('mask-side-fin-right', [[0.265, 0.13], [0.225, 0.085], [0.205, -0.09], [0.255, -0.055]], 0.026, M.mask, head, [0, 0, 0.19]);

  // One generous hair mass plus a controlled number of large sculptural curls.
  add('hair-main-volume', sphere, M.hair, head, [0, 0.205, -0.005], [0.315, 0.215, 0.255]);
  add('hair-back-volume', sphere, M.hair, head, [0, 0.045, -0.125], [0.275, 0.235, 0.19]);
  const curls = [
    [-0.235, 0.245, 0.035], [-0.16, 0.345, 0.015], [-0.055, 0.39, 0.005],
    [0.065, 0.385, 0.008], [0.17, 0.33, 0.02], [0.235, 0.235, 0.035],
    [-0.235, 0.105, 0.055], [-0.155, 0.205, 0.175], [-0.045, 0.245, 0.205],
    [0.075, 0.24, 0.205], [0.18, 0.19, 0.16], [0.235, 0.085, 0.06],
    [-0.15, 0.31, -0.145], [0.015, 0.345, -0.16], [0.16, 0.29, -0.14]
  ];
  curls.forEach((p, i) => {
    const s = 0.078 + (i % 3) * 0.008;
    add('integrated-sculpted-curl', sphere, i % 4 === 0 ? M.hairAlt : M.hair, head, p, [s * 1.10, s * 0.96, s * 0.98]);
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
