/**
 * MotionSites.ai-Grade Hyper-Realistic 3D Cyber Lab & Rover Engine
 * Features:
 * - In-Memory Procedural Studio HDRI Environment Reflections (PMREMGenerator)
 * - Organic Morphing Liquid-Chrome / Glass Neural Core (Procedural Multi-Frequency Noise Waves)
 * - Photorealistic Cyber-Rover (Metallic Clearcoat, Cyan Glass Canopy, Rotating Wheels, Spotlights)
 * - 5 3D Lab Pods with Refractive Glass & Metallic Clearcoat
 * - 5 3D Collectible GGUF Quantization Shards with Collision Physics & Chimes
 * - Real-time 2D Canvas Minimap Radar
 * - 3-Point Studio Lighting (Key, Fill, Rim)
 */

class MotionSitesCyberLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    if (typeof THREE === 'undefined') {
      setTimeout(() => new MotionSitesCyberLab(canvasId), 100);
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    // Rover & Control State
    this.controlMode = 'scroll'; // 'scroll' or 'manual'
    this.rover = {
      x: 0,
      y: 0.6,
      z: 15,
      angle: -Math.PI / 2, // Facing forward (-Z)
      speed: 0,
      maxSpeed: 1.25,
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

    // 5 Lab Pods (Z-axis track)
    this.pods = [
      { id: 'hero', name: 'QUANTUM AI CORE', x: 16, z: 0, radius: 20, color: '#a855f7' },
      { id: 'architecture', name: 'SIEM DEFENSE RADAR', x: 0, z: -60, radius: 20, color: '#10b981' },
      { id: 'projects', name: 'PROJECT MONOLITHS', x: 0, z: -120, radius: 20, color: '#0ea5e9' },
      { id: 'arsenal', name: 'SKILLS REACTOR CORE', x: 0, z: -180, radius: 20, color: '#f59e0b' },
      { id: 'contact', name: 'COMMUNICATIONS UPLINK', x: 0, z: -240, radius: 20, color: '#ec4899' }
    ];

    // 5 Collectible GGUF Shards on the floor
    this.shards = [
      { x: 10, y: 1.5, z: -25, mesh: null, collected: false },
      { x: -14, y: 1.5, z: -85, mesh: null, collected: false },
      { x: 14, y: 1.5, z: -145, mesh: null, collected: false },
      { x: -12, y: 1.5, z: -205, mesh: null, collected: false },
      { x: 8, y: 1.5, z: -235, mesh: null, collected: false }
    ];

    this.objects = {};
    this.basePositions = [];

    this.initStudioEnvironmentMap();
    this.initLights();
    this.initBackgroundParticles();
    this.initFloorGrid();
    this.initPhotorealisticRover();
    this.initPhotorealisticPods();
    this.initShards();
    this.bindEvents();

    this.camera.position.set(0, 16, 38);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initStudioEnvironmentMap() {
    // Generate Procedural High-Contrast Studio Environment Map for Photorealistic Chrome Reflections
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    cubeRenderTarget.texture.type = THREE.HalfFloatType;

    const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);
    const envScene = new THREE.Scene();

    // Studio Softbox Lights inside the envScene
    const softboxTop = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    softboxTop.position.set(0, 4, 0);
    softboxTop.rotation.x = Math.PI / 2;
    envScene.add(softboxTop);

    const softboxViolet = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ color: 0xa855f7 })
    );
    softboxViolet.position.set(4, 2, 2);
    softboxViolet.lookAt(0, 0, 0);
    envScene.add(softboxViolet);

    const softboxCyan = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
    );
    softboxCyan.position.set(-4, -1, 3);
    softboxCyan.lookAt(0, 0, 0);
    envScene.add(softboxCyan);

    cubeCamera.update(this.renderer, envScene);
    this.scene.environment = cubeRenderTarget.texture;
  }

  initLights() {
    const ambient = new THREE.AmbientLight(0x0a0f1d, 1.4);
    this.scene.add(ambient);

    // Key Light (Neon Violet)
    const keyLight = new THREE.DirectionalLight(0xa855f7, 5.0);
    keyLight.position.set(25, 30, 20);
    this.scene.add(keyLight);

    // Fill Light (Cyber Cyan)
    const fillLight = new THREE.PointLight(0x06b6d4, 5.0, 120);
    fillLight.position.set(-20, 20, -60);
    this.scene.add(fillLight);

    // Rim Light (Emerald Gold)
    const rimLight = new THREE.PointLight(0x10b981, 4.5, 100);
    rimLight.position.set(15, 20, -160);
    this.scene.add(rimLight);
  }

  initBackgroundParticles() {
    const count = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 500;
      positions[i + 1] = Math.random() * 250 - 20;
      positions[i + 2] = Math.random() * 450 - 300;

      const p = Math.random();
      if (p > 0.6) {
        colors[i] = 0.66; colors[i + 1] = 0.33; colors[i + 2] = 0.97; // Violet
      } else if (p > 0.3) {
        colors[i] = 0.02; colors[i + 1] = 0.71; colors[i + 2] = 0.83; // Cyan
      } else {
        colors[i] = 0.06; colors[i + 1] = 0.73; colors[i + 2] = 0.51; // Emerald
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.objects.stars = new THREE.Points(geometry, material);
    this.scene.add(this.objects.stars);
  }

  initFloorGrid() {
    // Glowing Neon Cyber Grid
    const gridHelper = new THREE.GridHelper(320, 80, 0x8b5cf6, 0x1e293b);
    gridHelper.position.set(0, -0.01, -120);
    this.scene.add(gridHelper);

    // Dynamic Scrolling Wireframe Terrain Plane (Interactive_3D_Hero MotionSites spec)
    const terrainGeo = new THREE.PlaneGeometry(360, 360, 60, 60);
    const terrainMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    this.objects.wireframeTerrain = new THREE.Mesh(terrainGeo, terrainMat);
    this.objects.wireframeTerrain.rotation.x = -Math.PI / 2;
    this.objects.wireframeTerrain.position.set(0, -0.05, -120);
    this.scene.add(this.objects.wireframeTerrain);

    // Boundary Server Racks
    const rackGeo = new THREE.BoxGeometry(3, 12, 5);
    const rackMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0e1a,
      roughness: 0.15,
      metalness: 0.9,
      clearcoat: 1.0,
      reflectivity: 0.9
    });

    for (let z = 20; z >= -260; z -= 35) {
      const leftRack = new THREE.Mesh(rackGeo, rackMat);
      leftRack.position.set(-36, 6, z);
      this.scene.add(leftRack);

      const rightRack = new THREE.Mesh(rackGeo, rackMat);
      rightRack.position.set(36, 6, z);
      this.scene.add(rightRack);
    }
  }

  initPhotorealisticRover() {
    this.rover.mesh = new THREE.Group();

    // Metallic Obsidian Chassis
    const bodyGeo = new THREE.BoxGeometry(3.2, 1.1, 4.6);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x090d16,
      metalness: 0.92,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.35
    });
    const chassis = new THREE.Mesh(bodyGeo, bodyMat);
    chassis.position.y = 1.0;
    this.rover.mesh.add(chassis);

    // Iridescent Cyan Glass Cockpit Canopy
    const domeGeo = new THREE.SphereGeometry(1.2, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      metalness: 0.85,
      roughness: 0.04,
      clearcoat: 1.0,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.8,
      transmission: 0.5,
      ior: 1.52,
      reflectivity: 0.95
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.set(0, 1.55, -0.2);
    this.rover.mesh.add(dome);

    // 4 High-Poly Metallic Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.6, 32);
    const wheelMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5
    });

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

    // Dual Forward Headlight Spotlights
    const lightL = new THREE.SpotLight(0x38bdf8, 4.0, 35, Math.PI / 6, 0.5);
    lightL.position.set(-1.0, 1.2, -2.2);
    lightL.target.position.set(-1.0, 0, -15);
    this.rover.mesh.add(lightL);
    this.rover.mesh.add(lightL.target);

    const lightR = new THREE.SpotLight(0x38bdf8, 4.0, 35, Math.PI / 6, 0.5);
    lightR.position.set(1.0, 1.2, -2.2);
    lightR.target.position.set(1.0, 0, -15);
    this.rover.mesh.add(lightR);
    this.rover.mesh.add(lightR.target);

    this.rover.mesh.position.set(this.rover.x, this.rover.y, this.rover.z);
    this.scene.add(this.rover.mesh);
  }

  initPhotorealisticPods() {
    // 1. Pod 1: MotionSites-Grade Morphing Liquid-Chrome Neural Core (Hero)
    this.objects.corePod = new THREE.Group();

    const sphereGeo = new THREE.SphereGeometry(7.0, 96, 96);
    this.basePositions = sphereGeo.attributes.position.array.slice();

    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.45,
      roughness: 0.05,
      metalness: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transmission: 0.35,
      ior: 1.55,
      reflectivity: 0.98
    });
    this.objects.liquidCore = new THREE.Mesh(sphereGeo, liquidMat);
    this.objects.corePod.add(this.objects.liquidCore);

    // Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(3.8, 3);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.3,
      roughness: 0.15,
      metalness: 0.9
    });
    this.objects.innerCore = new THREE.Mesh(innerGeo, innerMat);
    this.objects.corePod.add(this.objects.innerCore);

    // Refractive Orbiting Glass Rings
    const ringGeo = new THREE.TorusGeometry(12.0, 0.35, 32, 128);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      roughness: 0.04,
      metalness: 0.92,
      clearcoat: 1.0,
      transmission: 0.3,
      ior: 1.52
    });
    this.objects.ring1 = new THREE.Mesh(ringGeo, ringMat);
    this.objects.ring1.rotation.x = Math.PI / 3;
    this.objects.corePod.add(this.objects.ring1);

    this.objects.corePod.position.set(16, 6, 0);
    this.scene.add(this.objects.corePod);

    // 2. Pod 2: SIEM Threat Defense Radar (Stage 2)
    this.objects.siemPod = new THREE.Group();
    const glassNodeMat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      roughness: 0.06,
      metalness: 0.88,
      clearcoat: 1.0
    });

    const boxGeo = new THREE.BoxGeometry(3.5, 3.5, 3.5);
    const n1 = new THREE.Mesh(boxGeo, glassNodeMat);
    n1.position.set(-14, 5, 0);
    this.objects.siemPod.add(n1);

    const octGeo = new THREE.OctahedronGeometry(3.5);
    const purpleMat = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.7,
      roughness: 0.06,
      metalness: 0.88,
      clearcoat: 1.0
    });
    const n2 = new THREE.Mesh(octGeo, purpleMat);
    n2.position.set(0, 5, 0);
    this.objects.siemPod.add(n2);

    const coneGeo = new THREE.ConeGeometry(3, 5, 6);
    const emeraldMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.7,
      roughness: 0.06,
      metalness: 0.88,
      clearcoat: 1.0
    });
    const n3 = new THREE.Mesh(coneGeo, emeraldMat);
    n3.position.set(14, 5, 0);
    this.objects.siemPod.add(n3);

    this.objects.siemPod.position.set(0, -6, -75);
    this.scene.add(this.objects.siemPod);

    // 3. Pod 3: Project Monoliths (Stage 3)
    this.objects.projectsPod = new THREE.Group();
    for (let i = -1; i <= 1; i++) {
      const pedGeo = new THREE.CylinderGeometry(3.5, 4, 1.5, 32);
      const pedMat = new THREE.MeshPhysicalMaterial({ color: 0x0ea5e9, metalness: 0.92, roughness: 0.08, clearcoat: 1.0 });
      const ped = new THREE.Mesh(pedGeo, pedMat);
      ped.position.set(i * 18, 0.75, 0);
      this.objects.projectsPod.add(ped);

      const holoGeo = new THREE.BoxGeometry(5, 7, 0.4);
      const holoMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
        roughness: 0.04,
        metalness: 0.88,
        transmission: 0.45,
        clearcoat: 1.0
      });
      const holo = new THREE.Mesh(holoGeo, holoMat);
      holo.position.set(i * 18, 5.5, 0);
      this.objects.projectsPod.add(holo);
    }
    this.objects.projectsPod.position.set(0, 0, -120);
    this.scene.add(this.objects.projectsPod);

    // 4. Pod 4: Skills Reactor Core (Stage 4)
    this.objects.skillsPod = new THREE.Group();
    const reactorGeo = new THREE.TorusGeometry(12, 0.6, 24, 96);
    const reactorMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.75,
      roughness: 0.06,
      metalness: 0.88,
      clearcoat: 1.0
    });
    const reactor = new THREE.Mesh(reactorGeo, reactorMat);
    reactor.rotation.x = Math.PI / 2.5;
    reactor.position.y = 6;
    this.objects.skillsPod.add(reactor);

    this.objects.skillsPod.position.set(0, 0, -180);
    this.scene.add(this.objects.skillsPod);

    // 5. Pod 5: Communications Uplink (Stage 5)
    this.objects.uplinkPod = new THREE.Group();
    const towerGeo = new THREE.CylinderGeometry(0.5, 2.5, 16, 24);
    const towerMat = new THREE.MeshPhysicalMaterial({
      color: 0xec4899,
      emissive: 0xbe185d,
      emissiveIntensity: 0.75,
      roughness: 0.06,
      metalness: 0.88,
      clearcoat: 1.0
    });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 8;
    this.objects.uplinkPod.add(tower);

    this.objects.uplinkPod.position.set(0, 0, -240);
    this.scene.add(this.objects.uplinkPod);
  }

  initShards() {
    const shardGeo = new THREE.OctahedronGeometry(1.2);
    const shardMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.0,
      roughness: 0.04,
      metalness: 0.95,
      clearcoat: 1.0
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

    // WASD Driving Controls
    window.addEventListener('keydown', (e) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) this.keys.up = true;
      if (['KeyS', 'ArrowDown'].includes(e.code)) this.keys.down = true;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) this.keys.left = true;
      if (['KeyD', 'ArrowRight'].includes(e.code)) this.keys.right = true;

      // Auto-switch to manual driving mode when pressing movement keys
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

      this.rover.x = Math.max(-32, Math.min(32, this.rover.x));
      this.rover.z = Math.max(-255, Math.min(25, this.rover.z));
    }

    if (this.rover.mesh) {
      this.rover.mesh.position.set(this.rover.x, this.rover.y, this.rover.z);
      this.rover.mesh.rotation.y = this.rover.angle + Math.PI / 2;

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

    // Draw Rover Blip
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

    const time = Date.now() * 0.0015;

    // 1. Procedural Liquid Wave Ripple on Quantum Core
    if (this.objects.liquidCore) {
      const positions = this.objects.liquidCore.geometry.attributes.position.array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const bx = this.basePositions[i3];
        const by = this.basePositions[i3 + 1];
        const bz = this.basePositions[i3 + 2];

        const wave1 = Math.sin(bx * 0.5 + time * 2.0) * 0.35;
        const wave2 = Math.cos(by * 0.6 + time * 1.8) * 0.35;
        const wave3 = Math.sin(bz * 0.4 + (bx + by) * 0.3 + time * 2.2) * 0.3;

        const displacement = 1 + (wave1 + wave2 + wave3) * 0.12;

        positions[i3] = bx * displacement;
        positions[i3 + 1] = by * displacement;
        positions[i3 + 2] = bz * displacement;
      }

      this.objects.liquidCore.geometry.attributes.position.needsUpdate = true;
      this.objects.liquidCore.geometry.computeVertexNormals();

      this.objects.liquidCore.rotation.y = time * 0.25;
      this.objects.liquidCore.rotation.x = time * 0.15;
    }

    if (this.objects.ring1) this.objects.ring1.rotation.z = time * 0.35;
    if (this.objects.skillsPod) this.objects.skillsPod.rotation.y = time * 0.35;
    if (this.objects.uplinkPod) this.objects.uplinkPod.rotation.y = time * 0.4;
    if (this.objects.wireframeTerrain) {
      this.objects.wireframeTerrain.position.z = -120 + ((time * 12) % 6);
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
  window.cyberLab = new MotionSitesCyberLab('webgl-canvas');
};
