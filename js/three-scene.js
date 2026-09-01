/**
 * Three.js 3D Spatial Scene Engine (Ultra High-Impact & Zero Text Collisions)
 * Features:
 * - Glowing 3D Holographic Quantum AI Core positioned in the dedicated right stage
 * - 2,500 3D Starfield Particles swirling in real-time
 * - 3 Floating 3D Agent Nodes with pulsing neon laser conduits
 * - Interactive Mouse Drag & Parallax rotation
 * - Cinematic Camera Fly-Through on scroll
 */

class SpatialUniverse {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    if (typeof THREE === 'undefined') {
      setTimeout(() => new SpatialUniverse(canvasId), 100);
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Interaction State
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.manualRotation = { x: 0, y: 0 };

    this.scrollProgress = 0;
    this.scrollTarget = 0;

    // 3D Objects Storage
    this.objects = {};

    this.initScene();
    this.bindEvents();

    this.camera.position.set(0, 0, 38);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initScene() {
    // 1. Ambient & Point Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);

    const purpleLight = new THREE.PointLight(0xa855f7, 4.5, 120);
    purpleLight.position.set(20, 15, 25);
    this.scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 4.5, 120);
    cyanLight.position.set(-10, -15, 25);
    this.scene.add(cyanLight);

    const greenLight = new THREE.PointLight(0x10b981, 3, 80);
    greenLight.position.set(0, -25, -10);
    this.scene.add(greenLight);

    // 2. Swirling 3D Particle Starfield
    const starCount = 2500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 500;
      starPositions[i + 1] = (Math.random() - 0.5) * 500;
      starPositions[i + 2] = (Math.random() - 0.5) * 600;

      const p = Math.random();
      if (p > 0.6) {
        starColors[i] = 0.65; starColors[i + 1] = 0.33; starColors[i + 2] = 0.96; // Purple
      } else if (p > 0.3) {
        starColors[i] = 0.02; starColors[i + 1] = 0.71; starColors[i + 2] = 0.83; // Cyan
      } else {
        starColors[i] = 0.06; starColors[i + 1] = 0.73; starColors[i + 2] = 0.51; // Emerald
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.objects.stars = new THREE.Points(starGeo, starMat);
    this.scene.add(this.objects.stars);

    // 3. Central 3D Holographic AI Neural Core Group
    this.objects.coreGroup = new THREE.Group();

    // Outer 1: Wireframe Icosahedron
    const outerGeo1 = new THREE.IcosahedronGeometry(9, 1);
    const outerMat1 = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.7
    });
    this.objects.outer1 = new THREE.Mesh(outerGeo1, outerMat1);
    this.objects.coreGroup.add(this.objects.outer1);

    // Outer 2: Outer Octahedron Cage
    const outerGeo2 = new THREE.OctahedronGeometry(12, 0);
    const outerMat2 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    this.objects.outer2 = new THREE.Mesh(outerGeo2, outerMat2);
    this.objects.coreGroup.add(this.objects.outer2);

