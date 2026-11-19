import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
// LUMEN SOCIETY — ENTERTAINMENT ISLAND 1.0
// Ilha independente: parque de diversões, festival, arcade e orla de lazer.
const host=document.getElementById('entertainment-canvas');
if(!host)throw new Error('Elemento #entertainment-canvas não encontrado.');
const scene=new THREE.Scene();
scene.background=new THREE.Color('#c7d9d4');
scene.fog=new THREE.FogExp2('#c7d9d4',.00042);
const touch=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;
const camera=new THREE.PerspectiveCamera(43,1,.1,3000);
const renderer=new THREE.WebGLRenderer({antialias:!touch,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,touch?1.05:1.5));
renderer.shadowMap.enabled=!touch;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.12;
host.innerHTML='';host.appendChild(renderer.domElement);
Object.assign(renderer.domElement.style,{width:'100%',height:'100%',display:'block',touchAction:'none'});
scene.add(new THREE.HemisphereLight('#f4f6e9','#63766c',2));
const sun=new THREE.DirectionalLight('#fff0d7',2.6);
sun.position.set(-70,115,65);sun.castShadow=true;
sun.shadow.mapSize.set(touch?512:1536,touch?512:1536);
sun.shadow.camera.left=-640;sun.shadow.camera.right=640;sun.shadow.camera.top=640;sun.shadow.camera.bottom=-640;
sun.shadow.bias=-.00025;scene.add(sun);
const islandWorld=new THREE.Group();islandWorld.scale.setScalar(11);scene.add(islandWorld);
const mat=(c,r=1,e={})=>new THREE.MeshStandardMaterial({color:c,roughness:r,flatShading:true,...e});
const grassMat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1});
const waterMat=new THREE.MeshStandardMaterial({color:'#69afb0',roughness:.27,metalness:.04,transparent:true,opacity:.95});
const grassA=mat('#789b78'),grassB=mat('#91a97e'),sandMat=mat('#dfcba4'),pathMat=mat('#d9cbb2');
const wood=mat('#896448'),darkWood=mat('#624b3d'),cream=mat('#f1e7d2'),coral=mat('#d98268');
const teal=mat('#5f9992'),gold=mat('#e4b76d'),blue=mat('#7b9fba'),pink=mat('#d69b9e');
let seed=83917;function rand(){seed=seed*16807%2147483647;return(seed-1)/2147483646;}
function smooth(a,b,x){const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);}
const SEA=-1.15,R=43;
function edge(a){return R*(.95+Math.sin(a*3+.45)*.032+Math.sin(a*5+1.1)*.02+Math.cos(a*2-.7)*.022);}
function heightAt(x,z){return .18+Math.exp(-((x+7)**2+(z+15)**2)/310)*2.2+Math.exp(-((x-23)**2+(z-9)**2)/250)*1.25+Math.exp(-((x+26)**2+(z-17)**2)/190)*.9+Math.sin(x*.17+z*.12)*.22+Math.cos(z*.19-x*.08)*.18;}
function surface(x,z){return heightAt(x,z)+smooth(30,43,Math.hypot(x,z))*.45;}
const ocean=new THREE.Mesh(new THREE.PlaneGeometry(650,650),waterMat);ocean.rotation.x=-Math.PI/2;ocean.position.y=SEA;ocean.receiveShadow=true;islandWorld.add(ocean);
// Radial terrain with a softly rolling parkland profile.
const SEG=192,RINGS=56,pos=[0,heightAt(0,0),0],idx=[],colors=[];
for(let ring=1;ring<=RINGS;ring++){const f=ring/RINGS;for(let i=0;i<SEG;i++){const a=i/SEG*Math.PI*2,r=edge(a)*f,x=Math.cos(a)*r,z=Math.sin(a)*r;pos.push(x,surface(x,z),z);}}
for(let i=0;i<SEG;i++)idx.push(0,1+(i+1)%SEG,1+i);
for(let l=0;l<RINGS-1;l++){const a0=1+l*SEG,b0=a0+SEG;for(let i=0;i<SEG;i++){const n=(i+1)%SEG,a=a0+i,b=a0+n,c=b0+i,d=b0+n;idx.push(a,b,c,b,d,c);}}
const c1=new THREE.Color('#739779'),c2=new THREE.Color('#9db487'),c3=new THREE.Color('#b7b08c');
for(let i=0;i<pos.length;i+=3){const x=pos[i],z=pos[i+2],n=(Math.sin(x*.13+z*.09)+Math.cos(z*.16-x*.07))*.5,c=c1.clone().lerp(c2,smooth(-.2,.8,n)*.58);if(Math.hypot(x,z)>34)c.lerp(c3,.45);colors.push(c.r,c.g,c.b);}
const terrainGeo=new THREE.BufferGeometry();terrainGeo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));terrainGeo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));terrainGeo.setIndex(idx);terrainGeo.computeVertexNormals();
const terrain=new THREE.Mesh(terrainGeo,grassMat);terrain.receiveShadow=true;terrain.castShadow=true;islandWorld.add(terrain);
// Continuous sandy shoreline.
const sandPos=[],sandIdx=[],layers=[1,1.025,1.055,1.085];
for(let l=0;l<layers.length;l++)for(let i=0;i<SEG;i++){const a=i/SEG*Math.PI*2,r=edge(a)*layers[l],x=Math.cos(a)*r,z=Math.sin(a)*r,ix=Math.cos(a)*edge(a),iz=Math.sin(a)*edge(a),y=THREE.MathUtils.lerp(surface(ix,iz)-.04,SEA-.48,l/(layers.length-1));sandPos.push(x,y,z);}
for(let l=0;l<layers.length-1;l++)for(let i=0;i<SEG;i++){const n=(i+1)%SEG,a=l*SEG+i,b=l*SEG+n,c=(l+1)*SEG+i,d=(l+1)*SEG+n;sandIdx.push(a,b,c,b,d,c);}
const sandGeo=new THREE.BufferGeometry();sandGeo.setAttribute('position',new THREE.Float32BufferAttribute(sandPos,3));sandGeo.setIndex(sandIdx);sandGeo.computeVertexNormals();
islandWorld.add(new THREE.Mesh(sandGeo,new THREE.MeshStandardMaterial({color:'#dfcba4',roughness:1,side:THREE.DoubleSide})));
function add(mesh,parent=islandWorld){mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function box(w,h,d,m,x,y,z,parent=islandWorld){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return add(o,parent);}
function cylinder(rt,rb,h,m,x,y,z,parent=islandWorld,segments=12){const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),m);o.position.set(x,y,z);return add(o,parent);}
function sphere(r,m,x,y,z,parent=islandWorld){const o=new THREE.Mesh(new THREE.SphereGeometry(r,16,12),m);o.position.set(x,y,z);return add(o,parent);}
function beamBetween(parent,a,b,radius,material,segments=10){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,delta.length(),segments),material);mesh.position.copy(start).add(end).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return add(mesh,parent);}
function path(points,width=2.3){const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,0,z))),samples=curve.getPoints(180),v=[],ind=[];for(let i=0;i<samples.length;i++){const p=samples[i],t=curve.getTangent(i/(samples.length-1)),len=Math.hypot(t.x,t.z)||1,nx=-t.z/len,nz=t.x/len;for(const side of [-1,1]){const x=p.x+nx*side*width/2,z=p.z+nz*side*width/2;v.push(x,surface(x,z)+.06,z);}if(i<samples.length-1){const k=i*2;ind.push(k,k+1,k+2,k+1,k+3,k+2);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(ind);g.computeVertexNormals();const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:pathMat.color,roughness:1,side:THREE.DoubleSide}));mesh.receiveShadow=true;islandWorld.add(mesh);}
function platform(x,z,w,d,m=cream){const o=new THREE.Mesh(new THREE.BoxGeometry(w,.2,d),m);o.position.set(x,surface(x,z)+.1,z);return add(o);}
function tree(x,z,s=1,palm=false){const g=new THREE.Group();g.position.set(x,surface(x,z),z);g.scale.setScalar(s);cylinder(.18,.28,2.5,wood,0,1.25,0,g);if(palm){for(let i=0;i<7;i++){const a=i/7*Math.PI*2,leaf=new THREE.Mesh(new THREE.ConeGeometry(.24,2.7,6),grassA);leaf.position.set(Math.cos(a)*.85,2.55+Math.sin(i*2)*.15,Math.sin(a)*.85);leaf.rotation.z=-Math.cos(a)*.9;leaf.rotation.x=Math.sin(a)*.9;add(leaf,g);}}else{for(let i=0;i<3;i++){const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.15-i*.1,1),[grassA,grassB,mat('#a5b889')][i]);crown.position.set((rand()-.5)*.3,2.4+i*.42,(rand()-.5)*.3);add(crown,g);}}islandWorld.add(g);}
// Coherent pedestrian circulation: an entrance spine, central plaza and clear branches to every attraction.
path([[0,-38],[0,-31],[0,-23],[0,-16],[0,-10],[0,-6]],3.2);
path([[-5,-1],[-10,-3],[-14,-6],[-14,-11]],2.5);
path([[-4,4],[-9,9],[-14,14],[-19,21],[-23,25]],2.4);
path([[-3,7],[-5,13],[-7,18],[-8,21]],2.8);
path([[5,3],[11,5],[17,8],[22,11]],2.4);
path([[3,7],[4,14],[4,22],[2,29],[0,33]],2.5);
path([[0,-8],[1,-16],[7,-22],[17,-23],[27,-18],[30,-10],[30,-2],[28,6]],2.2);
// PARK ENTRANCE — a clear, welcoming threshold aligned with the main approach path.
const parkGate = new THREE.Group();
parkGate.position.set(0, surface(0, -34), -34);
islandWorld.add(parkGate);
for (const x of [-2.8, 2.8]) {
  box(0.62, 4.7, 0.72, cream, x, 2.35, 0, parkGate);
  box(0.9, 0.32, 0.96, gold, x, 4.62, 0, parkGate);
  box(0.78, 0.5, 0.82, coral, x, 3.65, 0, parkGate);
}
box(6.6, 0.62, 0.82, teal, 0, 4.72, 0, parkGate);
box(6.85, 0.13, 0.96, gold, 0, 5.1, 0, parkGate);
const gateCanvas = document.createElement('canvas');
gateCanvas.width = 512;
gateCanvas.height = 128;
const gateContext = gateCanvas.getContext('2d');
gateContext.clearRect(0, 0, 512, 128);
gateContext.fillStyle = '#fff5df';
gateContext.font = '800 64px sans-serif';
gateContext.textAlign = 'center';
gateContext.textBaseline = 'middle';
gateContext.fillText('LUMEN PARK', 256, 66);
const gateTexture = new THREE.CanvasTexture(gateCanvas);
gateTexture.colorSpace = THREE.SRGBColorSpace;
const gateLabel = new THREE.Sprite(new THREE.SpriteMaterial({
  map: gateTexture, transparent: true, depthWrite: false
}));
gateLabel.scale.set(4.6, 1.15, 1);
gateLabel.position.set(0, 4.72, 0.48);
parkGate.add(gateLabel);
for (let i = 0; i < 7; i++) {
  sphere(0.12, i % 2 ? cream : gold, -2.4 + i * 0.8, 5.16, 0.48, parkGate);
}

