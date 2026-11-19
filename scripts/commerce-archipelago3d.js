import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
// LUMEN SOCIETY — COMMERCE ARCHIPELAGO 1.0. Cena independente, escala global 11x.
const host=document.getElementById('commerce-canvas');if(!host)throw new Error('Elemento #commerce-canvas não encontrado.');
const scene=new THREE.Scene();scene.background=new THREE.Color('#c6d9d6');scene.fog=new THREE.FogExp2('#c6d9d6',.00042);
const camera=new THREE.PerspectiveCamera(43,1,.1,3000),renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
const touch=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,touch?1.3:1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
host.innerHTML='';host.appendChild(renderer.domElement);Object.assign(renderer.domElement.style,{width:'100%',height:'100%',display:'block',touchAction:'none'});
scene.add(new THREE.HemisphereLight('#eff7ed','#62756d',2));
const sun=new THREE.DirectionalLight('#fff0d8',2.6);sun.position.set(-70,115,65);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-640;sun.shadow.camera.right=640;sun.shadow.camera.top=640;sun.shadow.camera.bottom=-640;sun.shadow.bias=-.00025;scene.add(sun);
const world=new THREE.Group();world.scale.setScalar(11);scene.add(world);
const mat=(c,r=1,e={})=>new THREE.MeshStandardMaterial({color:c,roughness:r,flatShading:true,...e});
const oceanMat=new THREE.MeshStandardMaterial({color:'#69aeb0',roughness:.28,metalness:.04,transparent:true,opacity:.96});
const roadMat=mat('#b8b8aa'),paving=mat('#d6cdb9'),wood=mat('#8a6247'),darkWood=mat('#624b3b');
const wallModern=mat('#d9e2df'),trimModern=mat('#c2d2cd'),glass=mat('#8eb9ba',.22,{transparent:true,opacity:.48});
const wallCoast=mat('#e8d2b5'),terra=mat('#b97859');
const greens=['#527b5e','#6f9368','#8da575'].map(c=>mat(c));
let seed=41827;function rand(){seed=seed*16807%2147483647;return(seed-1)/2147483646;}function smooth(a,b,x){const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);}
const SEA=-1.1,R=43;function edge(a){return R*(.95+Math.sin(a*3+.5)*.03+Math.sin(a*5+1.3)*.022+Math.cos(a*2-.8)*.022);}
function heightAt(x,z){return .12+Math.exp(-((x+1)**2+(z+1)**2)/650)*1.7+Math.exp(-((x+27)**2+(z-8)**2)/180)*2+Math.exp(-((x-28)**2+(z+10)**2)/170)*1.5+Math.sin(x*.16+z*.09)*.22+Math.cos(z*.2-x*.07)*.18;}
function surfaceHeight(x,z){return heightAt(x,z)+smooth(29,42,Math.hypot(x,z))*.55;}
const ocean=new THREE.Mesh(new THREE.PlaneGeometry(600,600),oceanMat);ocean.rotation.x=-Math.PI/2;ocean.position.y=SEA;ocean.receiveShadow=true;world.add(ocean);
// Organic landform with a gently raised green coast.
const SEG=192,RINGS=64,pos=[0,heightAt(0,0),0],idx=[],cols=[];
for(let ring=1;ring<=RINGS;ring++){const f=ring/RINGS;for(let i=0;i<SEG;i++){const a=i/SEG*Math.PI*2,r=edge(a)*f,x=Math.cos(a)*r,z=Math.sin(a)*r;pos.push(x,surfaceHeight(x,z),z);}}
for(let i=0;i<SEG;i++)idx.push(0,1+(i+1)%SEG,1+i);
for(let l=0;l<RINGS-1;l++){const a0=1+l*SEG,b0=a0+SEG;for(let i=0;i<SEG;i++){const n=(i+1)%SEG,a=a0+i,b=a0+n,c=b0+i,d=b0+n;idx.push(a,b,c,b,d,c);}}
const c1=new THREE.Color('#789b79'),c2=new THREE.Color('#9fb58a'),c3=new THREE.Color('#b5b28f');
for(let i=0;i<pos.length;i+=3){const x=pos[i],y=pos[i+1],z=pos[i+2],n=(Math.sin(x*.13+z*.08)+Math.cos(z*.17-x*.06))*.5,c=c1.clone().lerp(c2,smooth(-.2,.8,n)*.55);if(Math.hypot(x,z)>34)c.lerp(c3,.48);cols.push(c.r,c.g,c.b);}
const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));geo.setIndex(idx);geo.computeVertexNormals();
const terrain=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));terrain.receiveShadow=true;terrain.castShadow=true;world.add(terrain);
// Sand ribbon around the island.
const sp=[],si=[],layers=[1,1.025,1.055,1.085];for(let l=0;l<layers.length;l++)for(let i=0;i<SEG;i++){const a=i/SEG*Math.PI*2,r=edge(a)*layers[l],x=Math.cos(a)*r,z=Math.sin(a)*r,innerX=Math.cos(a)*edge(a),innerZ=Math.sin(a)*edge(a),y=THREE.MathUtils.lerp(surfaceHeight(innerX,innerZ)-.035,SEA-.5,l/(layers.length-1));sp.push(x,y,z);}
for(let l=0;l<layers.length-1;l++)for(let i=0;i<SEG;i++){const n=(i+1)%SEG,a=l*SEG+i,b=l*SEG+n,c=(l+1)*SEG+i,d=(l+1)*SEG+n;si.push(a,b,c,b,d,c);}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));sg.setIndex(si);sg.computeVertexNormals();world.add(new THREE.Mesh(sg,new THREE.MeshStandardMaterial({color:'#ddcba5',roughness:1,side:THREE.DoubleSide})));
// Roads and walkways follow gentle curves over the island.
function tube(points,radius,material,y=.13){const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,surfaceHeight(x,z)+y,z)));const m=new THREE.Mesh(new THREE.TubeGeometry(curve,180,radius,8,false),material);m.receiveShadow=true;world.add(m);return m;}
function slab(x,z,w,d,y,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,.12,d),m);o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=true;world.add(o);return o;}
function conformFootprint(mesh,x,z,w,d,thickness){const a=mesh.geometry.attributes.position,center=surfaceHeight(x,z);for(let i=0;i<a.count;i++){const dx=a.getX(i),dz=a.getZ(i),dy=surfaceHeight(x+dx,z+dz)-center;a.setY(i,a.getY(i)+dy);}a.needsUpdate=true;mesh.geometry.computeVertexNormals();}
tube([[-34,-5],[-25,-7],[-15,-7],[-5,-6],[5,-5],[16,-4],[27,-1],[35,5]],1.05,roadMat);
tube([[-2,-30],[-1,-20],[0,-10],[1,0],[4,11],[7,22],[11,31]],.72,roadMat);
tube([[-30,16],[-20,19],[-9,20],[2,20],[14,18],[26,14],[33,9]],.48,paving);
// Central plaza, fountain and benches.
slab(1,2,17,14,surfaceHeight(1,2)+.06,paving);
const basin=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.7,.55,48),mat('#d6d0bd'));basin.position.set(1,surfaceHeight(1,2)+.33,2);world.add(basin);
const water=new THREE.Mesh(new THREE.CircleGeometry(2.22,48),oceanMat);water.rotation.x=-Math.PI/2;water.position.set(1,surfaceHeight(1,2)+.62,2);world.add(water);
const fountain=new THREE.Mesh(new THREE.CylinderGeometry(.28,.4,.85,16),mat('#c5b89f'));fountain.position.set(1,surfaceHeight(1,2)+.93,2);world.add(fountain);
function bench(x,z,rot=0){const g=new THREE.Group();g.position.set(x,surfaceHeight(x,z)+.02,z);g.rotation.y=rot;const a=new THREE.Mesh(new THREE.BoxGeometry(2.1,.16,.55),wood);a.position.y=.65;g.add(a);const b=new THREE.Mesh(new THREE.BoxGeometry(2.1,.72,.14),wood);b.position.set(0,1,-.22);g.add(b);for(const sx of [-.78,.78]){const l=new THREE.Mesh(new THREE.BoxGeometry(.14,.62,.16),darkWood);l.position.set(sx,.31,0);g.add(l);}g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});world.add(g);}
bench(-5,3,.2);bench(7,3,-.2);bench(1,9,Math.PI/2);
// Boardwalk and pier.
tube([[-29,27],[-18,31],[-5,32],[9,31],[22,27],[31,21]],.58,wood,.25);
slab(32,31,5,15,surfaceHeight(32,31)+.06,wood);for(let z=25;z<=37;z+=3)for(const x of [30,34]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.16,.19,1.8,8),darkWood);p.position.set(x,surfaceHeight(x,z)+.9,z);world.add(p);}
// Empty storefront shells: plot pads, boundary lines, side/rear walls and open fronts.
const plots=[];
function sign(group,id,style,z){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.clearRect(0,0,512,128);ctx.fillStyle=style==='modern'?'#eff7f2':'#fff2df';ctx.font='700 54px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(id,256,66);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));s.scale.set(3.1,.78,1);s.position.set(0,.65,z);group.add(s);}
function addPlot(p){const {x,z,w,d,h,style,id,kind}=p,modern=style==='modern',g=new THREE.Group();g.position.set(x,surfaceHeight(x,z)+.02,z);world.add(g);const wall=modern?wallModern:wallCoast,trim=modern?trimModern:terra;
const base=new THREE.Mesh(new THREE.BoxGeometry(w,.24,d),mat(modern?'#b9c5c0':'#cbb99d'));base.position.y=.12;conformFootprint(base,x,z,w,d,.24);g.add(base);
// Keep the complete lot footprint visible, while the empty building shell sits smaller inside it.
const shell=new THREE.Group();shell.scale.set(.55,.55,.55);g.add(shell);
const back=new THREE.Mesh(new THREE.BoxGeometry(w,h,.34),wall);back.position.set(0,.24+h/2,-d/2+.17);shell.add(back);
for(const side of [-1,1]){const wing=new THREE.Mesh(new THREE.BoxGeometry(.34,h,d*.72),wall);wing.position.set(side*(w/2-.17),.24+h/2,d*.14);shell.add(wing);}
for(const side of [-1,1]){const post=new THREE.Mesh(new THREE.BoxGeometry(.34,h+.18,.38),trim);post.position.set(side*(w/2-.18),.24+(h+.18)/2,d/2-.18);shell.add(post);}
const lintel=new THREE.Mesh(new THREE.BoxGeometry(w+.2,.38,.48),trim);lintel.position.set(0,.24+h+.02,d/2-.18);shell.add(lintel);
const roof=new THREE.Mesh(new THREE.BoxGeometry(w+.35,.24,d+.35),modern?mat('#aebfbb'):mat('#b86f53'));roof.position.set(0,.24+h+.24,0);shell.add(roof);
const signboard=new THREE.Mesh(new THREE.BoxGeometry(w*.62,.48,.12),modern?mat('#536d6b'):mat('#77533f'));signboard.position.set(0,.24+h-.65,d/2+.045);shell.add(signboard);
const edgeMat=mat(modern?'#6d9691':'#bd946d'),corners=[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]];
for(let i=0;i<4;i++){const a=corners[i],b=corners[(i+1)%4],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),line=new THREE.Mesh(new THREE.BoxGeometry(len,.035,.07),edgeMat);line.position.set((a[0]+b[0])/2,.27,(a[1]+b[1])/2);line.rotation.y=-Math.atan2(dz,dx);g.add(line);}
g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});sign(g,id,style,d/2+.85);plots.push({...p,position:[x,z],size:[w,d],structureScale:.55});return g;}
[
{x:-25,z:-15,w:8.2,d:8.4,h:4.5,style:'modern',id:'M-01',kind:'Pequeno'},
{x:-13,z:-16,w:10,d:9,h:5.1,style:'modern',id:'M-02',kind:'Médio'},
{x:-25,z:-1,w:11,d:10,h:5.4,style:'modern',id:'M-03',kind:'Médio'},
{x:-11,z:-1,w:13,d:11,h:6.2,style:'modern',id:'M-04',kind:'Grande'},
{x:14,z:-17,w:8.5,d:8.5,h:4.5,style:'coastal',id:'C-01',kind:'Pequeno'},
{x:26,z:-15,w:10,d:9,h:5.2,style:'coastal',id:'C-02',kind:'Médio'},
{x:14,z:14,w:11,d:10,h:5.4,style:'coastal',id:'C-03',kind:'Médio'},
{x:28,z:12,w:13,d:11,h:6.2,style:'coastal',id:'C-04',kind:'Grande'},
{x:-22,z:19,w:14,d:12,h:6.4,style:'modern',id:'S-01',kind:'Especial'},
{x:20,z:25,w:14,d:12,h:6.4,style:'coastal',id:'S-02',kind:'Especial'}
].forEach(addPlot);

