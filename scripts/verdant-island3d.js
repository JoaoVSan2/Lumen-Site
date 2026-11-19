import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

// LUMEN SOCIETY — VERDANT ISLAND 1.0
// Cena independente. Não altera o Island Core nem sua câmera.

const host = document.getElementById('verdant-canvas');
if (!host) throw new Error('Elemento #verdant-canvas não encontrado.');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#b7d4bd');
scene.fog = new THREE.FogExp2('#b7d4bd', 0.00075);

const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 1800);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
const touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

renderer.setPixelRatio(Math.min(devicePixelRatio || 1, touch ? 1.35 : 1.8));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
host.innerHTML = '';
host.appendChild(renderer.domElement);
Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block', touchAction: 'none' });

scene.add(new THREE.HemisphereLight('#e9f5e7', '#526b54', 2.0));
const sun = new THREE.DirectionalLight('#fff0d5', 2.7);
sun.position.set(-38, 62, 28);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -348;
sun.shadow.camera.right = 348;
sun.shadow.camera.top = 348;
sun.shadow.camera.bottom = -348;
sun.shadow.bias = -0.00025;
scene.add(sun);

// Escala global de 500% acima do tamanho original (6x), mantendo
// todas as partes da ilha e seus elementos naturais na mesma proporção.
const islandWorld = new THREE.Group();
islandWorld.scale.setScalar(6);
scene.add(islandWorld);

const mat = (color, roughness = 1) => new THREE.MeshStandardMaterial({ color, roughness, flatShading: true });
const grassMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: false });
const sandMat = mat('#d9c69a');
const waterMat = new THREE.MeshStandardMaterial({ color: '#64aaa9', roughness: 0.28, metalness: 0.05, transparent: true, opacity: 0.94 });
const rockMats = [mat('#858d7d'), mat('#a3a18d'), mat('#6f7c70')];
const trunkMat = mat('#76583f');
const leafMats = ['#3f7456', '#56875e', '#6d9965', '#86a96f'].map(c => mat(c));
const flowerMats = ['#f2d58f', '#e8a5a0', '#f3e8d7', '#d8b1d7'].map(c => mat(c));

let seed = 72819;
function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
function smooth(a, b, x) { const t = THREE.MathUtils.clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); }

const SEA = -1.15;
const ISLAND_RADIUS = 43;
function edgeRadius(a) {
  return ISLAND_RADIUS * (0.94 + Math.sin(a*3+0.4)*0.035 + Math.sin(a*5+1.1)*0.022 + Math.cos(a*2-0.7)*0.025);
}
function heightAt(x, z) {
  const northPeak = Math.exp(-((x+7)**2 + (z+23)**2)/190) * 13.5;
  const northEastPeak = Math.exp(-((x-17)**2 + (z+18)**2)/125) * 9.5;
  const westRidge = Math.exp(-((x+24)**2 + (z-1)**2)/170) * 5.0;
  const centralRise = Math.exp(-((x-1)**2 + (z+2)**2)/420) * 3.2;
  const valley = Math.exp(-((x-3)**2 + (z-15)**2)/115) * 1.8;
  const rolling = Math.sin(x*0.19+z*0.11)*0.42 + Math.cos(z*0.23-x*0.08)*0.34 + Math.sin((x+z)*0.31)*0.18;
  return 0.15 + northPeak + northEastPeak + westRidge + centralRise - valley + rolling;
}
function insideIsland(x,z,margin=0) {
  const a = Math.atan2(z,x);
  return Math.hypot(x,z) < edgeRadius(a)-margin;
}

const ocean = new THREE.Mesh(new THREE.PlaneGeometry(240,240), waterMat);
ocean.rotation.x = -Math.PI/2;
ocean.position.y = SEA;
ocean.receiveShadow = true;
islandWorld.add(ocean);