// Rest areas face the central stage while staying clear of the main walking loop.
function parkBench(x, z, rotation = 0) {
  const bench = new THREE.Group();
  bench.position.set(x, surface(x, z) + 0.04, z);
  bench.rotation.y = rotation;
  islandWorld.add(bench);
  box(2.0, 0.16, 0.58, wood, 0, 0.62, 0, bench);
  box(2.0, 0.72, 0.14, darkWood, 0, 1.0, -0.22, bench);
  for (const sx of [-0.76, 0.76]) {
    box(0.14, 0.62, 0.18, gold, sx, 0.31, 0, bench);
  }
}
parkBench(-11, -1, Math.PI / 2);
parkBench(11, -1, -Math.PI / 2);
parkBench(-1, 13, 0);

// Central festival square with a small circular stage.
platform(0,2,16,13,mat('#d9d0bd'));
const plazaRing=new THREE.Mesh(new THREE.RingGeometry(3.4,4.15,48),gold);plazaRing.rotation.x=-Math.PI/2;plazaRing.position.set(0,surface(0,2)+.23,2);add(plazaRing);
cylinder(3.35,3.35,.34,coral,0,surface(0,2)+.31,2,islandWorld,48);
cylinder(2.65,2.65,.12,cream,0,surface(0,2)+.55,2,islandWorld,48);
for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const lamp=sphere(.18,gold,Math.cos(a)*3.7,surface(0,2)+.55,2+Math.sin(a)*3.7);}
// Ferris wheel: reinforced A-frame supports, steel spokes and enclosed passenger cabins.
const ferris=new THREE.Group();ferris.position.set(-22,surface(-22,-11),-11);islandWorld.add(ferris);
const wheelCenter=new THREE.Vector3(0,10.2,0),wheelRadius=7.6;
const wheelRing=new THREE.Mesh(new THREE.TorusGeometry(wheelRadius,.24,12,72),coral);wheelRing.position.copy(wheelCenter);add(wheelRing,ferris);
const innerRing=new THREE.Mesh(new THREE.TorusGeometry(wheelRadius*.78,.13,10,56),gold);innerRing.position.copy(wheelCenter);add(innerRing,ferris);
for(let i=0;i<12;i++){const a=i/12*Math.PI*2,dir=new THREE.Vector3(Math.cos(a),Math.sin(a),0),spoke=new THREE.Mesh(new THREE.CylinderGeometry(.065,.085,wheelRadius,10),cream);spoke.position.copy(wheelCenter).addScaledVector(dir,wheelRadius/2);spoke.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);add(spoke,ferris);}
// The two A-frames straddle the wheel and meet at the axle, rather than leaning in the same direction.
for(const z of [-1.45,1.45]){
  beamBetween(ferris,[-4.9,.32,z],[0,10.2,z],.27,cream,12);
  beamBetween(ferris,[4.9,.32,z],[0,10.2,z],.27,cream,12);
  beamBetween(ferris,[-2.45,5.35,z],[2.45,5.35,z],.13,gold,10);
  beamBetween(ferris,[-4.9,.32,z],[4.9,.32,z],.16,darkWood,10);
}
for(const x of [-4.9,4.9])for(const z of [-1.45,1.45])box(.72,.28,.72,gold,x,.2,z,ferris);
sphere(.72,gold,0,10.2,0,ferris);
// Each cabin has a floor, roof, corner posts, railings and glazed windows.
const cabinColors=[coral,teal,gold,pink,blue,cream];
for(let i=0;i<12;i++){
  const a=i/12*Math.PI*2,x=Math.cos(a)*wheelRadius,pointY=10.2+Math.sin(a)*wheelRadius;
  const cabin=new THREE.Group();cabin.position.set(x,pointY-1.38,0);ferris.add(cabin);
  const color=cabinColors[i%cabinColors.length],glass=new THREE.MeshStandardMaterial({color:'#b9d9d5',roughness:.22,metalness:.08,transparent:true,opacity:.78});
  box(1.42,.16,1.18,darkWood,0,-.48,0,cabin);
  box(1.38,.12,1.14,color,0,.52,0,cabin);
  for(const cx of [-.62,.62])for(const cz of [-.48,.48])box(.1,.96,.1,cream,cx,0,cz,cabin);
  box(1.12,.62,.045,glass,0,.12,.565,cabin);
  box(1.12,.62,.045,glass,0,.12,-.565,cabin);
  for(const cx of [-.69,.69])box(.045,.62,.92,glass,cx,.12,0,cabin);
  box(1.5,.12,1.25,color,0,.62,0,cabin);
  box(.92,.08,.08,gold,0,-.12,.61,cabin);
  // Twin suspension arms keep each cabin hanging beneath its wheel rim.
  beamBetween(ferris,[x,pointY-.05,-.34],[x,pointY-.72,-.34],.055,gold,8);
  beamBetween(ferris,[x,pointY-.05,.34],[x,pointY-.72,.34],.055,gold,8);
}
box(11,.42,3.8,darkWood,0,.28,0,ferris);
// Roller coaster: raised twin rails, cross-ties and terrain-aware support columns.
const coaster=new THREE.Group();coaster.position.set(13,surface(13,-8),-8);islandWorld.add(coaster);
const coasterPoints=[[-10,5.2,5],[-8,9.5,0],[-5,14.2,-4],[-1,10.2,-7],[3,7.1,-5],[6,11.2,-1],[9,15.0,4],[12,8.5,8],[10,6.2,11],[4,6.8,12],[-2,10.0,10],[-8,6.5,8]].map(p=>new THREE.Vector3(...p));
const coasterCurve=new THREE.CatmullRomCurve3(coasterPoints,true,'catmullrom',.35);
const railGeometry=curve=>new THREE.TubeGeometry(curve,260,.19,10,true);
function offsetRail(side){
  const points=[];
  for(let i=0;i<=120;i++){
    const t=i/120,p=coasterCurve.getPointAt(t),tangent=coasterCurve.getTangentAt(t);
    const len=Math.hypot(tangent.x,tangent.z)||1;
    const nx=-tangent.z/len,nz=tangent.x/len;
    points.push(new THREE.Vector3(p.x+nx*side*.48,p.y,p.z+nz*side*.48));
  }
  return new THREE.CatmullRomCurve3(points,true,'catmullrom',.35);
}
const leftRail=offsetRail(-1),rightRail=offsetRail(1);
add(new THREE.Mesh(railGeometry(leftRail),coral),coaster);
add(new THREE.Mesh(railGeometry(rightRail),coral),coaster);
// Cross-ties span the true perpendicular distance between the two rails.
for(let i=0;i<96;i++){
  const t=i/96,p=coasterCurve.getPointAt(t),tangent=coasterCurve.getTangentAt(t);
  const len=Math.hypot(tangent.x,tangent.z)||1,nx=-tangent.z/len,nz=tangent.x/len;
  beamBetween(coaster,
    [p.x-nx*.48,p.y,p.z-nz*.48],
    [p.x+nx*.48,p.y,p.z+nz*.48],
    .085,darkWood,8
  );
}
// Every support reaches the actual local ground and meets the underside of the track.
for(let i=0;i<48;i++){
  const t=i/48,p=coasterCurve.getPoint(t),ground=surface(13+p.x,-8+p.z)-coaster.position.y+.12,top=p.y-.38;
  if(top>ground+.35){const h=top-ground;cylinder(.13,.18,h,cream,p.x,ground+h/2,p.z,coaster,10);}
}
// Diagonal braces stabilize the taller sections of the coaster.
for(const x of [-7,7]){beamBetween(coaster,[x,2.4,-1],[x,10,2],.1,gold,8);beamBetween(coaster,[x,2.4,8],[x,8,5],.1,gold,8);}
// COASTER TRAIN — three connected cars follow the full elevated track loop.
const coasterCars = [];
const carColors = [coral, gold, teal];
for (let i = 0; i < 3; i++) {
  const car = new THREE.Group();
  box(1.12, 0.38, 0.92, carColors[i], 0, 0, 0, car);
  box(0.9, 0.13, 0.78, darkWood, 0, 0.25, 0, car);
  for (const x of [-0.31, 0.31]) {
    box(0.12, 0.3, 0.12, cream, x, 0.43, -0.22, car);
    box(0.12, 0.3, 0.12, cream, x, 0.43, 0.22, car);
  }
  for (const x of [-0.46, 0.46]) {
    for (const z of [-0.48, 0.48]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.16, 0.16, 0.13, 10),
        darkWood
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, -0.19, z);
      add(wheel, car);
    }
  }
  add(car, coaster);
  coasterCars.push(car);
}

