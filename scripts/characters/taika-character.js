import * as THREE from 'three';

/**
 * Taika — Solados / Lumen Society character prototype
 * Original Three.js procedural interpretation based on the two user-supplied references.
 * Forward: +Z. Approximate height: 2.0 units.
 */
export function createTaikaCharacter() {
  const root = new THREE.Group();
  root.name = 'Taika_Solados';
  root.userData = { characterId: 'solados-taika-001', version: '0.4.0', source: 'User-supplied character references', forward: '+Z', height: 2.08 };

  const material = (color, roughness = 0.88, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const M = {
    skin: material('#d9b49b'), skinShade: material('#ad806f'),
    hair: material('#211b1b'), hairLight: material('#382b2a'),
    coat: material('#171719'), coatEdge: material('#a51f2a'),
    lining: material('#4a101b'), shirt: material('#101012'),
    mask: material('#eee9df'), maskRed: material('#a51d2b'),
    eye: material('#3a251f', 0.42), white: material('#fffdf7'),
    glove: material('#eee9df'), pants: material('#171719'),
    boot: material('#100f10'), sole: material('#393437'),
    silver: material('#aaa6a0', 0.35, 0.55)
  };

  const add = (name, geo, mat, parent, pos, scale, rot) => {
    const o = new THREE.Mesh(geo, mat);
    o.name = name;
    o.position.set(...pos);
    if (scale) o.scale.set(...scale);
    if (rot) o.rotation.set(...rot);
    o.castShadow = true; o.receiveShadow = true; parent.add(o);
    return o;
  };
  const group = (name, parent, pos = [0,0,0]) => {
    const g = new THREE.Group(); g.name = name; g.position.set(...pos); parent.add(g); return g;
  };
  const sphere = new THREE.SphereGeometry(1, 20, 16);
  const capsule = (r, h) => new THREE.CapsuleGeometry(r, h, 6, 12);
  const tube = (name, pts, radius, mat, parent) => {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
    return add(name, new THREE.TubeGeometry(curve, 24, radius, 7, false), mat, parent, [0,0,0]);
  };
  const shape = (name, points, depth, mat, parent, pos = [0,0,0]) => {
    const s = new THREE.Shape();
    s.moveTo(points[0][0], points[0][1]);
    for (let i=1;i<points.length;i++) s.lineTo(points[i][0], points[i][1]);
    s.closePath();
    const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.008, bevelThickness: 0.008 });
    return add(name, geo, mat, parent, pos);
  };


  const maskPatch = (name, points, holeCenter, parent) => {
    const outer = new THREE.Shape();
    outer.moveTo(points[0][0], points[0][1]);
    for (let i=1;i<points.length;i++) outer.lineTo(points[i][0], points[i][1]);
    outer.closePath();
    const hole = new THREE.Path();
    hole.absellipse(holeCenter[0], holeCenter[1], 0.056, 0.031, 0, Math.PI*2, true, 0);
    outer.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(outer, { depth: 0.014, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.004, bevelThickness: 0.004 });
    return add(name, geo, M.mask, parent, [0,0,0.202]);
  };

  // Boots, narrow trousers and legs.
  for (const side of [-1,1]) {
    const x = side * 0.105;
    const leg = group(side < 0 ? 'leg-left' : 'leg-right', root, [x,0.783,0]);
    add('trouser-leg', capsule(0.068,0.47), M.pants, leg, [0,-0.28,0], [1,1,0.92]);
    add('knee-fold', sphere, M.coatEdge, leg, [0,-0.12,0.056], [0.052,0.012,0.012]);
    const boot = group('boot', leg, [0,-0.68,0.035]);
    add('boot-shaft', capsule(0.083,0.16), M.boot, boot, [0,0.045,0], [1,1,0.95]);
    add('boot-foot', sphere, M.boot, boot, [0,-0.035,0.09], [0.09,0.065,0.16]);
    add('boot-sole', sphere, M.sole, boot, [0,-0.085,0.085], [0.095,0.018,0.165]);
    add('boot-buckle', new THREE.BoxGeometry(0.11,0.025,0.012), M.silver, boot, [0,0.055,0.083]);
  }

  // Torso and high-neck underlayer.
  const torso = group('upper-body', root, [0,1.15,0]);
  add('shirt-body', capsule(0.19,0.25), M.shirt, torso, [0,0.04,0], [1,1.12,0.83]);
  add('neck', new THREE.CylinderGeometry(0.075,0.082,0.15,20), M.skin, torso, [0,0.34,0]);
  add('high-neck', new THREE.CylinderGeometry(0.091,0.094,0.13,24), M.shirt, torso, [0,0.30,0.015]);
  add('neckline-metal', new THREE.TorusGeometry(0.09,0.008,8,28), M.silver, torso, [0,0.25,0.015], null, [Math.PI/2,0,0]);

  // Long tailored coat: a continuous shaped shell replaces the old capsule torso.
  // The changing radii create a broader shoulder line, fitted waist and flared hem.
  const coatProfile = [
    new THREE.Vector2(0.305,-0.79),
    new THREE.Vector2(0.292,-0.70),
    new THREE.Vector2(0.258,-0.48),
    new THREE.Vector2(0.232,-0.22),
    new THREE.Vector2(0.224,0.02),
    new THREE.Vector2(0.245,0.22),
    new THREE.Vector2(0.205,0.36),
    new THREE.Vector2(0.145,0.39)
  ];
  const coatShell = new THREE.LatheGeometry(coatProfile, 40);
  coatShell.scale(1, 1, 0.66);
  add('coat-tailored-shell', coatShell, M.coat, torso, [0,-0.12,0.012]);
  // Subtle tailoring seams follow the side contour instead of reading as hard primitive edges.
  tube('coat-side-seam-left', [[-0.19,0.25,0.075],[-0.205,0.02,0.09],[-0.19,-0.28,0.095],[-0.245,-0.66,0.09]], 0.0045, M.hairLight, torso);
  tube('coat-side-seam-right', [[0.19,0.25,0.075],[0.205,0.02,0.09],[0.19,-0.28,0.095],[0.245,-0.66,0.09]], 0.0045, M.hairLight, torso);
  shape('coat-left-tail', [[-0.19,0.12],[-0.02,0.13],[-0.055,-0.12],[-0.20,-0.67],[-0.34,-0.77],[-0.28,-0.38]], 0.035, M.coat, torso, [0,0,-0.035]);
  shape('coat-right-tail', [[0.02,0.13],[0.19,0.12],[0.28,-0.38],[0.34,-0.91],[0.20,-0.82],[0.055,-0.12]], 0.035, M.coat, torso, [0,0,-0.035]);
  shape('lining-left', [[-0.19,0.10],[-0.14,0.10],[-0.24,-0.58],[-0.31,-0.70],[-0.27,-0.35]], 0.009, M.lining, torso, [0,0,0.006]);
  shape('lining-right', [[0.14,0.10],[0.19,0.10],[0.27,-0.35],[0.31,-0.70],[0.24,-0.58]], 0.009, M.lining, torso, [0,0,-0.073]);
  // Red lapel outlines and front fasteners.
  tube('left-lapel-red', [[-0.19,0.29,0.105],[-0.10,0.23,0.19],[-0.04,0.12,0.205],[-0.12,-0.02,0.19]], 0.012, M.coatEdge, torso);
  tube('right-lapel-red', [[0.19,0.29,0.105],[0.10,0.23,0.19],[0.04,0.12,0.205],[0.12,-0.02,0.19]], 0.012, M.coatEdge, torso);
  for (let i=0;i<3;i++) {
    const y = 0.015 - i*0.105;
    shape('red-clasp-'+i, [[-0.07,y+0.035],[0.07,y+0.035],[0.045,y-0.005],[0,y-0.025],[-0.045,y-0.005]], 0.014, M.coatEdge, torso, [0,0,0.202]);
  }
  // Oversized raised collar with dark red inner faces.
  shape('collar-left', [[-0.06,0.34],[-0.24,0.48],[-0.36,0.42],[-0.22,0.25],[-0.08,0.22]], 0.045, M.coat, torso, [0,0,0.025]);
  shape('collar-right', [[0.06,0.34],[0.24,0.48],[0.36,0.42],[0.22,0.25],[0.08,0.22]], 0.045, M.coat, torso, [0,0,0.025]);
  tube('collar-red-left', [[-0.24,0.46,0.074],[-0.16,0.38,0.074],[-0.08,0.25,0.074]], 0.012, M.coatEdge, torso);
  tube('collar-red-right', [[0.24,0.46,0.074],[0.16,0.38,0.074],[0.08,0.25,0.074]], 0.012, M.coatEdge, torso);

  // Symmetrical T-pose: both arms extend horizontally from the shoulders.
  // Keep the hand and finger geometry aligned along each arm's outward axis.
  for (const side of [-1,1]) {
    const arm = group(side < 0 ? 'arm-left' : 'arm-right', torso, [side*0.22,0.20,0.025]);
    arm.rotation.z = side * Math.PI / 2;
    add('sleeve', capsule(0.078,0.31), M.coat, arm, [0,-0.16,0], [1,1.2,1]);
    add('wide-cuff', new THREE.CylinderGeometry(0.098,0.084,0.15,20), M.coat, arm, [0,-0.38,0], [1,1,0.9]);
    add('cuff-red-edge', new THREE.TorusGeometry(0.089,0.008,7,20), M.coatEdge, arm, [0,-0.45,0], [1,1,0.9], [Math.PI/2,0,0]);
    add('hand', sphere, M.glove, arm, [0,-0.52,0.015], [0.078,0.045,0.09]);
    for (let finger=0;finger<4;finger++) {
      const spread = (finger-1.5)*0.036;
      add('gloved-finger', capsule(0.012,0.065), M.glove, arm,
        [0,-0.585,spread+0.015], [1,1,1], [0,0,(finger-1.5)*-0.08]);
    }
    add('thumb', capsule(0.014,0.04), M.glove, arm,
      [side*0.055,-0.535,0.045], null, [0,0,side*0.8]);
  }

  // Head and facial expression.
  const head = group('head', root, [0,1.68,0.015]);
  add('face', sphere, M.skin, head, [0,0,0], [0.235,0.285,0.205]);
  add('ear-left', sphere, M.skin, head, [-0.225,-0.015,0], [0.055,0.075,0.045]);
  add('ear-right', sphere, M.skin, head, [0.225,-0.015,0], [0.055,0.075,0.045]);
  add('eye-left', sphere, M.white, head, [-0.092,0.015,0.185], [0.055,0.031,0.025]);
  add('eye-right', sphere, M.white, head, [0.092,0.015,0.185], [0.055,0.031,0.025]);
  add('iris-left', sphere, M.eye, head, [-0.09,0.012,0.208], [0.019,0.022,0.012]);
  add('iris-right', sphere, M.eye, head, [0.094,0.012,0.208], [0.019,0.022,0.012]);
  tube('eyebrow-left', [[-0.16,0.075,0.19],[-0.10,0.035,0.205],[-0.04,0.07,0.20]], 0.016, M.hair, head);
  tube('eyebrow-right', [[0.04,0.07,0.20],[0.10,0.035,0.205],[0.16,0.075,0.19]], 0.016, M.hair, head);
  add('nose', sphere, M.skinShade, head, [0,-0.045,0.205], [0.025,0.04,0.025]);
  tube('mouth', [[-0.045,-0.13,0.17],[0,-0.105,0.18],[0.045,-0.13,0.17]], 0.008, M.hair, head);


  // Small freckles visible around the mask, echoing the inked reference drawing.
  for (const side of [-1,1]) {
    for (let i=0;i<4;i++) {
      add('freckle', sphere, M.skinShade, head,
        [side*(0.145 + (i%2)*0.022), -0.075 - Math.floor(i/2)*0.026, 0.168],
        [0.007,0.007,0.004]);
    }
  }

  // White angular domino mask with red graphic edges, kept separate for customization.
  maskPatch('mask-left-white', [[-0.205,0.10],[-0.045,0.075],[-0.035,-0.015],[-0.11,-0.075],[-0.19,-0.02]], [-0.11,0.015], head);
  maskPatch('mask-right-white', [[0.045,0.075],[0.205,0.10],[0.19,-0.02],[0.11,-0.075],[0.035,-0.015]], [0.11,0.015], head);
  tube('mask-red-left', [[-0.20,0.08,0.22],[-0.12,0.12,0.22],[-0.045,0.07,0.22],[-0.08,-0.04,0.22],[-0.18,-0.02,0.22]], 0.012, M.maskRed, head);
  tube('mask-red-right', [[0.20,0.08,0.22],[0.12,0.12,0.22],[0.045,0.07,0.22],[0.08,-0.04,0.22],[0.18,-0.02,0.22]], 0.012, M.maskRed, head);
  add('mask-center-bridge', new THREE.BoxGeometry(0.045,0.045,0.018), M.maskRed, head, [0,0.055,0.214], null, [0,0,Math.PI/4]);

  // Voluminous curly hair cap and individual sculpted curls.
  add('hair-cap', sphere, M.hair, head, [0,0.205,-0.005], [0.275,0.19,0.225]);
  const curls = [
    [-.22,.23,.02],[-.17,.34,.04],[-.08,.38,.02],[.02,.37,.01],[.13,.34,.02],[.22,.26,.02],
    [-.25,.14,.035],[-.18,.18,.16],[-.09,.22,.19],[.02,.24,.19],[.13,.20,.16],[.22,.15,.09],
    [-.23,.04,.04],[-.19,.09,.16],[.18,.08,.16],[.24,.08,.02],[-.15,.30,-.13],[0,.35,-.15],[.16,.29,-.12]
  ];
  curls.forEach((p,i) => {
    const size = 0.065 + (i%3)*0.008;
    add('hair-curl-'+i, sphere, i%4===0 ? M.hairLight : M.hair, head, p, [size*1.15,size,size]);
    if (p[2] > 0.08) {
      tube('curl-groove-'+i,
        [[p[0]-size*0.42,p[1],p[2]+size*0.78],
         [p[0]-size*0.05,p[1]+size*0.34,p[2]+size*0.94],
         [p[0]+size*0.38,p[1]+size*0.08,p[2]+size*0.82]],
        0.0038, M.hairLight, head);
    }
  });
  // Sideburns frame the mask and keep the silhouette close to the drawing.
  add('sideburn-left', capsule(0.045,0.10), M.hair, head, [-0.22,-0.035,0.035], [1,1,0.8]);
  add('sideburn-right', capsule(0.045,0.10), M.hair, head, [0.22,-0.035,0.035], [1,1,0.8]);

  // Small silver pendant at the throat.
  add('pendant-chain', new THREE.TorusGeometry(0.035,0.006,7,20), M.silver, torso, [0,0.245,0.10], null, [Math.PI/2,0,0]);
  add('pendant', new THREE.OctahedronGeometry(0.035,0), M.silver, torso, [0,0.19,0.115], [0.8,1.2,0.55]);

  root.userData.rig = { torsoPivot: torso, headPivot: head };
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return root;
}
