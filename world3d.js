import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

let renderer, scene, camera, car, promptEl, container;
let raf = null;
let move = { up: false, down: false, left: false, right: false };
let carState = { x: 0, z: 22, heading: Math.PI };
let nearIndex = -1;
let onEnterCb = null;
let keyDownHandler = null, keyUpHandler = null, resizeHandler = null, canvasClickHandler = null;
let buildingGroups = [];
const raycaster = new THREE.Raycaster();

const POSITIONS = [
  { x: -20, z: 8 }, { x: -11, z: -2 }, { x: 0, z: 10 }, { x: 11, z: -2 }, { x: 20, z: 8 },
];

function buildBuilding(kind, color) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .75, roughness: .4, metalness: .25 });
  if (kind === 0) {
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(2.6, 0), mat); m.position.y = 2.8; group.add(m);
    const m2 = new THREE.Mesh(new THREE.OctahedronGeometry(1.3, 0), mat); m2.position.set(2, 1.6, 1); group.add(m2);
  } else if (kind === 1) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(2.4, 1), mat); m.position.y = 2.4; group.add(m);
  } else if (kind === 2) {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 4, 10), mat); tower.position.y = 2; group.add(tower);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, .25, 10, 24), mat); ring.position.y = 4.2; ring.rotation.x = Math.PI / 2.4; group.add(ring);
  } else if (kind === 3) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.6, .9, 2.4, 10), mat); stem.position.y = 1.2; group.add(stem);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 16), mat); orb.position.y = 3.6; group.add(orb);
  } else {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, .6, 12), mat); base.position.y = .3; group.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(.7, .9, 3.2, 10), mat); body.position.y = 2.3; group.add(body);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(.7, 1.4, 10), mat); nose.position.y = 4.6; group.add(nose);
  }
  const light = new THREE.PointLight(color, 8, 14);
  light.position.y = 3.5;
  group.add(light);
  return group;
}

function buildCar(color) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: .5, metalness: .35 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, .6, 2.6), bodyMat); body.position.y = .55; group.add(body);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.1, .5, 1.2), bodyMat); cabin.position.set(0, 1.05, -.15); group.add(cabin);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111318, roughness: .9 });
  const wheelGeo = new THREE.CylinderGeometry(.32, .32, .3, 14);
  [[-.85, .32, .85], [.85, .32, .85], [-.85, .32, -.85], [.85, .32, -.85]].forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2; wheel.position.set(x, y, z);
    group.add(wheel);
  });
  const nose = new THREE.Mesh(new THREE.ConeGeometry(.22, .5, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: .7 }));
  nose.rotation.x = -Math.PI / 2; nose.position.set(0, .6, 1.5);
  group.add(nose);
  const headlight = new THREE.PointLight(0xffffff, 2, 6);
  headlight.position.set(0, .6, 1.6);
  group.add(headlight);
  return group;
}

function makeStars() {
  const N = 700;
  const positions = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    positions[i * 3] = (Math.random() - .5) * 170;
    positions[i * 3 + 1] = Math.random() * 55 + 6;
    positions[i * 3 + 2] = (Math.random() - .5) * 170;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: .35, transparent: true, opacity: .75 });
  return new THREE.Points(geo, mat);
}

function project(vec3) {
  const v = vec3.clone().project(camera);
  return { x: (v.x * .5 + .5) * container.clientWidth, y: (-v.y * .5 + .5) * container.clientHeight };
}

function updatePrompt(domains) {
  let best = -1, bestDist = 999;
  POSITIONS.forEach((p, i) => {
    if (domains[i].done) return;
    const d = Math.hypot(p.x - carState.x, p.z - carState.z);
    if (d < 9 && d < bestDist) { bestDist = d; best = i; }
  });
  if (best !== nearIndex) {
    nearIndex = best;
    promptEl.style.display = best === -1 ? 'none' : 'block';
    if (best > -1) promptEl.textContent = `↵ Enter ${domains[best].title}`;
  }
  if (nearIndex > -1) {
    const p = project(new THREE.Vector3(POSITIONS[nearIndex].x, 6, POSITIONS[nearIndex].z));
    promptEl.style.left = p.x + 'px';
    promptEl.style.top = p.y + 'px';
  }
}