// Carousel pavilion with ten sculpted carousel animals, poles and a striped canopy.
const carousel=new THREE.Group();carousel.position.set(22,surface(22,18),18);islandWorld.add(carousel);
cylinder(5.2,5.2,.35,cream,0,.25,0,carousel,40);
const animalMaterials=[cream,coral,teal,gold,blue,pink];
function carouselAnimal(parent,index){
  const animal=new THREE.Group();parent.add(animal);
  const coat=animalMaterials[index%animalMaterials.length],mane=index%2?darkWood:gold;
  const body=sphere(index===2?.52:.43,coat,0,0,0,animal);body.scale.set(1.35,index===7?.48:.72,.78);
  const legMat=index===2?teal:coat;
  for(let j=0;j<4;j++){
    const z=j<2?-.25:.25,x=j%2?-.25:.29;
    const radius=index===2?.12:.075;
    beamBetween(animal,[x,-.12,z],[x+.015,-.67,z],radius,legMat,8);
    if(index===2)sphere(.13,legMat,x+.015,-.63,z,animal);
  }
  // Each mount has its own silhouette and details rather than repeating the same horse.
  if(index===2){ // Elephant
    const head=sphere(.39,coat,-.53,.28,0,animal);head.scale.set(.9,1,.95);
    for(const side of [-1,1]){const ear=sphere(.34,pink,-.52,.35,side*.43,animal);ear.scale.set(.38,1.15,.82);beamBetween(animal,[-.76,.12,side*.18],[-.91,-.27,side*.18],.105,coat,10);beamBetween(animal,[-.7,.16,side*.29],[-.94,.05,side*.29],.045,cream,8);}
    beamBetween(animal,[-.78,.1,0],[-.91,-.42,0],.12,coat,12);sphere(.045,darkWood,-.78,.39,.27,animal);sphere(.045,darkWood,-.78,.39,-.27,animal);
  }else if(index===3){ // Giraffe
    beamBetween(animal,[-.35,.12,0],[-.52,1.12,0],.17,coat,12);
    const head=sphere(.22,coat,-.56,1.18,0,animal);head.scale.set(1.2,.8,.8);
    for(const side of [-1,1]){beamBetween(animal,[-.55,1.3,side*.12],[-.56,1.58,side*.12],.045,wood,7);sphere(.07,wood,-.56,1.58,side*.12,animal);}
    for(let j=0;j<7;j++){const spot=sphere(.09,darkWood,.38-(j%3)*.32,.2+Math.floor(j/3)*.23,(j%2?-.3:.3),animal);spot.scale.set(1,.8,.35);}
  }else if(index===4){ // Lion
    const maneBall=sphere(.48,gold,-.57,.48,0,animal);maneBall.scale.set(.82,1.05,1.05);
    const head=sphere(.29,coat,-.7,.53,0,animal);head.scale.set(1,.9,.9);
    sphere(.13,cream,-.91,.39,0,animal);
    for(let j=0;j<7;j++){const tuft=new THREE.Mesh(new THREE.ConeGeometry(.12,.28,7),gold);const a=j/7*Math.PI*2;tuft.position.set(-.57+Math.cos(a)*.4,.48+Math.sin(a)*.4,0);tuft.rotation.z=-a;add(tuft,animal);}
  }else if(index===5){ // Camel
    for(const x of [-.18,.3]){const hump=sphere(.3,gold,x,.39,0,animal);hump.scale.set(.8,1.2,.85);}
    beamBetween(animal,[-.35,.1,0],[-.55,.76,0],.18,coat,10);
    sphere(.22,coat,-.62,.81,0,animal);sphere(.13,cream,-.78,.7,0,animal);
  }else if(index===6){ // Deer
    beamBetween(animal,[-.34,.12,0],[-.59,.83,0],.14,coat,10);
    sphere(.23,coat,-.64,.9,0,animal);
    for(const side of [-1,1]){
      beamBetween(animal,[-.62,1.02,side*.1],[-.7,1.48,side*.16],.045,gold,7);
      beamBetween(animal,[-.7,1.28,side*.15],[-.91,1.38,side*.2],.035,gold,7);
      beamBetween(animal,[-.7,1.38,side*.16],[-.55,1.55,side*.2],.035,gold,7);
      const ear=sphere(.09,coat,-.48,1.02,side*.27,animal);ear.scale.set(1.6,.45,.6);
    }
    sphere(.12,cream,-.82,.8,0,animal);
  }else if(index===7){ // Swan
    const wing1=sphere(.32,cream,.12,.2,.27,animal);wing1.scale.set(1.1,.35,.55);
    const wing2=sphere(.32,cream,.12,.2,-.27,animal);wing2.scale.set(1.1,.35,.55);
    beamBetween(animal,[-.36,.12,0],[-.52,.72,0],.13,cream,10);
    beamBetween(animal,[-.52,.72,0],[-.72,1.03,0],.11,cream,10);
    sphere(.16,cream,-.72,1.08,0,animal);
    beamBetween(animal,[-.82,1.07,0],[-1.02,1.03,0],.055,coral,7);
    sphere(.035,darkWood,-.76,1.13,.13,animal);
  }else{
    // Horse family: horse, zebra, tiger and unicorn have distinct markings or head ornaments.
    beamBetween(animal,[-.34,.12,0],[-.58,.83,0],.18,coat,12);
    const head=sphere(.25,coat,-.61,.88,0,animal);head.scale.set(1.05,.82,.78);
    const muzzle=sphere(.16,index===1?cream:gold,-.79,.78,0,animal);muzzle.scale.set(1,.7,.8);
    for(const side of [-1,1]){
      const ear=new THREE.Mesh(new THREE.ConeGeometry(.09,.28,8),coat);ear.position.set(-.53,1.12,side*.13);ear.rotation.z=-.2;add(ear,animal);
      sphere(.04,darkWood,-.68,.94,side*.19,animal);
    }
    for(let j=0;j<4;j++){const lock=sphere(.105,mane,-.55+j*.13,.99,0,animal);lock.scale.set(.75,1.3,.8);}
    beamBetween(animal,[.48,.16,0],[.78,.5,0],.07,mane,8);
    if(index===1||index===8){
      const stripeMat=index===1?darkWood:gold;
      for(let j=0;j<5;j++){const stripe=box(.1,.42,.86,stripeMat,.34-j*.22,.08,0,animal);stripe.rotation.z=-.35;}
    }
    if(index===9)beamBetween(animal,[-.62,1.08,0],[-.72,1.52,0],.055,gold,8);
    if(index===0){const saddle=box(.48,.09,.52,coral,.02,.34,0,animal);saddle.rotation.z=-.08;}
  }
  animal.rotation.y=-index/10*Math.PI*2;
  return animal;
}
for(let i=0;i<10;i++){
  const a=i/10*Math.PI*2,x=Math.cos(a)*3.9,z=Math.sin(a)*3.9;
  cylinder(.055,.075,4.2,gold,x,2.35,z,carousel,8);
  const mount=new THREE.Group();mount.position.set(x,1.35,z);carousel.add(mount);carouselAnimal(mount,i);
}
const canopy=new THREE.Mesh(new THREE.ConeGeometry(5.4,2.0,10),coral);canopy.position.y=5.45;add(canopy,carousel);
cylinder(.38,.38,1.2,gold,0,6.15,0,carousel,12);
for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const stripe=box(.12,1.35,.035,cream,Math.cos(a)*2.68,5.55,Math.sin(a)*2.68,carousel);stripe.rotation.y=-a;}
// Arcade pavilion and colorful game-front panels.
const arcade=new THREE.Group();arcade.position.set(-23,surface(-23,17),17);islandWorld.add(arcade);
box(10,4.4,7,cream,0,2.2,0,arcade);box(10.6,.55,7.6,teal,0,4.55,0,arcade);
box(7.5,1.45,.22,darkWood,0,3.55,3.62,arcade);
for(let i=0;i<4;i++){box(1.35,1.8,.18,[coral,gold,blue,pink][i],-3+i*2,1.65,3.62,arcade);box(1.0,.55,.08,mat('#f5e8ca',.45,{emissive:'#f2cb8c',emissiveIntensity:.3}),-3+i*2,2.2,3.76,arcade);}
for(const x of [-4.6,4.6])for(const z of [-3.2,3.2])box(.32,4.5,.32,gold,x,2.25,z,arcade);
// Festival stage, screen and backstage wings.
const stage=new THREE.Group();stage.position.set(-8,surface(-8,27),27);islandWorld.add(stage);
box(13,.65,6,darkWood,0,.45,0,stage);box(12,4.4,.45,teal,0,2.8,-2.7,stage);
box(13,.45,1,coral,0,5.1,-2.7,stage);
for(const x of [-6,6]){cylinder(.2,.25,5.6,gold,x,2.8,-2.7,stage,10);box(1.4,3.6,.7,coral,x,2.2,-1.9,stage);}
box(7,2.1,.25,mat('#263f48',.4,{emissive:'#1b3541',emissiveIntensity:.18}),0,3.1,-2.43,stage);
for(let i=0;i<5;i++){const light=sphere(.22,[gold,pink,blue,teal,cream][i],-4+i*2,5.45,-2.6,stage);}
// Food kiosks and beach-side rest huts.
function kiosk(x,z,accent){const g=new THREE.Group();g.position.set(x,surface(x,z),z);islandWorld.add(g);box(4,2.8,3.1,cream,0,1.4,0,g);box(4.5,.35,3.5,accent,0,2.95,0,g);box(3.2,.15,.2,darkWood,0,1.85,1.62,g);for(const sx of [-1.45,1.45])cylinder(.09,.11,2.7,gold,sx,1.35,1.55,g,8);}
kiosk(-6,-25,coral);kiosk(31,14,teal);kiosk(-31,0,gold);
// Boardwalk and pier reaching into the water.
const pier=new THREE.Group();pier.position.set(0,surface(0,34),34);islandWorld.add(pier);
box(5,.3,13,wood,0,.12,5,pier);box(10,.3,5,wood,0,.12,13,pier);
for(let z=0;z<=14;z+=2)for(const x of [-2.1,2.1])cylinder(.13,.16,2.6,darkWood,x,-.8,z,pier,8);
for(const x of [-4.7,4.7])for(const z of [11,15])cylinder(.13,.16,2.5,darkWood,x,-.8,z,pier,8);
// Palms, shade trees and small landscaped pockets.
// Peripheral trees frame the park without crowding entrances, rides or walking routes.
[[-35,-21],[-34,8],[-30,31],[33,24],[36,-18],[7,-36],[12,33],[28,-27]].forEach(([x,z],i)=>tree(x,z,.72+rand()*.18,i%2===0));
const protectedZones=[
  {x:0,z:-34,r:8},{x:-22,z:-11,r:10},{x:13,z:-8,r:16},
  {x:22,z:18,r:9},{x:-23,z:17,r:9},{x:-8,z:27,r:9},
  {x:0,z:34,r:9},{x:-6,z:-25,r:5},{x:31,z:-13,r:5},{x:-29,z:-20,r:5}
];
for(let i=0;i<16;i++){
  const a=rand()*Math.PI*2,r=27+rand()*9,x=Math.cos(a)*r,z=Math.sin(a)*r;
  if(Math.hypot(x,z)>39||protectedZones.some(zone=>Math.hypot(x-zone.x,z-zone.z)<zone.r))continue;
  tree(x,z,.3+rand()*.18,false);
}
function lamp(x,z){const g=new THREE.Group();g.position.set(x,surface(x,z),z);islandWorld.add(g);cylinder(.07,.1,2.8,darkWood,0,1.4,0,g,8);sphere(.23,gold,0,2.9,0,g);}
[[-28,-7],[-12,-2],[5,5],[25,6],[11,24],[-15,22],[0,31]].forEach(([x,z])=>lamp(x,z));

