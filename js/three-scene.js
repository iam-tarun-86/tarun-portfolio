/**
 * MotionSites.ai-Grade Photorealistic 3D Spatial Scene Engine
 * Features:
 * - Organic Morphing Liquid-Chrome / Iridescent Glass Neural Core (Procedural Noise Wave Displacement)
 * - Photorealistic MeshPhysicalMaterial with Glass Transmission, High Clearcoat, & Iridescent Rim Sheen
 * - Orbiting Refractive Glass Rings & Floating Liquid Orbs
 * - 3-Point Cinematic Studio Rim Lighting Setup
 * - Atmospheric Soft-Focus Stardust Particles & Diffused Ambient Glow
 * - Buttery Smooth Gyroscopic Cursor Parallax
 */

class MotionSitesUniverse {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    if (typeof THREE === 'undefined') {
      setTimeout(() => new MotionSitesUniverse(canvasId), 100);
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // Mouse & Scroll State
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.scrollTarget = 0;

    this.objects = {};
    this.basePositions = [];

    this.initLights();
    this.initBackgroundParticles();
    this.initPhotorealisticLiquidCore();
    this.initSecondaryOrbs();
    this.initAgentNodes();
    this.bindEvents();

    this.camera.position.set(0, 0, 36);

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    // 1. Ambient Baseline
    const ambient = new THREE.AmbientLight(0x0f172a, 1.2);
    this.scene.add(ambient);

    // 2. Key Light (Vibrant Purple-Violet)
    this.objects.keyLight = new THREE.DirectionalLight(0xa855f7, 4.5);
    this.objects.keyLight.position.set(25, 20, 30);
    this.scene.add(this.objects.keyLight);

    // 3. Fill Light (Neon Cyan)
    this.objects.fillLight = new THREE.PointLight(0x06b6d4, 5.0, 80);
    this.objects.fillLight.position.set(-20, -15, 20);
    this.scene.add(this.objects.fillLight);

    // 4. Rim Light (Emerald-Gold for Razor-Sharp Gloss Edges)
    this.objects.rimLight = new THREE.PointLight(0x10b981, 4.0, 70);
    this.objects.rimLight.position.set(10, -25, -15);
    this.scene.add(this.objects.rimLight);

    // 5. Top Highlight
    const topLight = new THREE.PointLight(0xffffff, 2.5, 60);
    topLight.position.set(0, 30, 15);
    this.scene.add(topLight);
  }

  initBackgroundParticles() {
    const count = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 450;
      positions[i + 1] = (Math.random() - 0.5) * 450;
      positions[i + 2] = (Math.random() - 0.5) * 500;

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
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.objects.dust = new THREE.Points(geometry, material);
    this.scene.add(this.objects.dust);
  }