// Large organic island terrain, built as a radial height mesh.
const terrainGroup = new THREE.Group();
islandWorld.add(terrainGroup);
const SEG = 192, RINGS = 72;
const positions = [0, heightAt(0,0), 0], indices = [], colors = [];
for (let ring=1; ring<=RINGS; ring++) {
  const f = ring/RINGS;
  for (let i=0;i<SEG;i++) {
    const a = i/SEG*Math.PI*2;
    const r = edgeRadius(a)*f;
    const x = Math.cos(a)*r, z = Math.sin(a)*r;
    positions.push(x, heightAt(x,z), z);
  }
}
for (let i=0;i<SEG;i++) indices.push(0, 1+(i+1)%SEG, 1+i);
for (let ring=0;ring<RINGS-1;ring++) {
  const a0=1+ring*SEG, b0=a0+SEG;
  for (let i=0;i<SEG;i++) {
    const n=(i+1)%SEG, a=a0+i, b=a0+n, c=b0+i, d=b0+n;
    indices.push(a,b,c,b,d,c);
  }
}
const base = new THREE.Color('#72996a'), light = new THREE.Color('#91b77a'), dark = new THREE.Color('#557f5b'), high = new THREE.Color('#a5b18a');
for (let i=0;i<positions.length;i+=3) {
  const x=positions[i], y=positions[i+1], z=positions[i+2];
  const n=(Math.sin(x*.12+z*.07)+Math.cos(z*.15-x*.09))*.5;
  const c=base.clone().lerp(light,smooth(.0,.9,n)*.45).lerp(dark,smooth(.05,.9,-n)*.3);
  if (y>8) c.lerp(high,smooth(8,14,y)*.7);
  colors.push(c.r,c.g,c.b);
}
const terrainGeo = new THREE.BufferGeometry();
terrainGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
terrainGeo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
terrainGeo.setIndex(indices);
terrainGeo.computeVertexNormals();
const land = new THREE.Mesh(terrainGeo,grassMat);
land.receiveShadow = true;
land.castShadow = true;
terrainGroup.add(land);

// Layered sandy shore around the whole coastline.
const shoreVertices=[], shoreIndices=[];
const shoreLayers=[1.0,1.025,1.055,1.085];
for(let layer=0;layer<shoreLayers.length;layer++) for(let i=0;i<SEG;i++) {
  const a=i/SEG*Math.PI*2, r=edgeRadius(a)*shoreLayers[layer];
  const x=Math.cos(a)*r,z=Math.sin(a)*r;
  const edge=heightAt(Math.cos(a)*edgeRadius(a),Math.sin(a)*edgeRadius(a));
  const y=THREE.MathUtils.lerp(edge-.08,SEA-.55,layer/(shoreLayers.length-1));
  shoreVertices.push(x,y,z);
}
for(let l=0;l<shoreLayers.length-1;l++) for(let i=0;i<SEG;i++) {
  const n=(i+1)%SEG,a=l*SEG+i,b=l*SEG+n,c=(l+1)*SEG+i,d=(l+1)*SEG+n;
  shoreIndices.push(a,b,c,b,d,c);
}
const shoreGeo=new THREE.BufferGeometry();
shoreGeo.setAttribute('position',new THREE.Float32BufferAttribute(shoreVertices,3));
shoreGeo.setIndex(shoreIndices); shoreGeo.computeVertexNormals();
const shore=new THREE.Mesh(shoreGeo,new THREE.MeshStandardMaterial({color:'#d9c69a',roughness:1,side:THREE.DoubleSide}));
shore.receiveShadow=true; islandWorld.add(shore);

// Water bodies: natural lakes, river bends and waterfall curtains.
function lake(x,z,rx,rz) {
  const g=new THREE.CircleGeometry(1,64);
  const m=new THREE.Mesh(g,waterMat);
  m.rotation.x=-Math.PI/2; m.position.set(x,heightAt(x,z)+.10,z); m.scale.set(rx,rz,1); m.receiveShadow=true; islandWorld.add(m);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(1,.08,6,64),mat('#9cae82'));
  rim.rotation.x=Math.PI/2; rim.position.set(x,m.position.y-.04,z); rim.scale.set(rx,rz,1); islandWorld.add(rim);
}
lake(-10,8,5.5,3.8);
lake(14,-7,4.2,3.0);
lake(5,25,3.1,2.1);