/* --- LUMEN PARK EXPANSION: themed landmark, new rides, queue systems and guest details --- */
// A fairytale castle gives the upper garden a memorable focal point.
const castle=new THREE.Group();
castle.position.set(0,surface(0,20),20);
islandWorld.add(castle);
box(11,.55,8,cream,0,.28,0,castle);
box(8,5.2,6.2,mat('#e8d8bd'),0,3.0,0,castle);
box(3.2,7.2,3.2,coral,0,4.0,-.25,castle);
box(7.6,3.7,2.1,cream,0,2.0,3.85,castle);
box(2.4,3.5,.22,teal,0,2.1,4.94,castle);
for(const x of [-3.2,3.2]){
  box(2.2,4.5,2.2,cream,x,2.65,-1.4,castle);
  const turret=new THREE.Mesh(new THREE.ConeGeometry(1.55,2.5,8),[blue,coral][x>0?0:1]);
  turret.position.set(x,6.1,-1.4);add(turret,castle);
  box(.55,1.2,.18,blue,x,3.4,4.92,castle);
}
for(const x of [-2.2,0,2.2]){
  const window=new THREE.Mesh(new THREE.CircleGeometry(.48,16),blue);
  window.position.set(x,3.5,4.99);add(window,castle);
  box(.12,1.05,.08,gold,x,3.5,5.02,castle);
  box(.9,.1,.08,gold,x,3.5,5.02,castle);
}
const castleRoof=new THREE.Mesh(new THREE.ConeGeometry(2.15,2.7,8),gold);
castleRoof.position.set(0,8.7,-.25);add(castleRoof,castle);
for(const x of [-3.2,3.2]){const flag=new THREE.Group();flag.position.set(x,7.55,-1.4);castle.add(flag);cylinder(.045,.045,2.2,gold,0,1.1,0,flag,7);const cloth=box(.72,.42,.05,coral,.34,1.72,0,flag);cloth.rotation.z=-.08;}
box(1.5,2.35,.16,darkWood,0,1.45,5.08,castle);
const castleArch=new THREE.Mesh(new THREE.TorusGeometry(.8,.12,8,20,Math.PI),gold);
castleArch.position.set(0,2.62,5.12);add(castleArch,castle);
for(const x of [-5.8,5.8]){cylinder(.12,.18,1.8,wood,x,.9,0,castle,8);sphere(.28,gold,x,1.95,0,castle);}