    // Inner Crystalline Core
    const innerGeo = new THREE.DodecahedronGeometry(4.5, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.85
    });
    this.objects.innerCore = new THREE.Mesh(innerGeo, innerMat);
    this.objects.coreGroup.add(this.objects.innerCore);

    // Double Orbiting Rings
    const ringGeo1 = new THREE.TorusGeometry(14, 0.25, 16, 80);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true });
    this.objects.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.objects.ring1.rotation.x = Math.PI / 3;
    this.objects.coreGroup.add(this.objects.ring1);

    const ringGeo2 = new THREE.TorusGeometry(16, 0.25, 16, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    this.objects.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.objects.ring2.rotation.y = Math.PI / 3;
    this.objects.coreGroup.add(this.objects.ring2);

    // Position in 3D Space (Centered cleanly in Right Half of Viewport)
    const isMobile = window.innerWidth <= 1024;
    this.objects.coreGroup.position.set(isMobile ? 0 : 15, isMobile ? 12 : 2, isMobile ? -10 : 4);
    this.scene.add(this.objects.coreGroup);

    // 4. Floating 3D Agent Nodes (Stage 2)
    this.objects.agentGroup = new THREE.Group();

    const boxGeo = new THREE.BoxGeometry(4, 4, 4);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, wireframe: true, emissive: 0x0284c7, emissiveIntensity: 0.6 });
    this.objects.node1 = new THREE.Mesh(boxGeo, boxMat);
    this.objects.node1.position.set(-18, -55, -15);
    this.objects.agentGroup.add(this.objects.node1);

    const octGeo = new THREE.OctahedronGeometry(4);
    const octMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, wireframe: true, emissive: 0x7c3aed, emissiveIntensity: 0.6 });
    this.objects.node2 = new THREE.Mesh(octGeo, octMat);
    this.objects.node2.position.set(0, -55, -15);
    this.objects.agentGroup.add(this.objects.node2);

    const coneGeo = new THREE.ConeGeometry(3.5, 6, 4);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x10b981, wireframe: true, emissive: 0x059669, emissiveIntensity: 0.6 });
    this.objects.node3 = new THREE.Mesh(coneGeo, coneMat);
    this.objects.node3.position.set(18, -55, -15);
    this.objects.agentGroup.add(this.objects.node3);

    this.scene.add(this.objects.agentGroup);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      if (this.objects.coreGroup) {
        const isMobile = window.innerWidth <= 1024;
        this.objects.coreGroup.position.set(isMobile ? 0 : 15, isMobile ? 12 : 2, isMobile ? -10 : 4);
      }
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;
        this.manualRotation.y += deltaX * 0.008;
        this.manualRotation.x += deltaY * 0.008;
      }
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }

  setScrollProgress(progress) {
    this.scrollTarget = progress;
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Smooth Lerps
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;
    this.scrollProgress += (this.scrollTarget - this.scrollProgress) * 0.08;

    const time = Date.now() * 0.0012;

    // 1. Rotate Starfield
    if (this.objects.stars) {
      this.objects.stars.rotation.y = time * 0.03;
      this.objects.stars.rotation.x = time * 0.01;
    }

    // 2. Rotate Neural Core Layers
    if (this.objects.coreGroup) {
      this.objects.outer1.rotation.y = time * 0.3 + this.manualRotation.y;
      this.objects.outer1.rotation.x = time * 0.2 + this.manualRotation.x;

      this.objects.outer2.rotation.y = -time * 0.2 + this.manualRotation.y;
      this.objects.outer2.rotation.z = time * 0.25;

      this.objects.innerCore.rotation.y = time * 0.5;
      this.objects.innerCore.rotation.x = -time * 0.4;

      this.objects.ring1.rotation.z = time * 0.4;
      this.objects.ring2.rotation.z = -time * 0.35;

      // Subtle breathing pulse
      const pulse = 1 + Math.sin(time * 2) * 0.04;
      this.objects.innerCore.scale.set(pulse, pulse, pulse);
    }

    // 3. Rotate Agent Nodes
    if (this.objects.node1) this.objects.node1.rotation.y = time * 0.6;
    if (this.objects.node2) this.objects.node2.rotation.x = time * 0.6;
    if (this.objects.node3) this.objects.node3.rotation.z = time * 0.6;

    // 4. Camera Waypoint Math along Scroll Z-axis
    const p = this.scrollProgress;

    const camX = Math.sin(p * Math.PI * 1.5) * 4 + this.mouse.x * 2.0;
    const camY = -p * 160 + this.mouse.y * 2.0;
    const camZ = 38 - p * 18;

    this.camera.position.x = camX;
    this.camera.position.y = camY;
    this.camera.position.z = camZ;

    this.camera.rotation.y = -this.mouse.x * 0.1;
    this.camera.rotation.x = this.mouse.y * 0.06;

    this.renderer.render(this.scene, this.camera);
  }
}

window.initSpatialUniverse = function() {
  window.spatialUniverse = new SpatialUniverse('webgl-canvas');
};