// New urban blocks: additional vacant parcels, sidewalks and calmer side streets.
// These are deliberately empty plots, ready for future homes, services and businesses.
const vacantLots=[];
function emptyLot({x,z,w=6.4,d=7.2,id,type='urban'}){
  const g=new THREE.Group();g.position.set(x,surfaceHeight(x,z)+.02,z);world.add(g);
  const padMat=mat(type==='green'?'#a4b58d':type==='service'?'#c9c4b2':'#c8c1ad');
  const pad=new THREE.Mesh(new THREE.BoxGeometry(w,.16,d),padMat);pad.position.y=.08;conformFootprint(pad,x,z,w,d,.16);pad.receiveShadow=true;pad.castShadow=true;g.add(pad);
  const curb=mat('#e0d7c4'),edge=.1,y=.19;
  const edges=[[w,edge,0,-d/2],[w,edge,0,d/2],[edge,d, -w/2,0],[edge,d,w/2,0]];
  for(const [ew,ed,ex,ez] of edges){const m=new THREE.Mesh(new THREE.BoxGeometry(ew,.12,ed),curb);m.position.set(ex,y,ez);g.add(m);}
  // A small entrance path connects each lot to the street.
  const path=new THREE.Mesh(new THREE.BoxGeometry(1.35,.045,1.35),paving);path.position.set(0,.19,d/2-.55);g.add(path);
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  sign(g,id,'modern',d/2+.58);
  vacantLots.push({id,position:[x,z],size:[w,d],type});
  return g;
}
// A second row of compact plots makes the island read as a growing town.
[
{x:-32,z:-25,w:6.2,d:6.8,id:'L-11'},
{x:-18,z:-29,w:6.4,d:6.8,id:'L-12'},
{x:-5,z:-30,w:6.8,d:6.8,id:'L-13',type:'service'},
{x:9,z:-29,w:6.4,d:6.8,id:'L-14'},
{x:31,z:-25,w:6.2,d:6.8,id:'L-15'},
{x:-34,z:11,w:6.2,d:6.8,id:'L-16'},
{x:34,z:-3,w:6.2,d:6.8,id:'L-17'},
{x:7,z:29,w:6.8,d:6.8,id:'L-18',type:'green'}
].forEach(emptyLot);