// Pirate ship ride with A-frame, suspended hull and animated pendulum.
const pirateRide=new THREE.Group();
pirateRide.position.set(28,surface(28,-27),-27);
islandWorld.add(pirateRide);
platform(0,0,13,10,mat('#d4c4a6'));
for(const x of [-4.6,4.6])beamBetween(pirateRide,[x,.3,0],[0,9.4,0],.32,cream,12);
beamBetween(pirateRide,[-4.6,.3,0],[4.6,.3,0],.24,darkWood,10);
beamBetween(pirateRide,[0,9.4,-.35],[0,9.4,.35],.28,gold,10);
const piratePivot=new THREE.Group();piratePivot.position.set(0,8.7,0);pirateRide.add(piratePivot);
const pirateHull=new THREE.Group();pirateHull.position.y=-5.2;piratePivot.add(pirateHull);
const hull=new THREE.Mesh(new THREE.CylinderGeometry(1.15,2.5,8.6,8,1,false),coral);hull.rotation.z=Math.PI/2;hull.scale.set(1,.55,1.1);hull.position.y=-.25;add(hull,pirateHull);
box(7.8,.32,2.7,wood,0,.15,0,pirateHull);
for(let i=0;i<9;i++){const x=-3.5+i*.875;box(.12,1.0,.12,gold,x,.7,-1.18,pirateHull);box(.12,1.0,.12,gold,x,.7,1.18,pirateHull);}
for(const x of [-3.6,3.6]){box(.42,2.0,.42,darkWood,x,.95,0,pirateHull);const sail=box(.08,2.2,1.7,cream,x,2.05,0,pirateHull);sail.rotation.z=x>0?.1:-.1;}
const pirateMast=box(.18,3.4,.18,darkWood,0,2.1,0,pirateHull);
const pirateFlag=box(.95,.48,.08,coral,.5,3.65,0,pirateHull);
for(const x of [-2.7,2.7])sphere(.17,gold,x,.62,1.25,pirateHull);