function river(points,radius,color='#66aaa5') {
  const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,heightAt(x,z)+.18,z)));
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,180,radius,8,false),new THREE.MeshStandardMaterial({color,roughness:.25,transparent:true,opacity:.94}));
  mesh.castShadow=false; islandWorld.add(mesh); return mesh;
}
river([[-5,-27],[-3,-20],[-7,-13],[-5,-7],[-10,-1],[-9,6],[-5,13],[0,19],[4,26]],.62);
river([[18,-20],[15,-15],[17,-10],[14,-7],[10,-3],[7,3]],.42);

// Waterfall sheets on the northern highlands.
function waterfall(x,z,width,drop,rotation=0) {
  const g=new THREE.PlaneGeometry(width,drop,8,24);
  const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:'#a8d8d2',transparent:true,opacity:.72,roughness:.18,side:THREE.DoubleSide,emissive:'#4d8f8b',emissiveIntensity:.18}));
  m.position.set(x,heightAt(x,z)-drop*.48,z); m.rotation.y=rotation; islandWorld.add(m);
  const pool=new THREE.Mesh(new THREE.CircleGeometry(width*1.6,32),waterMat);
  pool.rotation.x=-Math.PI/2; pool.position.set(x,m.position.y-drop*.52+.1,z+.7); pool.scale.y=.55; islandWorld.add(pool);
}
waterfall(-8,-17,2.4,8,-.2);
waterfall(14,-13,1.8,5,.35);

// Rock outcrops and mountain boulders.
for(let i=0;i<170;i++) {
  const a=rand()*Math.PI*2, r=10+rand()*29, x=Math.cos(a)*r,z=Math.sin(a)*r;
  if(!insideIsland(x,z,1)) continue;
  const y=heightAt(x,z), size=.28+rand()*(y>6?1.5:.75);
  const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(size,0),rockMats[Math.floor(rand()*rockMats.length)]);
  rock.position.set(x,y+size*.25,z); rock.rotation.set(rand()*1.4,rand()*6,rand()*1.4);
  rock.scale.set(.8+rand()*.8,.65+rand()*.9,.8+rand()*.8); rock.castShadow=true; rock.receiveShadow=true; islandWorld.add(rock);
}

// Forest: instanced trunks and multi-layer canopies for good browser performance.
const trunkGeo=new THREE.CylinderGeometry(.16,.25,2.0,6);
const crownGeo=new THREE.IcosahedronGeometry(1.15,1);
const trunkInstances=new THREE.InstancedMesh(trunkGeo,trunkMat,330);
const crownInstances=leafMats.map(m=>new THREE.InstancedMesh(crownGeo,m,330));
trunkInstances.castShadow=true; trunkInstances.receiveShadow=true;
crownInstances.forEach(m=>{m.castShadow=true;m.receiveShadow=true;});
const dummy=new THREE.Object3D();
const counts=[0,0,0,0];
let treeCount=0;
for(let i=0;i<330;i++) {
  const a=rand()*Math.PI*2, r=Math.sqrt(rand())*37, x=Math.cos(a)*r,z=Math.sin(a)*r;
  if(!insideIsland(x,z,4)) continue;
  // Keep some broad clearings for paths, lakes and future player-built refuges.
  const clearing1=Math.hypot(x+10,z-8)<7;
  const clearing2=Math.hypot(x-14,z+7)<6;
  const clearing3=Math.hypot(x-2,z-24)<5;
  if(clearing1||clearing2||clearing3) continue;
  const y=heightAt(x,z), scale=1.12+rand()*.98, crownIndex=Math.floor(rand()*leafMats.length);
  dummy.position.set(x,y+1.15*scale,z); dummy.rotation.set((rand()-.5)*.12,rand()*6.28,(rand()-.5)*.12); dummy.scale.set(scale,scale*(1.1+rand()*.35),scale); dummy.updateMatrix();
  trunkInstances.setMatrixAt(treeCount,dummy.matrix);
  dummy.position.y=y+2.55*scale; dummy.scale.set(scale*(1.35+rand()*.25),scale*(1.55+rand()*.35),scale*(1.35+rand()*.25)); dummy.updateMatrix();
  crownInstances[crownIndex].setMatrixAt(counts[crownIndex]++,dummy.matrix);
  treeCount++;
}
trunkInstances.count=treeCount; islandWorld.add(trunkInstances);
crownInstances.forEach((m,i)=>{m.count=counts[i];islandWorld.add(m);});