function animate(domains) {
  const dt = 1 / 60;
  const accel = 14, maxSpeed = 13, maxRev = -6, friction = 2.4, turnSpeed = 2.1;
  const throttle = (move.up ? 1 : 0) - (move.down ? 1 : 0);
  carState.speed = (carState.speed || 0) + throttle * accel * dt;
  carState.speed -= carState.speed * friction * dt;
  if (Math.abs(carState.speed) < .02) carState.speed = 0;
  carState.speed = Math.max(maxRev, Math.min(maxSpeed, carState.speed));
  const turnInput = (move.left ? 1 : 0) - (move.right ? 1 : 0);
  if (carState.speed !== 0) carState.heading += turnInput * turnSpeed * dt * Math.sign(carState.speed);

  const fx = Math.sin(carState.heading), fz = Math.cos(carState.heading);
  carState.x = Math.max(-38, Math.min(38, carState.x + fx * carState.speed * dt));
  carState.z = Math.max(-38, Math.min(38, carState.z + fz * carState.speed * dt));

  car.position.set(carState.x, 0, carState.z);
  car.rotation.y = carState.heading;

  const camDist = 6.5, camHeight = 3.6;
  const desired = new THREE.Vector3(carState.x - fx * camDist, camHeight, carState.z - fz * camDist);
  camera.position.lerp(desired, 0.1);
  camera.lookAt(carState.x, 1.2, carState.z);

  updatePrompt(domains);
  renderer.render(scene, camera);
  raf = requestAnimationFrame(() => animate(domains));
}

function mount(el, opts) {
  container = el;
  onEnterCb = opts.onEnter;
  const domains = opts.domains;
  carState = { x: 0, z: 32, heading: Math.PI, speed: 0 };
  move = { up: false, down: false, left: false, right: false };
  nearIndex = -1;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07080d, 0.011);
  camera = new THREE.PerspectiveCamera(62, container.clientWidth / container.clientHeight, 0.1, 300);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x07080d, 1);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x8899ff, .6));
  const sun = new THREE.DirectionalLight(0xffffff, .55);
  sun.position.set(20, 30, 10);
  scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(42, 48),
    new THREE.MeshStandardMaterial({ color: 0x0e1220, roughness: .95 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const grid = new THREE.GridHelper(84, 42, 0x8b7bff, 0x20263a);
  grid.position.y = 0.02;
  scene.add(grid);

  scene.add(makeStars());

  buildingGroups = domains.map((d, i) => {
    const b = buildBuilding(i, d.colorHex);
    b.position.set(POSITIONS[i].x, 0, POSITIONS[i].z);
    b.userData.index = i;
    b.userData.done = d.done;
    if (d.done) b.traverse(o => { if (o.material) { o.material = o.material.clone(); o.material.opacity = .35; o.material.transparent = true; } });
    scene.add(b);
    return b;
  });

  car = buildCar(opts.avatarColorHex);
  car.position.set(carState.x, 0, carState.z);
  car.rotation.y = carState.heading;
  scene.add(car);

  const fx0 = Math.sin(carState.heading), fz0 = Math.cos(carState.heading);
  camera.position.set(carState.x - fx0 * 6.5, 3.6, carState.z - fz0 * 6.5);
  camera.lookAt(carState.x, 1.2, carState.z);

  promptEl = document.createElement('div');
  promptEl.className = 'w3d-prompt';
  promptEl.style.display = 'none';
  container.appendChild(promptEl);
  promptEl.addEventListener('click', () => { if (nearIndex > -1) onEnterCb?.(nearIndex); });

  canvasClickHandler = e => {
    const rect = renderer.domElement.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(buildingGroups, true);
    if (hits.length) {
      let obj = hits[0].object;
      while (obj && obj.userData.index === undefined) obj = obj.parent;
      if (obj && !obj.userData.done) onEnterCb?.(obj.userData.index);
    }
  };
  renderer.domElement.addEventListener('click', canvasClickHandler);

  const keyMap = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
  keyDownHandler = e => {
    const dir = keyMap[e.key];
    if (dir) { move[dir] = true; e.preventDefault(); }
    if ((e.key === 'Enter' || e.key === ' ') && nearIndex > -1) onEnterCb?.(nearIndex);
  };
  keyUpHandler = e => { const dir = keyMap[e.key]; if (dir) move[dir] = false; };
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  resizeHandler = () => {
    if (!container || !renderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', resizeHandler);

  animate(domains);
}

function setMove(dir, val) { move[dir] = val; }

function unmount() {
  if (raf) cancelAnimationFrame(raf);
  raf = null;
  if (keyDownHandler) document.removeEventListener('keydown', keyDownHandler);
  if (keyUpHandler) document.removeEventListener('keyup', keyUpHandler);
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
  if (canvasClickHandler && renderer) renderer.domElement.removeEventListener('click', canvasClickHandler);
  keyDownHandler = keyUpHandler = resizeHandler = canvasClickHandler = null;
  if (renderer) { renderer.dispose(); renderer.domElement.remove(); }
  if (promptEl) promptEl.remove();
  scene = camera = renderer = car = promptEl = null;
  buildingGroups = [];
  container = null;
  move = { up: false, down: false, left: false, right: false };
  nearIndex = -1;
}

window.QuestWorld3D = { mount, unmount, setMove };