// Ticket booths at the entry plaza, plus clear signs that read at close range.
function ticketBooth(x,z,accent){
  const g=new THREE.Group();g.position.set(x,surface(x,z),z);islandWorld.add(g);
  box(2.5,2.45,2.0,cream,0,1.22,0,g);
  box(2.8,.28,2.25,accent,0,2.58,0,g);
  box(1.55,.72,.12,blue,0,1.75,1.04,g);
  box(1.8,.16,.22,gold,0,1.22,1.12,g);
  box(.1,.95,.1,wood,-.9,.48,.78,g);box(.1,.95,.1,wood,.9,.48,.78,g);
}
ticketBooth(-5.4,-33,coral);ticketBooth(5.4,-33,teal);

// Queue rails define orderly approach lanes without fencing off the attractions.
function queueLane(cx,cz,w,d,railMaterial=gold){
  const y=surface(cx,cz)+.2;
  for(const side of [-1,1]){
    const x=cx+side*w/2;
    for(let z=-d/2;z<=d/2+.01;z+=1.7)cylinder(.055,.075,1.0,cream,x,y+.5,cz+z,islandWorld,7);
    beamBetween(islandWorld,[x,y+.85,cz-d/2],[x,y+.85,cz+d/2],.055,railMaterial,7);
  }
  for(let z=-d/2;z<=d/2+.01;z+=1.7)beamBetween(islandWorld,[cx-w/2,y+.5,cz+z],[cx+w/2,y+.5,cz+z],.045,railMaterial,7);
}
queueLane(-22,-11,6.4,5.4,coral);
queueLane(22,18,7.2,5.4,teal);
queueLane(28,-27,7.8,4.2,gold);
queueLane(-23,17,7.6,4.2,blue);