// Flowers and low shrubs in the meadow region.
const flowerGeo=new THREE.IcosahedronGeometry(.13,0);
const flowerInstances=flowerMats.map(m=>new THREE.InstancedMesh(flowerGeo,m,240));
const flowerCounts=[0,0,0,0];
for(let i=0;i<240;i++) {
  const x=-25+rand()*18,z=-9+rand()*25;
  if(!insideIsland(x,z,3)) continue;
  const d=new THREE.Object3D(); d.position.set(x,heightAt(x,z)+.22,z); d.scale.set(.8+rand(),.65+rand(),.8+rand()); d.rotation.y=rand()*6.28; d.updateMatrix();
  const k=Math.floor(rand()*4); flowerInstances[k].setMatrixAt(flowerCounts[k]++,d.matrix);
}
flowerInstances.forEach((m,i)=>{m.count=flowerCounts[i];islandWorld.add(m);});

// Natural footpaths, following the terrain contours.
function trail(points,width=.24) {
  const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,heightAt(x,z)+.09,z)));
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,150,width,7,false),mat('#bca77e'));
  mesh.receiveShadow=true; islandWorld.add(mesh);
}
trail([[-34,7],[-25,3],[-17,-1],[-8,-4],[0,-8],[10,-12],[24,-16],[34,-12]],.32);
trail([[-8,-4],[-11,5],[-10,14],[-4,23],[4,30]],.24);
trail([[0,-8],[8,-3],[13,5],[20,10],[29,12]],.2);

// Cave entrance at the foot of the northern ridge.
const caveGroup=new THREE.Group(); caveGroup.position.set(-18,heightAt(-18,-18),-18); caveGroup.rotation.y=.45; islandWorld.add(caveGroup);
const caveDark=new THREE.Mesh(new THREE.CircleGeometry(1.55,32),new THREE.MeshBasicMaterial({color:'#17231d'}));
caveDark.position.set(0,1.65,.05); caveDark.scale.set(1,1.12,1); caveGroup.add(caveDark);
const arch=new THREE.Mesh(new THREE.TorusGeometry(1.55,.38,8,32,Math.PI),rockMats[1]);
arch.position.set(0,1.65,0); arch.rotation.z=Math.PI; arch.castShadow=true; caveGroup.add(arch);

