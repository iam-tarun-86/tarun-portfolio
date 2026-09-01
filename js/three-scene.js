/**
 * Three.js 3D Cyberpunk AI Lab & Rover Engine (Concept 1)
 * Features:
 * - Drivable Cyber-Rover (WASD / Touch Joystick / Scroll Auto-Pilot)
 * - 5 3D Interactive Lab Pods (Quantum Core, SIEM Radar, Projects, Skills Reactor, Uplink)
 * - 5 Collectible GGUF Quantization Shards with 3D Collision Physics
 * - 3D Laser Defense Firing Effects
 * - Real-time 2D Canvas Minimap Radar
 */

class CyberLabUniverse {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    if (typeof THREE === 'undefined') {
      setTimeout(() => new CyberLabUniverse(canvasId), 100);
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Rover & Control State
    this.controlMode = 'scroll'; // 'scroll' or 'manual'
    this.rover = {
      x: 0,
      y: 0.5,
      z: 15,
      angle: -Math.PI / 2, // Facing forward (-Z)
      speed: 0,
      maxSpeed: 1.2,
      accel: 0.05,
      friction: 0.94,
      mesh: null,
      wheels: [],
      shardsCollected: 0
    };

    this.keys = { up: false, down: false, left: false, right: false };
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.scrollTarget = 0;

    // Pod Positions & Shards
    this.pods = [
      { id: 'hero', name: 'QUANTUM AI CORE', x: 16, z: 0, radius: 18, color: '#a855f7' },
      { id: 'architecture', name: 'SIEM DEFENSE RADAR', x: 0, z: -60, radius: 18, color: '#10b981' },
      { id: 'projects', name: 'PROJECT MONOLITHS', x: 0, z: -120, radius: 18, color: '#0ea5e9' },
      { id: 'arsenal', name: 'SKILLS REACTOR CORE', x: 0, z: -180, radius: 18, color: '#f59e0b' },
      { id: 'contact', name: 'COMMUNICATIONS UPLINK', x: 0, z: -240, radius: 18, color: '#ec4899' }
    ];

    this.shards = [
      { x: 10, y: 1.5, z: -25, mesh: null, collected: false },
      { x: -14, y: 1.5, z: -85, mesh: null, collected: false },
      { x: 14, y: 1.5, z: -145, mesh: null, collected: false },
      { x: -12, y: 1.5, z: -205, mesh: null, collected: false },
      { x: 8, y: 1.5, z: -235, mesh: null, collected: false }
    ];

    this.activePod = null;
    this.objects = {};

    this.initScene();
    this.initFloorAndMonoliths();
    this.initRover();
    this.initPods();
    this.initShards();
    this.bindEvents();