// Side streets form a loose city grid around the commercial core.
const sideStreet=mat('#a9aaa1'),sidewalk=mat('#d7d0bf');
[
[[-34,-23],[-27,-26],[-18,-28],[-7,-29],[5,-29],[17,-28],[30,-25]],
[[-35,8],[-28,10],[-20,12],[-10,13],[0,13],[11,13],[23,10],[34,6]],
[[-30,-31],[-29,-20],[-29,-9],[-29,2],[-29,12]],
[[30,-30],[30,-19],[30,-8],[30,3],[30,15]]
].forEach((points,i)=>tube(points,i<2?.48:.38,sideStreet,.16));
// Sidewalk strips soften the transition between streets and future lots.
[
[-20,-23,25,1.05], [17,-23,22,1.05], [-20,7,22,1.0], [20,7,22,1.0]
].forEach(([x,z,w,d])=>slab(x,z,w,d,surfaceHeight(x,z)+.06,sidewalk));

// Small neighborhood green pockets break up the blocks and reserve public space.
function greenPocket(x,z,w,d){
  const g=new THREE.Mesh(new THREE.BoxGeometry(w,.12,d),mat('#9eae86'));
  g.position.set(x,surfaceHeight(x,z)+.06,z);g.receiveShadow=true;world.add(g);
  for(const dx of [-w*.28,0,w*.28])tree(x+dx,z,.42+rand()*.12);
}
greenPocket(-8,-22,7,4.5);
greenPocket(23,20,6,4.5);
greenPocket(-31, -4,4.5,6);