// Open natural clearings prepared for future treehouses and cabins.
function clearing(x,z,radius) {
  const ring=new THREE.Mesh(new THREE.RingGeometry(radius-.16,radius,64),new THREE.MeshStandardMaterial({color:'#c7b78c',roughness:1,transparent:true,opacity:.7,side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2; ring.position.set(x,heightAt(x,z)+.12,z); islandWorld.add(ring);
}
clearing(-10,8,4.2);
clearing(14,-7,3.6);
clearing(2,24,3.4);

// Camera controls: independent orbital camera for Verdant Island.
let angle=Math.PI*.24, elevation=.68, distance=648, targetDistance=648;
const focus=new THREE.Vector3(0,12,0);
const ISLAND_FIT_RADIUS = 280;
const MAX_CAMERA_DISTANCE = 1200;
let initialCameraFit = false;

function getIslandFitDistance() {
  const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
  const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * camera.aspect);
  const limitingHalfFov = Math.min(verticalHalfFov, horizontalHalfFov);
  return Math.ceil((ISLAND_FIT_RADIUS / Math.sin(limitingHalfFov)) * 1.12);
}
const pointers=new Map();
let previous={x:0,y:0}, pinch=0, dragging=false;
function updateCamera() {
  const horizontal=Math.cos(elevation)*distance;
  camera.position.set(focus.x+Math.sin(angle)*horizontal,focus.y+Math.sin(elevation)*distance,focus.z+Math.cos(angle)*horizontal);
  camera.lookAt(focus);
}
function resize() {
  const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
  camera.aspect=w/h;
  // Em telas verticais, abre o campo de visão para manter a ilha grande visível.
  camera.fov = camera.aspect < 1 ? Math.min(96, 43 / camera.aspect) : 43;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, (camera.aspect < 1 || touch) ? 1.35 : 1.8));
  renderer.setSize(w,h,false);

  // Na primeira abertura, calcula o afastamento necessário para enquadrar
  // a ilha inteira, tanto em telas verticais quanto horizontais.
  if (!initialCameraFit) {
    distance = getIslandFitDistance();
    targetDistance = distance;
    initialCameraFit = true;
  }
}
function pinchDistance() {
  const p=[...pointers.values()]; if(p.length<2)return 0;
  return Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
}
renderer.domElement.addEventListener('pointerdown',e=>{
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); renderer.domElement.setPointerCapture(e.pointerId);
  if(pointers.size===1){dragging=true;previous={x:e.clientX,y:e.clientY};}
  if(pointers.size===2){dragging=false;pinch=pinchDistance();}
});
renderer.domElement.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId))return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2){const d=pinchDistance();if(pinch)targetDistance=THREE.MathUtils.clamp(targetDistance-(d-pinch)*.72,30,MAX_CAMERA_DISTANCE);pinch=d;return;}
  if(dragging){angle-=(e.clientX-previous.x)*.005;elevation=THREE.MathUtils.clamp(elevation+(e.clientY-previous.y)*.003,.12,1.15);previous={x:e.clientX,y:e.clientY};}
});
function endPointer(e){pointers.delete(e.pointerId);if(pointers.size<2)pinch=0;dragging=pointers.size===1;if(dragging)previous=[...pointers.values()][0];}
renderer.domElement.addEventListener('pointerup',endPointer);
renderer.domElement.addEventListener('pointercancel',endPointer);
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();targetDistance=THREE.MathUtils.clamp(targetDistance+e.deltaY*.27,30,MAX_CAMERA_DISTANCE);},{passive:false});
renderer.domElement.addEventListener('keydown',e=>{
  if(e.key==='+'||e.key==='=')targetDistance=Math.max(30,targetDistance-24);
  if(e.key==='-')targetDistance=Math.min(MAX_CAMERA_DISTANCE,targetDistance+24);
  if(e.key==='ArrowLeft')angle-=.08;
  if(e.key==='ArrowRight')angle+=.08;
});
renderer.domElement.tabIndex=0;
renderer.domElement.setAttribute('aria-label','Verdant Island 3D. Arraste para explorar, use dois dedos ou a roda para aproximar.');
new ResizeObserver(resize).observe(host); resize(); updateCamera();

const clock=new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const dt=clock.getDelta(),t=clock.elapsedTime;
  distance=THREE.MathUtils.lerp(distance,targetDistance,1-Math.exp(-6*dt));
  updateCamera();
  ocean.position.y=SEA+Math.sin(t*.65)*.025;
  waterMat.color.setHSL(.49+Math.sin(t*.18)*.008,.31,.53);
  renderer.render(scene,camera);
}
animate();
const loading=host.querySelector('.verdant-loading'); if(loading) loading.remove();
window.lumenVerdantIsland={scene,camera,renderer,terrain:land,treeCount,regions:['Emerald Forest','Highland Peaks','Crystal Waters','Blooming Fields','Wild Cliffs','Silent Shores']};
window.lumenVerdantIslandReady=true;
console.log('Lumen Society — Verdant Island 1.0 carregada.',{treeCount});