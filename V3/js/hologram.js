/* ═══════════════════════════════════════════════════════════════
   COMPANION V3 — Holographic Visualization Engine
   Three.js particle-based humanoid hologram that materializes
   when personas are summoned.
   ═══════════════════════════════════════════════════════════════ */

var COMPANION = window.COMPANION || {};

COMPANION.Hologram = (function () {

  // ── Configuration ──
  const PARTICLE_COUNT = 4000;
  const MATERIALIZE_DURATION = 2.5;  // seconds
  const DEMATERIALIZE_DURATION = 1.5;
  const IDLE_FLOAT_SPEED = 0.3;
  const IDLE_FLOAT_AMOUNT = 0.02;
  const SPEAK_JITTER = 0.015;
  const BREATHE_SPEED = 1.2;
  const BREATHE_AMOUNT = 0.008;

  let scene, camera, renderer, clock;
  let container;
  let personas = {};  // name -> persona object
  let animationFrameId;
  let isInitialized = false;

  // ── Humanoid Point Cloud Generation ──

  /**
   * Generate points distributed on a humanoid silhouette.
   * Returns Float32Array of [x, y, z, ...] positions.
   */
  function generateHumanoidPoints(count) {
    const positions = new Float32Array(count * 3);

    // Body part probabilities and geometry
    const parts = [
      { name: 'head',       weight: 0.14, gen: genHead },
      { name: 'neck',       weight: 0.03, gen: genNeck },
      { name: 'torso',      weight: 0.28, gen: genTorso },
      { name: 'leftArm',    weight: 0.11, gen: genLeftArm },
      { name: 'rightArm',   weight: 0.11, gen: genRightArm },
      { name: 'leftLeg',    weight: 0.16, gen: genLeftLeg },
      { name: 'rightLeg',   weight: 0.16, gen: genRightLeg },
      { name: 'aura',       weight: 0.01, gen: genAura }
    ];

    // Build cumulative weights
    let cumulative = 0;
    const ranges = parts.map(p => {
      cumulative += p.weight;
      return { ...p, cumMax: cumulative };
    });

    for (let i = 0; i < count; i++) {
      const r = Math.random();
      let point = [0, 0, 0];

      for (const range of ranges) {
        if (r <= range.cumMax) {
          point = range.gen();
          break;
        }
      }

      positions[i * 3]     = point[0];
      positions[i * 3 + 1] = point[1];
      positions[i * 3 + 2] = point[2];
    }

    return positions;
  }

  // Body part generators - return [x, y, z]
  // Figure centered at origin, head at ~y=1.7, feet at ~y=0

  function genHead() {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.11 * (0.85 + Math.random() * 0.15);
    return [
      r * Math.sin(phi) * Math.cos(theta),
      1.68 + r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    ];
  }

  function genNeck() {
    const theta = Math.random() * Math.PI * 2;
    const r = 0.04 * (0.8 + Math.random() * 0.2);
    const y = 1.52 + Math.random() * 0.06;
    return [r * Math.cos(theta), y, r * Math.sin(theta)];
  }

  function genTorso() {
    const y = 1.0 + Math.random() * 0.52;
    const t = (y - 1.0) / 0.52; // 0 at waist, 1 at shoulders
    const widthX = 0.12 + t * 0.1; // wider at shoulders
    const widthZ = 0.08 + t * 0.04;
    const x = (Math.random() - 0.5) * 2 * widthX;
    const z = (Math.random() - 0.5) * 2 * widthZ;
    // Surface bias
    const dist = Math.sqrt((x / widthX) ** 2 + (z / widthZ) ** 2);
    if (dist < 0.6 && Math.random() > 0.3) {
      const scale = (0.6 + Math.random() * 0.4) / Math.max(dist, 0.01);
      return [x * scale, y, z * scale];
    }
    return [x, y, z];
  }

  function genLeftArm() {
    const t = Math.random();
    const y = 1.48 - t * 0.55;
    const baseX = -(0.22 + t * 0.08);
    const r = 0.035 * (0.8 + Math.random() * 0.2);
    const theta = Math.random() * Math.PI * 2;
    return [baseX + r * Math.cos(theta), y, r * Math.sin(theta)];
  }

  function genRightArm() {
    const t = Math.random();
    const y = 1.48 - t * 0.55;
    const baseX = 0.22 + t * 0.08;
    const r = 0.035 * (0.8 + Math.random() * 0.2);
    const theta = Math.random() * Math.PI * 2;
    return [baseX + r * Math.cos(theta), y, r * Math.sin(theta)];
  }

  function genLeftLeg() {
    const t = Math.random();
    const y = 1.0 - t * 0.95;
    const baseX = -(0.08 + (1 - t) * 0.02);
    const r = 0.045 * (0.8 + Math.random() * 0.2);
    const theta = Math.random() * Math.PI * 2;
    return [baseX + r * Math.cos(theta), y + 0.05, r * Math.sin(theta)];
  }

  function genRightLeg() {
    const t = Math.random();
    const y = 1.0 - t * 0.95;
    const baseX = 0.08 + (1 - t) * 0.02;
    const r = 0.045 * (0.8 + Math.random() * 0.2);
    const theta = Math.random() * Math.PI * 2;
    return [baseX + r * Math.cos(theta), y + 0.05, r * Math.sin(theta)];
  }

  function genAura() {
    // Floating particles around the figure
    const theta = Math.random() * Math.PI * 2;
    const y = Math.random() * 1.8;
    const r = 0.35 + Math.random() * 0.2;
    return [r * Math.cos(theta), y, r * Math.sin(theta)];
  }


  // ── Scene Setup ──

  function init(containerElement) {
    if (isInitialized) return;
    container = containerElement;

    // Scene
    scene = new THREE.Scene();

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 1.0, 3.0);
    camera.lookAt(0, 0.9, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('hologram-canvas'),
      antialias: true,
      alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Clock
    clock = new THREE.Clock();

    // Ambient particle field (background atmosphere)
    createAmbientField();

    // Handle resize
    window.addEventListener('resize', onResize);

    isInitialized = true;

    // Start render loop
    animate();
  }

  function onResize() {
    if (!container || !camera || !renderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function createAmbientField() {
    const count = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.008,
      color: 0xc9a54e,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    points.userData.isAmbient = true;
    scene.add(points);
  }


  // ── Persona Management ──

  /**
   * Summon a new holographic persona.
   * @param {string} name - The persona's name.
   * @param {string} color - Hex color string.
   */
  function summon(name, color) {
    if (personas[name]) return; // Already exists

    const colorObj = new THREE.Color(color);
    const particleCount = PARTICLE_COUNT;

    // Target positions (humanoid shape)
    const targetPositions = generateHumanoidPoints(particleCount);

    // Initial positions (scattered randomly)
    const initialPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.5 + Math.random() * 2;
      initialPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      initialPositions[i * 3 + 1] = Math.random() * 3;
      initialPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    // Current positions start at initial
    const currentPositions = new Float32Array(initialPositions);

    // Per-particle sizes (slight variation)
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      sizes[i] = 0.012 + Math.random() * 0.012;
    }

    // Geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.018,
      color: colorObj,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);

    // Offset for multiple personas (side by side)
    const personaCount = Object.keys(personas).length;
    const xOffset = getPersonaOffset(personaCount, Object.keys(personas).length + 1);

    // Reposition existing personas
    repositionPersonas(Object.keys(personas).length + 1);

    points.position.x = xOffset;
    scene.add(points);

    personas[name] = {
      points,
      geometry,
      material,
      targetPositions,
      initialPositions,
      currentPositions,
      color: colorObj,
      state: 'materializing',  // materializing, idle, speaking, dematerializing
      stateTime: 0,
      speaking: false,
      xOffset
    };
  }

  /**
   * Calculate x-offset for persona positioning.
   */
  function getPersonaOffset(index, total) {
    if (total <= 1) return 0;
    const spacing = Math.min(1.2, 2.4 / total);
    const totalWidth = (total - 1) * spacing;
    return -totalWidth / 2 + index * spacing;
  }

  /**
   * Reposition all existing personas when a new one joins or one leaves.
   */
  function repositionPersonas(newTotal) {
    const names = Object.keys(personas);
    names.forEach((name, i) => {
      const offset = getPersonaOffset(i, newTotal);
      personas[name].xOffset = offset;
      // Smooth transition handled in animate()
    });
  }

  /**
   * Release (dematerialize) a persona.
   */
  function release(name) {
    const persona = personas[name];
    if (!persona) return;

    persona.state = 'dematerializing';
    persona.stateTime = 0;
  }

  /**
   * Release all personas.
   */
  function releaseAll() {
    Object.keys(personas).forEach(name => release(name));
  }

  /**
   * Set whether a persona is currently speaking.
   */
  function setSpeaking(name, isSpeaking) {
    const persona = personas[name];
    if (!persona) return;
    if (persona.state === 'idle' || persona.state === 'speaking') {
      persona.state = isSpeaking ? 'speaking' : 'idle';
      persona.speaking = isSpeaking;
    }
  }

  /**
   * Set all personas to not speaking.
   */
  function clearSpeaking() {
    Object.values(personas).forEach(p => {
      if (p.state === 'speaking') {
        p.state = 'idle';
        p.speaking = false;
      }
    });
  }


  // ── Animation Loop ──

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Update each persona
    for (const [name, persona] of Object.entries(personas)) {
      persona.stateTime += delta;
      updatePersona(persona, name, delta, elapsed);
    }

    // Update ambient field
    updateAmbientField(elapsed);

    // Render
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function updatePersona(persona, name, delta, elapsed) {
    const positions = persona.currentPositions;
    const targets = persona.targetPositions;
    const initials = persona.initialPositions;
    const count = positions.length / 3;

    switch (persona.state) {

      case 'materializing': {
        const progress = Math.min(persona.stateTime / MATERIALIZE_DURATION, 1);
        const eased = easeOutCubic(progress);

        // Opacity ramp
        persona.material.opacity = eased * 0.75;

        // Lerp positions from initial to target
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          // Stagger: particles higher up materialize slightly later
          const particleDelay = (targets[i3 + 1] / 2.0) * 0.3;
          const particleProgress = Math.max(0, Math.min(1, (progress - particleDelay) / (1 - particleDelay)));
          const pe = easeOutCubic(particleProgress);

          positions[i3]     = initials[i3]     + (targets[i3]     - initials[i3])     * pe;
          positions[i3 + 1] = initials[i3 + 1] + (targets[i3 + 1] - initials[i3 + 1]) * pe;
          positions[i3 + 2] = initials[i3 + 2] + (targets[i3 + 2] - initials[i3 + 2]) * pe;
        }

        if (progress >= 1) {
          persona.state = 'idle';
          persona.stateTime = 0;
        }
        break;
      }

      case 'idle': {
        persona.material.opacity = 0.65 + Math.sin(elapsed * BREATHE_SPEED) * 0.1;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const floatOffset = Math.sin(elapsed * IDLE_FLOAT_SPEED + i * 0.01) * IDLE_FLOAT_AMOUNT;
          const breatheOffset = Math.sin(elapsed * BREATHE_SPEED) * BREATHE_AMOUNT;

          positions[i3]     = targets[i3]     + Math.sin(elapsed * 0.5 + i) * 0.002;
          positions[i3 + 1] = targets[i3 + 1] + floatOffset + breatheOffset;
          positions[i3 + 2] = targets[i3 + 2] + Math.cos(elapsed * 0.5 + i) * 0.002;
        }
        break;
      }

      case 'speaking': {
        persona.material.opacity = 0.75 + Math.sin(elapsed * 3) * 0.1;

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const jitter = SPEAK_JITTER;
          const floatOffset = Math.sin(elapsed * IDLE_FLOAT_SPEED + i * 0.01) * IDLE_FLOAT_AMOUNT;

          // Head area has more movement when speaking
          const isHead = targets[i3 + 1] > 1.55;
          const speakMult = isHead ? 2.5 : 1.0;

          positions[i3]     = targets[i3]     + (Math.random() - 0.5) * jitter * speakMult;
          positions[i3 + 1] = targets[i3 + 1] + floatOffset + (Math.random() - 0.5) * jitter * speakMult;
          positions[i3 + 2] = targets[i3 + 2] + (Math.random() - 0.5) * jitter * speakMult;
        }

        // Pulsing glow effect via size
        persona.material.size = 0.018 + Math.sin(elapsed * 4) * 0.004;
        break;
      }

      case 'dematerializing': {
        const progress = Math.min(persona.stateTime / DEMATERIALIZE_DURATION, 1);
        const eased = easeInCubic(progress);

        persona.material.opacity = (1 - eased) * 0.75;

        // Scatter outward
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const dx = positions[i3] - 0;
          const dy = positions[i3 + 1] - 0.85;
          const dz = positions[i3 + 2] - 0;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.01;

          positions[i3]     += (dx / dist) * eased * delta * 2;
          positions[i3 + 1] += (dy / dist) * eased * delta * 2 + delta * eased;
          positions[i3 + 2] += (dz / dist) * eased * delta * 2;
        }

        if (progress >= 1) {
          // Remove from scene
          scene.remove(persona.points);
          persona.geometry.dispose();
          persona.material.dispose();
          delete personas[name];

          // Reposition remaining
          repositionPersonas(Object.keys(personas).length);
        }
        break;
      }
    }

    // Update geometry
    if (persona.geometry) {
      persona.geometry.attributes.position.needsUpdate = true;
    }

    // Smooth position offset transition
    if (persona.points) {
      persona.points.position.x += (persona.xOffset - persona.points.position.x) * 0.05;
    }
  }

  function updateAmbientField(elapsed) {
    scene.children.forEach(child => {
      if (child.userData.isAmbient) {
        const positions = child.geometry.attributes.position.array;
        const count = positions.length / 3;
        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] += Math.sin(elapsed * 0.2 + i) * 0.0003;
        }
        child.geometry.attributes.position.needsUpdate = true;

        // Brighten ambient when personas are present
        const hasPersonas = Object.keys(personas).length > 0;
        const targetOpacity = hasPersonas ? 0.25 : 0.15;
        child.material.opacity += (targetOpacity - child.material.opacity) * 0.02;
      }
    });
  }


  // ── Easing Functions ──

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInCubic(t) {
    return t * t * t;
  }


  // ── Cleanup ──

  function destroy() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('resize', onResize);

    Object.values(personas).forEach(p => {
      scene.remove(p.points);
      p.geometry.dispose();
      p.material.dispose();
    });
    personas = {};

    if (renderer) {
      renderer.dispose();
    }

    isInitialized = false;
  }


  // ── Query ──

  function getActivePersonas() {
    return Object.keys(personas).filter(
      name => personas[name].state !== 'dematerializing'
    );
  }

  function hasPersona(name) {
    return !!personas[name] && personas[name].state !== 'dematerializing';
  }


  // ── Public API ──
  return {
    init,
    summon,
    release,
    releaseAll,
    setSpeaking,
    clearSpeaking,
    getActivePersonas,
    hasPersona,
    destroy
  };

})();