// Trees, planters and lamps frame public space; no vegetation is placed inside lots.
function tree(x,z,s=1){const g=new THREE.Group();g.position.set(x,surfaceHeight(x,z),z);g.scale.setScalar(s);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.22,.32,2.8,7),wood);trunk.position.y=1.4;g.add(trunk);for(let i=0;i<3;i++){const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.35-i*.12,1),greens[i]);crown.position.set((rand()-.5)*.35,3.1+i*.42,(rand()-.5)*.35);crown.scale.set(1.05,.9,1.05);g.add(crown);}g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});world.add(g);}
[[-34,21],[-17,27],[-6,27],[32,18],[34,-12],[0,13],[9,12]].forEach(([x,z],i)=>tree(x,z,.8+rand()*.35));
function lamp(x,z){const g=new THREE.Group();g.position.set(x,surfaceHeight(x,z),z);const pole=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,3.4,8),darkWood);pole.position.y=1.7;g.add(pole);const head=new THREE.Mesh(new THREE.BoxGeometry(.62,.28,.62),mat('#f2d9a9',.5,{emissive:'#b98e54',emissiveIntensity:.18}));head.position.y=3.5;g.add(head);world.add(g);}
[[-30,-8],[-18,-8],[-5,-7],[8,-6],[21,-4],[31,1],[-1,12],[5,12],[14,19]].forEach(([x,z])=>lamp(x,z));
// Camera auto-fits the entire 11x island on portrait and landscape screens.
let angle=Math.PI*.24,elevation=.67,distance=650,targetDistance=650;const focus=new THREE.Vector3(0,12,0),FIT_RADIUS=513.3,MAX_DISTANCE=2200;let initialFit=false;
function fitDistance(){const v=THREE.MathUtils.degToRad(camera.fov*.5),h=Math.atan(Math.tan(v)*camera.aspect);return Math.ceil((FIT_RADIUS/Math.sin(Math.min(v,h)))*1.12);}
const pointers=new Map();let previous={x:0,y:0},pinch=0,dragging=false;
function updateCamera(){const horizontal=Math.cos(elevation)*distance;camera.position.set(focus.x+Math.sin(angle)*horizontal,focus.y+Math.sin(elevation)*distance,focus.z+Math.cos(angle)*horizontal);camera.lookAt(focus);}
function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);camera.aspect=w/h;camera.fov=camera.aspect<1?Math.min(96,43/camera.aspect):43;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio||1,(camera.aspect<1||touch)?1.3:1.7));renderer.setSize(w,h,false);if(!initialFit){distance=fitDistance();targetDistance=distance;initialFit=true;}}
function pinchDistance(){const p=[...pointers.values()];return p.length<2?0:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
renderer.domElement.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});renderer.domElement.setPointerCapture(e.pointerId);if(pointers.size===1){dragging=true;previous={x:e.clientX,y:e.clientY};}if(pointers.size===2){dragging=false;pinch=pinchDistance();}});
renderer.domElement.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const d=pinchDistance();if(pinch)targetDistance=THREE.MathUtils.clamp(targetDistance-(d-pinch)*.72,30,MAX_DISTANCE);pinch=d;return;}if(dragging){angle-=(e.clientX-previous.x)*.005;elevation=THREE.MathUtils.clamp(elevation+(e.clientY-previous.y)*.003,.12,1.15);previous={x:e.clientX,y:e.clientY};}});
function endPointer(e){pointers.delete(e.pointerId);if(pointers.size<2)pinch=0;dragging=pointers.size===1;if(dragging)previous=[...pointers.values()][0];}
renderer.domElement.addEventListener('pointerup',endPointer);renderer.domElement.addEventListener('pointercancel',endPointer);
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();targetDistance=THREE.MathUtils.clamp(targetDistance+e.deltaY*.27,30,MAX_DISTANCE);},{passive:false});
renderer.domElement.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='=')targetDistance=Math.max(30,targetDistance-24);if(e.key==='-')targetDistance=Math.min(MAX_DISTANCE,targetDistance+24);if(e.key==='ArrowLeft')angle-=.08;if(e.key==='ArrowRight')angle+=.08;});
renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','Commerce Archipelago 3D. Arraste para explorar, use dois dedos ou a roda para aproximar.');
new ResizeObserver(resize).observe(host);resize();updateCamera();
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const dt=clock.getDelta(),t=clock.elapsedTime;distance=THREE.MathUtils.lerp(distance,targetDistance,1-Math.exp(-6*dt));updateCamera();ocean.position.y=SEA+Math.sin(t*.65)*.025;renderer.render(scene,camera);}animate();
const loading=host.querySelector('.commerce-loading');if(loading)loading.remove();
window.lumenCommerceArchipelago={scene,camera,renderer,terrain,plots,vacantLots,scale:11};window.lumenCommerceArchipelagoReady=true;
console.log('Lumen Society — Commerce Archipelago 1.0 carregado.',{commercialPlots:plots.length,vacantLots:vacantLots.length,scale:11});