// Small garden islands, flower beds and guest amenities make the walkways feel inhabited.
function flowerBed(x,z,rx=1.3,rz=.8){
  const y=surface(x,z)+.12;
  const bed=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.22,12),wood);
  bed.scale.set(rx,.55,rz);bed.position.set(x,y,z);add(bed);
  for(let i=0;i<9;i++){
    const a=i/9*Math.PI*2,r=.68;
    const px=x+Math.cos(a)*rx*r,pz=z+Math.sin(a)*rz*r;
    cylinder(.035,.045,.42,grassA,px,surface(px,pz)+.32,pz,islandWorld,5);
    sphere(.16,[pink,gold,cream,coral][i%4],px,surface(px,pz)+.57,pz);
  }
}
[[-7,-7],[8,-7],[-13,5],[14,5],[-13,25],[13,27],[-30,7],[31,5],[7,-30]].forEach(([x,z])=>flowerBed(x,z,1.35,.85));
function trashBin(x,z){
  const y=surface(x,z);
  cylinder(.34,.4,.8,teal,x,y+.4,z,islandWorld,10);
  cylinder(.37,.37,.12,darkWood,x,y+.84,z,islandWorld,10);
  box(.22,.04,.04,cream,x,y+.93,z+.34,islandWorld);
}
[[-9,-13],[9,-13],[-17,9],[17,9],[0,11],[25,-8],[0,29]].forEach(([x,z])=>trashBin(x,z));
function shadeUmbrella(x,z,color){
  const y=surface(x,z);
  cylinder(.055,.055,2.3,wood,x,y+1.15,z,islandWorld,8);
  const top=new THREE.Mesh(new THREE.ConeGeometry(1.35,.65,10),color);
  top.position.set(x,y+2.35,z);add(top);
  cylinder(.16,.16,.12,gold,x,y+2.04,z,islandWorld,10);
}
for(const [x,z] of [[-10,3],[-8,5],[10,3],[12,5]])shadeUmbrella(x,z,coral);
for(const [x,z] of [[-10,3],[10,3]]){box(1.8,.16,1.1,wood,x,surface(x,z)+.65,z+1.8);for(const dx of [-.6,.6])for(const dz of [-.35,.35])cylinder(.045,.045,.65,darkWood,x+dx,surface(x,z)+.32,z+1.8+dz,islandWorld,6);}