  initPhotorealisticLiquidCore() {
    this.objects.coreGroup = new THREE.Group();

    // High-Poly Deformable Sphere
    const sphereGeo = new THREE.SphereGeometry(7.5, 96, 96);
    this.basePositions = sphereGeo.attributes.position.array.slice();

    // Photorealistic Iridescent Liquid Glass Material
    const liquidGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.35,
      roughness: 0.08,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transmission: 0.3,
      ior: 1.55,
      reflectivity: 0.95
    });

    this.objects.liquidCore = new THREE.Mesh(sphereGeo, liquidGlassMat);
    this.objects.coreGroup.add(this.objects.liquidCore);

    // Inner Glowing Energy Core
    const innerGeo = new THREE.IcosahedronGeometry(4.0, 3);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.9
    });
    this.objects.innerCore = new THREE.Mesh(innerGeo, innerMat);
    this.objects.coreGroup.add(this.objects.innerCore);

    // Refractive Orbiting Torus Ring (Iridescent Glass)
    const ringGeo = new THREE.TorusGeometry(12.5, 0.4, 32, 128);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      roughness: 0.05,
      metalness: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });
    this.objects.ring1 = new THREE.Mesh(ringGeo, ringMat);
    this.objects.ring1.rotation.x = Math.PI / 3;
    this.objects.coreGroup.add(this.objects.ring1);

    // Secondary Outer Ring
    const ringGeo2 = new THREE.TorusGeometry(15, 0.25, 24, 128);
    const ringMat2 = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.8
    });
    this.objects.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.objects.ring2.rotation.y = Math.PI / 3;
    this.objects.coreGroup.add(this.objects.ring2);

    // Position in right stage
    const isMobile = window.innerWidth <= 1024;
    this.objects.coreGroup.position.set(isMobile ? 0 : 15, isMobile ? 8 : 1, 0);
    this.scene.add(this.objects.coreGroup);
  }

  initSecondaryOrbs() {
    this.objects.floatingOrbs = [];
    const orbGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.8,
      roughness: 0.05,
      metalness: 0.9,
      clearcoat: 1.0
    });

    const offsets = [
      { r: 16, speed: 0.8, yOffset: 3 },
      { r: 19, speed: -0.6, yOffset: -4 },
      { r: 22, speed: 0.5, yOffset: 1 }
    ];

    offsets.forEach((conf) => {
      const orb = new THREE.Mesh(orbGeo, orbMat);
      this.objects.coreGroup.add(orb);
      this.objects.floatingOrbs.push({ mesh: orb, ...conf, angle: Math.random() * Math.PI * 2 });
    });
  }

  initAgentNodes() {
    this.objects.agentGroup = new THREE.Group();

    // Node 1: Ingest (Reflective Cyan Rounded Cube)
    const n1Geo = new THREE.BoxGeometry(3.8, 3.8, 3.8);
    const n1Mat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.85,
      clearcoat: 1.0
    });
    this.objects.node1 = new THREE.Mesh(n1Geo, n1Mat);
    this.objects.node1.position.set(-18, -55, -15);
    this.objects.agentGroup.add(this.objects.node1);

    // Node 2: Classify (Iridescent Purple Octahedron)
    const n2Geo = new THREE.OctahedronGeometry(4.2, 0);
    const n2Mat = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.85,
      clearcoat: 1.0
    });
    this.objects.node2 = new THREE.Mesh(n2Geo, n2Mat);
    this.objects.node2.position.set(0, -55, -15);
    this.objects.agentGroup.add(this.objects.node2);

    // Node 3: Route (Glossy Emerald Prism)
    const n3Geo = new THREE.ConeGeometry(3.5, 6, 6);
    const n3Mat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.85,
      clearcoat: 1.0
    });
    this.objects.node3 = new THREE.Mesh(n3Geo, n3Mat);
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
        this.objects.coreGroup.position.set(isMobile ? 0 : 15, isMobile ? 8 : 1, 0);
      }
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  setScrollProgress(progress) {
    this.scrollTarget = progress;
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Smooth Cursor & Scroll Physics
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    this.scrollProgress += (this.scrollTarget - this.scrollProgress) * 0.08;

    const time = Date.now() * 0.0015;

    // 1. Procedural Liquid Wave Deformation on High-Poly Sphere
    if (this.objects.liquidCore) {
      const positions = this.objects.liquidCore.geometry.attributes.position.array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const bx = this.basePositions[i3];
        const by = this.basePositions[i3 + 1];
        const bz = this.basePositions[i3 + 2];

        // Complex multi-frequency noise ripple
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

    // 2. Rotate Inner Core & Rings
    if (this.objects.innerCore) {
      this.objects.innerCore.rotation.y = -time * 0.5;
      this.objects.innerCore.rotation.z = time * 0.3;
    }
    if (this.objects.ring1) {
      this.objects.ring1.rotation.z = time * 0.35;
    }
    if (this.objects.ring2) {
      this.objects.ring2.rotation.z = -time * 0.25;
      this.objects.ring2.rotation.x = Math.PI / 4 + Math.sin(time * 0.5) * 0.2;
    }

    // 3. Animate Orbiting Secondary Liquid Orbs
    if (this.objects.floatingOrbs) {
      this.objects.floatingOrbs.forEach(orb => {
        orb.angle += orb.speed * 0.02;
        orb.mesh.position.x = Math.cos(orb.angle) * orb.r;
        orb.mesh.position.z = Math.sin(orb.angle) * orb.r * 0.6;
        orb.mesh.position.y = orb.yOffset + Math.sin(time * 2 + orb.r) * 1.2;
      });
    }

    // 4. Subtle Parallax on Core Group
    if (this.objects.coreGroup) {
      this.objects.coreGroup.rotation.y = this.mouse.x * 0.35;
      this.objects.coreGroup.rotation.x = -this.mouse.y * 0.25;
    }

    // 5. Rotate Agent Nodes
    if (this.objects.node1) this.objects.node1.rotation.y = time * 0.6;
    if (this.objects.node2) this.objects.node2.rotation.x = time * 0.6;
    if (this.objects.node3) this.objects.node3.rotation.z = time * 0.6;

    // 6. Camera Cinematic Fly-Through along Scroll Z-axis
    const p = this.scrollProgress;
    const camX = Math.sin(p * Math.PI * 1.5) * 4 + this.mouse.x * 2.0;
    const camY = -p * 160 + this.mouse.y * 2.0;
    const camZ = 36 - p * 18;

    this.camera.position.x = camX;
    this.camera.position.y = camY;
    this.camera.position.z = camZ;

    this.camera.rotation.y = -this.mouse.x * 0.1;
    this.camera.rotation.x = this.mouse.y * 0.06;

    this.renderer.render(this.scene, this.camera);
  }
}

window.initSpatialUniverse = function() {
  window.spatialUniverse = new MotionSitesUniverse('webgl-canvas');
};