    this.camera.position.set(0, 18, 38);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initScene() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    const purpleLight = new THREE.PointLight(0xa855f7, 4, 120);
    purpleLight.position.set(20, 25, 20);
    this.scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 4, 120);
    cyanLight.position.set(-20, 25, -60);
    this.scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.5, 100);
    emeraldLight.position.set(15, 25, -150);
    this.scene.add(emeraldLight);

    // Deep Starfield Background
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 600;
      starPositions[i + 1] = Math.random() * 250 - 20;
      starPositions[i + 2] = Math.random() * 400 - 300;

      const p = Math.random();
      if (p > 0.6) {
        starColors[i] = 0.65; starColors[i + 1] = 0.33; starColors[i + 2] = 0.96;
      } else if (p > 0.3) {
        starColors[i] = 0.02; starColors[i + 1] = 0.71; starColors[i + 2] = 0.83;
      } else {
        starColors[i] = 0.06; starColors[i + 1] = 0.73; starColors[i + 2] = 0.51;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.objects.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.objects.stars);
  }

  initFloorAndMonoliths() {
    // 3D Neon Floor Grid
    const gridHelper = new THREE.GridHelper(320, 80, 0x8b5cf6, 0x1e293b);
    gridHelper.position.set(0, -0.01, -120);
    this.scene.add(gridHelper);

    // Boundary Server Racks on Left & Right
    const rackGeo = new THREE.BoxGeometry(3, 14, 5);
    const rackMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: true
    });

    for (let z = 20; z >= -260; z -= 35) {
      const leftRack = new THREE.Mesh(rackGeo, rackMat);
      leftRack.position.set(-36, 7, z);
      this.scene.add(leftRack);

      const rightRack = new THREE.Mesh(rackGeo, rackMat);
      rightRack.position.set(36, 7, z);
      this.scene.add(rightRack);
    }
  }

  initRover() {
    this.rover.mesh = new THREE.Group();

    // Chassis
    const bodyGeo = new THREE.BoxGeometry(3.2, 1.2, 4.5);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.25
    });
    const chassis = new THREE.Mesh(bodyGeo, bodyMat);
    chassis.position.y = 1.0;
    this.rover.mesh.add(chassis);

    // Cyan Cockpit Dome
    const domeGeo = new THREE.SphereGeometry(1.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.7
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 1.6, -0.2);
    this.rover.mesh.add(dome);

    // 4 Neon Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.6, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true });

    const wheelPositions = [
      [-1.8, 0.7, -1.5], [1.8, 0.7, -1.5],
      [-1.8, 0.7, 1.5], [1.8, 0.7, 1.5]
    ];

    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      this.rover.mesh.add(wheel);
      this.rover.wheels.push(wheel);
    });

    // Dual Forward Headlights
    const lightL = new THREE.SpotLight(0x38bdf8, 3, 25, Math.PI / 6, 0.5);
    lightL.position.set(-1.0, 1.2, -2.2);
    lightL.target.position.set(-1.0, 0, -12);
    this.rover.mesh.add(lightL);
    this.rover.mesh.add(lightL.target);

    const lightR = new THREE.SpotLight(0x38bdf8, 3, 25, Math.PI / 6, 0.5);
    lightR.position.set(1.0, 1.2, -2.2);
    lightR.target.position.set(1.0, 0, -12);
    this.rover.mesh.add(lightR);
    this.rover.mesh.add(lightR.target);

    this.rover.mesh.position.set(this.rover.x, this.rover.y, this.rover.z);
    this.scene.add(this.rover.mesh);
  }

  initPods() {
    // 1. Quantum Core Pod (Hero)
    this.objects.corePod = new THREE.Group();
    const icosaGeo = new THREE.IcosahedronGeometry(7, 1);
    const icosaMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, wireframe: true, emissive: 0x7c3aed, emissiveIntensity: 0.6 });
    const icosa = new THREE.Mesh(icosaGeo, icosaMat);
    this.objects.corePod.add(icosa);

    const innerGeo = new THREE.DodecahedronGeometry(3.5);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x38bdf8, emissiveIntensity: 0.8 });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    this.objects.corePod.add(inner);

    const ringGeo = new THREE.TorusGeometry(11, 0.25, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    this.objects.corePod.add(ring);

    this.objects.corePod.position.set(16, 6, 0);
    this.scene.add(this.objects.corePod);

    // 2. SIEM Defense Radar Pod (Stage 2)
    this.objects.siemPod = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(3.5, 3.5, 3.5);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, wireframe: true, emissive: 0x0284c7 });
    const n1 = new THREE.Mesh(boxGeo, boxMat);
    n1.position.set(-14, 5, 0);
    this.objects.siemPod.add(n1);

    const octGeo = new THREE.OctahedronGeometry(3.5);
    const octMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, wireframe: true, emissive: 0x7c3aed });
    const n2 = new THREE.Mesh(octGeo, octMat);
    n2.position.set(0, 5, 0);
    this.objects.siemPod.add(n2);

    const coneGeo = new THREE.ConeGeometry(3, 5, 4);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x10b981, wireframe: true, emissive: 0x059669 });
    const n3 = new THREE.Mesh(coneGeo, coneMat);
    n3.position.set(14, 5, 0);
    this.objects.siemPod.add(n3);

    this.objects.siemPod.position.set(0, 0, -60);
    this.scene.add(this.objects.siemPod);

    // 3. Project Monoliths Pod (Stage 3)
    this.objects.projectsPod = new THREE.Group();
    for (let i = -1; i <= 1; i++) {
      const pedGeo = new THREE.CylinderGeometry(3.5, 4, 1.5, 16);
      const pedMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, wireframe: true });
      const ped = new THREE.Mesh(pedGeo, pedMat);
      ped.position.set(i * 18, 0.75, 0);
      this.objects.projectsPod.add(ped);

      const holoGeo = new THREE.BoxGeometry(5, 7, 0.4);
      const holoMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5
      });
      const holo = new THREE.Mesh(holoGeo, holoMat);
      holo.position.set(i * 18, 5.5, 0);
      this.objects.projectsPod.add(holo);
    }
    this.objects.projectsPod.position.set(0, 0, -120);
    this.scene.add(this.objects.projectsPod);

    // 4. Skills Reactor Core (Stage 4)
    this.objects.skillsPod = new THREE.Group();
    const reactorGeo = new THREE.TorusGeometry(12, 0.6, 16, 80);
    const reactorMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
    const reactor = new THREE.Mesh(reactorGeo, reactorMat);
    reactor.rotation.x = Math.PI / 2.5;
    reactor.position.y = 6;
    this.objects.skillsPod.add(reactor);

    this.objects.skillsPod.position.set(0, 0, -180);
    this.scene.add(this.objects.skillsPod);

    // 5. Communications Uplink (Stage 5)
    this.objects.uplinkPod = new THREE.Group();
    const towerGeo = new THREE.CylinderGeometry(0.5, 2.5, 16, 8);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xec4899, wireframe: true, emissive: 0xbe185d });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 8;
    this.objects.uplinkPod.add(tower);

    this.objects.uplinkPod.position.set(0, 0, -240);
    this.scene.add(this.objects.uplinkPod);
  }

  initShards() {
    const shardGeo = new THREE.OctahedronGeometry(1.2);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.9
    });

    this.shards.forEach(s => {
      s.mesh = new THREE.Mesh(shardGeo, shardMat);
      s.mesh.position.set(s.x, s.y, s.z);
      this.scene.add(s.mesh);
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Keyboard driving controls
    window.addEventListener('keydown', (e) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) this.keys.up = true;
      if (['KeyS', 'ArrowDown'].includes(e.code)) this.keys.down = true;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) this.keys.left = true;
      if (['KeyD', 'ArrowRight'].includes(e.code)) this.keys.right = true;

      // When driving manually, switch mode automatically
      if (this.keys.up || this.keys.down || this.keys.left || this.keys.right) {
        this.setControlMode('manual');
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) this.keys.up = false;
      if (['KeyS', 'ArrowDown'].includes(e.code)) this.keys.down = false;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) this.keys.left = false;
      if (['KeyD', 'ArrowRight'].includes(e.code)) this.keys.right = false;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  setControlMode(mode) {
    this.controlMode = mode;
    const modeBtn = document.getElementById('hud-mode-btn');
    if (modeBtn) {
      modeBtn.innerHTML = mode === 'manual'
        ? '<i class="ti ti-steering-wheel"></i> <span>MANUAL ROVER (WASD)</span>'
        : '<i class="ti ti-route"></i> <span>AUTO-PILOT (SCROLL)</span>';
    }
  }

  setScrollProgress(p) {
    this.scrollTarget = p;
    if (this.controlMode === 'scroll') {
      // In scroll mode, rover rides the center track smoothly
      this.rover.x = Math.sin(p * Math.PI * 2) * 5;
      this.rover.z = 15 - p * 255;
      this.rover.angle = -Math.PI / 2;
    }
  }

  updateRoverPhysics() {
    if (this.controlMode === 'manual') {
      if (this.keys.up) this.rover.speed = Math.min(this.rover.speed + this.rover.accel, this.rover.maxSpeed);
      if (this.keys.down) this.rover.speed = Math.max(this.rover.speed - this.rover.accel, -this.rover.maxSpeed * 0.5);

      if (this.keys.left) this.rover.angle += 0.045;
      if (this.keys.right) this.rover.angle -= 0.045;

      this.rover.speed *= this.rover.friction;

      this.rover.x += Math.cos(this.rover.angle) * this.rover.speed;
      this.rover.z += -Math.sin(this.rover.angle) * this.rover.speed;

      // Constrain within lab borders
      this.rover.x = Math.max(-32, Math.min(32, this.rover.x));
      this.rover.z = Math.max(-255, Math.min(25, this.rover.z));
    }

    if (this.rover.mesh) {
      this.rover.mesh.position.set(this.rover.x, this.rover.y, this.rover.z);
      this.rover.mesh.rotation.y = this.rover.angle + Math.PI / 2;

      // Animate wheels
      this.rover.wheels.forEach(w => {
        w.rotation.x += this.rover.speed * 0.5;
      });
    }

    // Check Shard Collections
    this.shards.forEach(s => {
      if (!s.collected && Math.hypot(this.rover.x - s.x, this.rover.z - s.z) < 3.5) {
        s.collected = true;
        this.scene.remove(s.mesh);
        this.rover.shardsCollected++;
        if (window.soundEngine) window.soundEngine.playShardCollect();
        const shardHUD = document.getElementById('hud-shards-count');
        if (shardHUD) shardHUD.innerText = `${this.rover.shardsCollected}/5`;
      }
    });

    // Check Proximity to Pods
    let nearestPod = null;
    this.pods.forEach(pod => {
      const dist = Math.hypot(this.rover.x - pod.x, this.rover.z - pod.z);
      if (dist < pod.radius) {
        nearestPod = pod;
      }
    });

    this.activePod = nearestPod;
    const banner = document.getElementById('proximity-banner');
    const bannerText = document.getElementById('proximity-text');
    if (banner && bannerText) {
      if (nearestPod) {
        bannerText.innerText = `POD DETECTED: ${nearestPod.name}`;
        banner.classList.add('active');
      } else {
        banner.classList.remove('active');
      }
    }

    this.renderMinimap();
  }

  renderMinimap() {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Map background
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, w, h);

    // Draw Pod Nodes
    this.pods.forEach(p => {
      const mapX = ((p.x + 35) / 70) * w;
      const mapY = ((-p.z + 25) / 280) * h;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(mapX, mapY, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Rover
    const roverMapX = ((this.rover.x + 35) / 70) * w;
    const roverMapY = ((-this.rover.z + 25) / 280) * h;

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#0ea5e9';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(roverMapX, roverMapY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.updateRoverPhysics();

    const time = Date.now() * 0.0012;

    // Rotate Pods & Shards
    if (this.objects.corePod) {
      this.objects.corePod.rotation.y = time * 0.3;
      this.objects.corePod.rotation.x = time * 0.15;
    }
    if (this.objects.siemPod) {
      this.objects.siemPod.rotation.y = time * 0.2;
    }
    if (this.objects.skillsPod) {
      this.objects.skillsPod.rotation.y = time * 0.35;
    }
    if (this.objects.uplinkPod) {
      this.objects.uplinkPod.rotation.y = time * 0.4;
    }

    this.shards.forEach(s => {
      if (!s.collected && s.mesh) {
        s.mesh.rotation.y = time * 1.5;
        s.mesh.position.y = s.y + Math.sin(time * 3 + s.x) * 0.4;
      }
    });

    // Camera follow physics
    let targetCamX = this.rover.x * 0.4 + this.mouse.x * 2.5;
    let targetCamY = 16 + this.mouse.y * 2.0;
    let targetCamZ = this.rover.z + 24;

    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.06;

    this.camera.lookAt(this.rover.x, this.rover.y + 2, this.rover.z - 8);

    this.renderer.render(this.scene, this.camera);
  }
}

window.initSpatialUniverse = function() {
  window.cyberLab = new CyberLabUniverse('webgl-canvas');
};