// A second path branch makes the pirate-ship cove part of the continuous park circuit.
path([[17,-23],[22,-26],[27,-29],[32,-27],[34,-21]],2.3);
// Additional palms frame the outer beach and the entrance promenade.
[[-38,-4],[-37,16],[-19,35],[19,35],[38,8],[38,-8],[5,-39]].forEach(([x,z],i)=>tree(x,z,.82,i%2===0));

// Fit the whole island on first load, retaining generous zoom-out range on mobile.
let angle=Math.PI*.24,elevation=.68,distance=648,targetDistance=648;
const focus=new THREE.Vector3(0,12,0),FIT_RADIUS=520,MAX_DISTANCE=2200;
let initialFit=false;
function fitDistance(){const v=THREE.MathUtils.degToRad(camera.fov*.5),h=Math.atan(Math.tan(v)*camera.aspect);return Math.ceil((FIT_RADIUS/Math.sin(Math.min(v,h)))*1.12);}
const pointers=new Map();let previous={x:0,y:0},pinch=0,dragging=false;
function updateCamera(){const horizontal=Math.cos(elevation)*distance;camera.position.set(focus.x+Math.sin(angle)*horizontal,focus.y+Math.sin(elevation)*distance,focus.z+Math.cos(angle)*horizontal);camera.lookAt(focus);}
function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);camera.aspect=w/h;camera.fov=camera.aspect<1?Math.min(96,43/camera.aspect):43;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,(camera.aspect<1||touch)?1.05:1.5));renderer.setSize(w,h,false);if(!initialFit){distance=fitDistance();targetDistance=distance;initialFit=true;}}
function pinchDistance(){const p=[...pointers.values()];return p.length<2?0:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
renderer.domElement.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});renderer.domElement.setPointerCapture(e.pointerId);if(pointers.size===1){dragging=true;previous={x:e.clientX,y:e.clientY};}if(pointers.size===2){dragging=false;pinch=pinchDistance();}});
renderer.domElement.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const d=pinchDistance();if(pinch)targetDistance=THREE.MathUtils.clamp(targetDistance-(d-pinch)*.72,30,MAX_DISTANCE);pinch=d;return;}if(dragging){angle-=(e.clientX-previous.x)*.005;elevation=THREE.MathUtils.clamp(elevation+(e.clientY-previous.y)*.003,.12,1.15);previous={x:e.clientX,y:e.clientY};}});
function endPointer(e){pointers.delete(e.pointerId);if(pointers.size<2)pinch=0;dragging=pointers.size===1;if(dragging)previous=[...pointers.values()][0];}
renderer.domElement.addEventListener('pointerup',endPointer);renderer.domElement.addEventListener('pointercancel',endPointer);
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();targetDistance=THREE.MathUtils.clamp(targetDistance+e.deltaY*.27,30,MAX_DISTANCE);},{passive:false});
renderer.domElement.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='=')targetDistance=Math.max(30,targetDistance-24);if(e.key==='-')targetDistance=Math.min(MAX_DISTANCE,targetDistance+24);if(e.key==='ArrowLeft')angle-=.08;if(e.key==='ArrowRight')angle+=.08;});
renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','Entertainment Island 3D. Arraste para explorar, use dois dedos ou a roda para aproximar.');
new ResizeObserver(resize).observe(host);resize();updateCamera();
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=clock.getDelta(),t=clock.elapsedTime;distance=THREE.MathUtils.lerp(distance,targetDistance,1-Math.exp(-6*dt));updateCamera();ocean.position.y=SEA+Math.sin(t*.65)*.025;waterMat.color.setHSL(.51+Math.sin(t*.16)*.007,.31,.54);carousel.rotation.y=t*.16;piratePivot.rotation.z=Math.sin(t*1.35)*.42;
coasterCars.forEach((car,index)=>{
  const progress=(t*.025+index*.018)%1;
  const p=coasterCurve.getPointAt(progress);
  const tangent=coasterCurve.getTangentAt(progress);
  car.position.set(p.x,p.y+.48,p.z);
  car.rotation.y=Math.atan2(-tangent.z,tangent.x);
});
renderer.render(scene,camera);}
animate();
const loading=host.querySelector('.entertainment-loading');if(loading)loading.remove();
window.lumenEntertainmentIsland={scene,camera,renderer,terrain,attractions:['Ferris Wheel','Roller Coaster','Carousel','Arcade Pavilion','Festival Stage','Fairytale Castle','Pirate Ship','Ticket Booths'],scale:11};
window.lumenEntertainmentIslandReady=true;
console.log('Lumen Society — Entertainment Island 1.0 carregada.');
