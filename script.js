/**
 * BEYOND THE DOOR — Muskan's Magical Interactive Portfolio
 * Scene 1: The Mysterious Door Opening Sequence
 * Scene 2 & 3: Three.js 3D Floating Fantasy Island & Five Destinations
 * Lightbox, Easter Eggs, Ambient Audio & Magical Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. STATE & PROGRESS TRACKING
  // =========================================================================
  const state = {
    visitedDestinations: new Set(),
    collectedStars: new Set(),
    currentModal: null,
    audioEnabled: false,
    audioCtx: null,
    doorOpened: false
  };

  const updateProgressHUD = () => {
    const textEl = document.getElementById('hud-progress-text');
    if (textEl) {
      textEl.textContent = `Explored ${state.visitedDestinations.size}/5`;
    }
  };

  const updateStarsHUD = () => {
    const textEl = document.getElementById('hud-stars-text');
    if (textEl) {
      textEl.textContent = `${state.collectedStars.size}/3`;
    }
  };

  // =========================================================================
  // 2. SCENE 1: THE MYSTERIOUS DOOR (INTERACTIVE CINEMATIC OPENING)
  // =========================================================================
  const sceneDoor = document.getElementById('scene-door');
  const doorLeaf = document.getElementById('door-leaf');
  const doorHandle = document.getElementById('door-handle');
  const doorLightBeam = document.getElementById('door-light-beam');
  const doorFrame = document.getElementById('magical-door-frame');
  const btnOpenDoor = document.getElementById('btn-open-door');
  const btnSkipDoor = document.getElementById('btn-skip-door');

  // Spawn floating dust particles in door scene
  const doorParticlesField = document.getElementById('door-particles');
  if (doorParticlesField) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('span');
      const size = 5 + Math.random() * 12;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      doorParticlesField.appendChild(p);
    }
  }

  const openTheDoor = () => {
    if (state.doorOpened) return;
    state.doorOpened = true;

    // 1. Move door handle lever
    if (doorHandle) doorHandle.classList.add('handle-pressed');

    // 2. Swing door leaf open inward & pour warm radiant light
    setTimeout(() => {
      if (doorLeaf) doorLeaf.classList.add('door-open');
      if (doorFrame) doorFrame.classList.add('opened');
      if (doorLightBeam) doorLightBeam.style.opacity = '1';

      // 3. Play ethereal entrance chime
      triggerChimeNote(440); // A4
      setTimeout(() => triggerChimeNote(554.37), 180); // C#5
      setTimeout(() => triggerChimeNote(659.25), 360); // E5

      // 4. Camera zooms forward through doorway into 3D world
      setTimeout(() => {
        if (sceneDoor) {
          sceneDoor.classList.add('opened-and-entered');
          setTimeout(() => {
            sceneDoor.style.display = 'none';
          }, 1250);
        }

        // Three.js camera dive into the floating island
        if (camera) {
          const targetPos = { x: 24, y: 22, z: 28 };
          let step = 0;
          const totalSteps = 60;
          const diveIn = () => {
            if (step < totalSteps) {
              step++;
              camera.position.x += (targetPos.x - camera.position.x) * 0.08;
              camera.position.y += (targetPos.y - camera.position.y) * 0.08;
              camera.position.z += (targetPos.z - camera.position.z) * 0.08;
              requestAnimationFrame(diveIn);
            }
          };
          diveIn();
        }
      }, 1000);
    }, 250);
  };

  const skipTheDoor = () => {
    if (state.doorOpened) return;
    state.doorOpened = true;

    if (sceneDoor) {
      sceneDoor.style.display = 'none';
    }
    if (camera) {
      camera.position.set(24, 22, 28);
    }
  };

  if (doorFrame) doorFrame.addEventListener('click', openTheDoor);
  if (btnOpenDoor) btnOpenDoor.addEventListener('click', openTheDoor);
  if (btnSkipDoor) btnSkipDoor.addEventListener('click', skipTheDoor);

  // =========================================================================
  // 3. THREE.JS 3D FLOATING FANTASY ISLAND
  // =========================================================================
  const canvas = document.getElementById('webgl-canvas');
  const viewport = document.getElementById('island-viewport');

  let scene, camera, renderer, controls;
  const landmarks = {};
  const destinationCoords = {
    techlab: { x: -8, y: 1.5, z: -5 },
    artatelier: { x: 7, y: 1.5, z: -6 },
    naturegallery: { x: 8, y: 1.5, z: 6 },
    journey: { x: -7, y: 1.5, z: 6 },
    mailbox: { x: 0, y: 1.2, z: 8 }
  };

  const clouds = [];
  const petals = [];
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-100, -100);
  let hoveredObject = null;

  const init3DWorld = () => {
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF8EDE2);
    scene.fog = new THREE.FogExp2(0xF8EDE2, 0.015);

    // Camera (Isometric perspective)
    const aspect = viewport.clientWidth / viewport.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(24, 22, 28);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going below island
      controls.minDistance = 14;
      controls.maxDistance = 55;
      controls.target.set(0, 0, 0);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff0f5, 1.2);
    sunLight.position.set(25, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xF4DCE5, 0xC0849B, 0.5);
    scene.add(hemiLight);

    // Build Island Geometry
    buildIslandMesh();
    buildPathways();
    buildTreesAndFlowers();
    buildLandmarks();
    buildClouds();
    buildFloatingPetals();

    // Resize listener
    window.addEventListener('resize', onWindowResize);

    // Mouse interactions
    viewport.addEventListener('mousemove', onIslandMouseMove);
    viewport.addEventListener('click', onIslandClick);

    // Render loop
    animate();
  };

  // --- Procedural 3D Island Components ---
  const buildIslandMesh = () => {
    const islandGroup = new THREE.Group();

    // Top Grassy Surface (Soft pastel green/mint with soft pink blush)
    const topGeo = new THREE.CylinderGeometry(15, 13.5, 2.5, 32);
    const topMat = new THREE.MeshToonMaterial({ color: 0xd6edd0 });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0;
    topMesh.receiveShadow = true;
    islandGroup.add(topMesh);

    // Upper Rock Strata (Cream Ivory)
    const midGeo = new THREE.CylinderGeometry(13.5, 9, 4, 16);
    const midMat = new THREE.MeshToonMaterial({ color: 0xF4DCE5 });
    const midMesh = new THREE.Mesh(midGeo, midMat);
    midMesh.position.y = -3;
    midMesh.receiveShadow = true;
    islandGroup.add(midMesh);

    // Lower Rocky Cliff Cone (Dusty Rose)
    const botGeo = new THREE.ConeGeometry(9, 9, 14);
    botGeo.rotateX(Math.PI);
    const botMat = new THREE.MeshToonMaterial({ color: 0xC0849B });
    const botMesh = new THREE.Mesh(botGeo, botMat);
    botMesh.position.y = -9.5;
    botMesh.castShadow = true;
    islandGroup.add(botMesh);

    // Floating miniature under-rocks
    for (let i = 0; i < 6; i++) {
      const rockGeo = new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.9, 0);
      const rockMat = new THREE.MeshToonMaterial({ color: 0xe6bacb });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 6 + Math.random() * 4;
      rock.position.set(Math.cos(angle) * radius, -10 - Math.random() * 5, Math.sin(angle) * radius);
      islandGroup.add(rock);
    }

    scene.add(islandGroup);
  };

  const buildPathways = () => {
    const pathMat = new THREE.MeshToonMaterial({ color: 0xF8EDE2 });

    const createStone = (x, z, r = 0.9) => {
      const stoneGeo = new THREE.CylinderGeometry(r, r, 0.15, 8);
      const stone = new THREE.Mesh(stoneGeo, pathMat);
      stone.position.set(x, 1.3, z);
      stone.receiveShadow = true;
      scene.add(stone);
    };

    // Paths connecting center to the 5 destinations
    for (let step = 0; step < 8; step++) {
      const t = step / 8;
      createStone(-t * 7.5, -t * 4.5, 0.75);
      createStone(t * 6.5, -t * 5.5, 0.75);
      createStone(t * 7.5, t * 5.5, 0.75);
      createStone(-t * 6.5, t * 5.5, 0.75);
      createStone(0, t * 7.5, 0.75);
    }

    createStone(0, 0, 2.5);
  };

  const buildTreesAndFlowers = () => {
    const trunkMat = new THREE.MeshToonMaterial({ color: 0x937264 });
    const foliageMatPink = new THREE.MeshToonMaterial({ color: 0xF4DCE5 });
    const foliageMatCream = new THREE.MeshToonMaterial({ color: 0xFFFAF5 });
    const foliageMatRose = new THREE.MeshToonMaterial({ color: 0xC0849B });

    const createTree = (x, z, mat) => {
      const treeGroup = new THREE.Group();

      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 1.6, 6);
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.6 / 2;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const topGeo = new THREE.DodecahedronGeometry(1.2, 1);
      const top = new THREE.Mesh(topGeo, mat);
      top.position.y = 1.9;
      top.castShadow = true;
      treeGroup.add(top);

      treeGroup.position.set(x, 1.25, z);
      scene.add(treeGroup);
    };

    createTree(-10, -2, foliageMatPink);
    createTree(-9, -9, foliageMatRose);
    createTree(10, -1, foliageMatPink);
    createTree(3, -11, foliageMatCream);
    createTree(11, 4, foliageMatRose);
    createTree(-11, 4, foliageMatPink);
    createTree(5, 10, foliageMatCream);
    createTree(-5, 10, foliageMatRose);

    // Flowers scattered across grass
    const flowerGeo = new THREE.SphereGeometry(0.18, 6, 6);
    const flowerMatPink = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const flowerMatWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 45; i++) {
      const mat = i % 2 === 0 ? flowerMatPink : flowerMatWhite;
      const flower = new THREE.Mesh(flowerGeo, mat);
      const angle = Math.random() * Math.PI * 2;
      const dist = 3 + Math.random() * 10;
      flower.position.set(Math.cos(angle) * dist, 1.35, Math.sin(angle) * dist);
      scene.add(flower);
    }
  };

  const buildLandmarks = () => {
    // 1. The Invention Castle — Tech Lab (Futuristic Castle Cylinder with Holographic Ring)
    const techGroup = new THREE.Group();
    techGroup.name = 'landmark_techlab';

    const techBaseGeo = new THREE.CylinderGeometry(1.8, 2, 2.2, 16);
    const techBaseMat = new THREE.MeshToonMaterial({ color: 0xF8EDE2 });
    const techBase = new THREE.Mesh(techBaseGeo, techBaseMat);
    techBase.position.y = 1.1;
    techBase.castShadow = true;
    techGroup.add(techBase);

    const domeGeo = new THREE.SphereGeometry(1.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0xF4DCE5, transparent: true, opacity: 0.85, roughness: 0.2 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 2.2;
    techGroup.add(dome);

    const ringGeo = new THREE.TorusGeometry(2.3, 0.08, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    ring.position.y = 2.4;
    techGroup.add(ring);
    techGroup.userData.ring = ring;

    const antGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 6);
    const antMat = new THREE.MeshBasicMaterial({ color: 0xC0849B });
    const ant = new THREE.Mesh(antGeo, antMat);
    ant.position.y = 3.6;
    techGroup.add(ant);

    techGroup.position.set(destinationCoords.techlab.x, destinationCoords.techlab.y, destinationCoords.techlab.z);
    scene.add(techGroup);
    landmarks.techlab = techGroup;

    // 2. The Art Garden — Art Atelier (Cottage with Easel)
    const atelierGroup = new THREE.Group();
    atelierGroup.name = 'landmark_artatelier';

    const cottageGeo = new THREE.BoxGeometry(2.8, 2, 2.4);
    const cottageMat = new THREE.MeshToonMaterial({ color: 0xFFFAF5 });
    const cottage = new THREE.Mesh(cottageGeo, cottageMat);
    cottage.position.y = 1;
    cottage.castShadow = true;
    atelierGroup.add(cottage);

    const roofGeo = new THREE.ConeGeometry(2.6, 1.4, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMat = new THREE.MeshToonMaterial({ color: 0xC0849B });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 2.7;
    roof.castShadow = true;
    atelierGroup.add(roof);

    const easelGeo = new THREE.BoxGeometry(0.9, 1.1, 0.1);
    const easelMat = new THREE.MeshToonMaterial({ color: 0xF4DCE5 });
    const easel = new THREE.Mesh(easelGeo, easelMat);
    easel.position.set(0, 0.7, 1.6);
    easel.rotation.x = -0.15;
    atelierGroup.add(easel);

    atelierGroup.position.set(destinationCoords.artatelier.x, destinationCoords.artatelier.y, destinationCoords.artatelier.z);
    scene.add(atelierGroup);
    landmarks.artatelier = atelierGroup;

    // 3. The Memory Forest — Nature Gallery (Glass Pavilion)
    const galleryGroup = new THREE.Group();
    galleryGroup.name = 'landmark_naturegallery';

    const pavilionGeo = new THREE.CylinderGeometry(2, 2.2, 2.2, 8);
    const pavilionMat = new THREE.MeshStandardMaterial({ color: 0xF4DCE5, transparent: true, opacity: 0.65, roughness: 0.1 });
    const pavilion = new THREE.Mesh(pavilionGeo, pavilionMat);
    pavilion.position.y = 1.1;
    galleryGroup.add(pavilion);

    const frameGeo = new THREE.TorusGeometry(2.05, 0.08, 8, 8);
    frameGeo.rotateX(Math.PI / 2);
    const frameMat = new THREE.MeshBasicMaterial({ color: 0xC0849B });
    const frame1 = new THREE.Mesh(frameGeo, frameMat);
    frame1.position.y = 1.1;
    galleryGroup.add(frame1);

    const pavilionRoofGeo = new THREE.ConeGeometry(2.2, 1.2, 8);
    const pavilionRoofMat = new THREE.MeshToonMaterial({ color: 0xF8EDE2 });
    const pavilionRoof = new THREE.Mesh(pavilionRoofGeo, pavilionRoofMat);
    pavilionRoof.position.y = 2.8;
    galleryGroup.add(pavilionRoof);

    galleryGroup.position.set(destinationCoords.naturegallery.x, destinationCoords.naturegallery.y, destinationCoords.naturegallery.z);
    scene.add(galleryGroup);
    landmarks.naturegallery = galleryGroup;

    // 4. My Journey (Garden Archway & Blossom Shrine)
    const journeyGroup = new THREE.Group();
    journeyGroup.name = 'landmark_journey';

    const archPillarGeo = new THREE.CylinderGeometry(0.25, 0.25, 3, 8);
    const archMat = new THREE.MeshToonMaterial({ color: 0xC0849B });
    const p1 = new THREE.Mesh(archPillarGeo, archMat);
    p1.position.set(-1.2, 1.5, 0);
    p1.castShadow = true;
    journeyGroup.add(p1);

    const p2 = new THREE.Mesh(archPillarGeo, archMat);
    p2.position.set(1.2, 1.5, 0);
    p2.castShadow = true;
    journeyGroup.add(p2);

    const archTopGeo = new THREE.BoxGeometry(3.2, 0.35, 0.6);
    const archTop = new THREE.Mesh(archTopGeo, archMat);
    archTop.position.set(0, 3, 0);
    journeyGroup.add(archTop);

    const blossomCenterGeo = new THREE.DodecahedronGeometry(0.9, 1);
    const blossomCenterMat = new THREE.MeshToonMaterial({ color: 0xF4DCE5 });
    const blossom = new THREE.Mesh(blossomCenterGeo, blossomCenterMat);
    blossom.position.set(0, 1.6, 0);
    journeyGroup.add(blossom);

    journeyGroup.position.set(destinationCoords.journey.x, destinationCoords.journey.y, destinationCoords.journey.z);
    scene.add(journeyGroup);
    landmarks.journey = journeyGroup;

    // 5. The Mailbox (Pastel Pink Mailbox on Post)
    const mailboxGroup = new THREE.Group();
    mailboxGroup.name = 'landmark_mailbox';

    const postGeo = new THREE.CylinderGeometry(0.18, 0.22, 2.2, 8);
    const postMat = new THREE.MeshToonMaterial({ color: 0x937264 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = 1.1;
    post.castShadow = true;
    mailboxGroup.add(post);

    const boxGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.4, 16);
    boxGeo.rotateZ(Math.PI / 2);
    const boxMat = new THREE.MeshToonMaterial({ color: 0xF4DCE5 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(0, 2.3, 0);
    box.castShadow = true;
    mailboxGroup.add(box);

    const flagGeo = new THREE.BoxGeometry(0.1, 0.5, 0.3);
    const flagMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0.6, 2.5, 0.2);
    mailboxGroup.add(flag);

    mailboxGroup.position.set(destinationCoords.mailbox.x, destinationCoords.mailbox.y, destinationCoords.mailbox.z);
    scene.add(mailboxGroup);
    landmarks.mailbox = mailboxGroup;
  };

  const buildClouds = () => {
    const cloudMat = new THREE.MeshToonMaterial({ color: 0xFFFAF5, transparent: true, opacity: 0.85 });

    for (let c = 0; c < 7; c++) {
      const cloudGroup = new THREE.Group();
      const numPuffs = 4 + Math.floor(Math.random() * 3);

      for (let p = 0; p < numPuffs; p++) {
        const puffGeo = new THREE.DodecahedronGeometry(1.2 + Math.random() * 0.9, 1);
        const puff = new THREE.Mesh(puffGeo, cloudMat);
        puff.position.set((p - numPuffs / 2) * 1.3, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.8);
        cloudGroup.add(puff);
      }

      const orbitRadius = 24 + Math.random() * 10;
      const angle = (c / 7) * Math.PI * 2;
      cloudGroup.position.set(Math.cos(angle) * orbitRadius, -2 + Math.random() * 8, Math.sin(angle) * orbitRadius);

      cloudGroup.userData = {
        orbitRadius,
        angle,
        speed: 0.0012 + Math.random() * 0.0008,
        floatOffset: Math.random() * 10
      };

      scene.add(cloudGroup);
      clouds.push(cloudGroup);
    }
  };

  const buildFloatingPetals = () => {
    const petalGeo = new THREE.PlaneGeometry(0.35, 0.35);
    const petalMat = new THREE.MeshBasicMaterial({ color: 0xF4DCE5, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });

    for (let i = 0; i < 30; i++) {
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set((Math.random() - 0.5) * 22, Math.random() * 12, (Math.random() - 0.5) * 22);
      petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      petal.userData = {
        speedY: 0.015 + Math.random() * 0.02,
        rotSpeed: 0.02 + Math.random() * 0.03
      };

      scene.add(petal);
      petals.push(petal);
    }
  };

  const updateDestinationPins = () => {
    if (!camera || !viewport) return;

    const widthHalf = viewport.clientWidth / 2;
    const heightHalf = viewport.clientHeight / 2;

    for (const [key, coords] of Object.entries(destinationCoords)) {
      const pinEl = document.getElementById(`pin-${key}`);
      if (!pinEl) continue;

      const pos = new THREE.Vector3(coords.x, coords.y + 3.2, coords.z);
      pos.project(camera);

      if (pos.z < 1) {
        const x = pos.x * widthHalf + widthHalf;
        const y = -(pos.y * heightHalf) + heightHalf;

        pinEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        pinEl.style.display = 'flex';
      } else {
        pinEl.style.display = 'none';
      }
    }
  };

  const onIslandMouseMove = (e) => {
    const rect = viewport.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (!camera || !scene) return;

    raycaster.setFromCamera(mouse, camera);
    const interactiveMeshes = Object.values(landmarks);
    const intersects = raycaster.intersectObjects(interactiveMeshes, true);

    if (intersects.length > 0) {
      let topLandmark = intersects[0].object;
      while (topLandmark.parent && !topLandmark.name.startsWith('landmark_')) {
        topLandmark = topLandmark.parent;
      }

      if (hoveredObject !== topLandmark) {
        if (hoveredObject) hoveredObject.scale.set(1, 1, 1);
        hoveredObject = topLandmark;
        hoveredObject.scale.set(1.08, 1.08, 1.08);
        document.body.style.cursor = 'pointer';
      }
    } else {
      if (hoveredObject) {
        hoveredObject.scale.set(1, 1, 1);
        hoveredObject = null;
      }
      document.body.style.cursor = 'default';
    }
  };

  const onIslandClick = (e) => {
    if (!camera || !scene) return;

    raycaster.setFromCamera(mouse, camera);
    const interactiveMeshes = Object.values(landmarks);
    const intersects = raycaster.intersectObjects(interactiveMeshes, true);

    if (intersects.length > 0) {
      let topLandmark = intersects[0].object;
      while (topLandmark.parent && !topLandmark.name.startsWith('landmark_')) {
        topLandmark = topLandmark.parent;
      }

      const destName = topLandmark.name.replace('landmark_', '');
      if (destName) {
        navigateToDestination(destName);
      }
    }
  };

  const onWindowResize = () => {
    if (!camera || !renderer || !viewport) return;
    camera.aspect = viewport.clientWidth / viewport.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  };

  let clock = new THREE.Clock();

  const animate = () => {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (controls) controls.update();

    if (landmarks.techlab && landmarks.techlab.userData.ring) {
      landmarks.techlab.userData.ring.rotation.z += 0.015;
    }

    clouds.forEach((cloud) => {
      cloud.userData.angle += cloud.userData.speed;
      const r = cloud.userData.orbitRadius;
      cloud.position.x = Math.cos(cloud.userData.angle) * r;
      cloud.position.z = Math.sin(cloud.userData.angle) * r;
      cloud.position.y += Math.sin(elapsedTime + cloud.userData.floatOffset) * 0.005;
    });

    petals.forEach((petal) => {
      petal.position.y += petal.userData.speedY;
      petal.rotation.x += petal.userData.rotSpeed;
      petal.rotation.y += petal.userData.rotSpeed;

      if (petal.position.y > 14) {
        petal.position.y = 1.2;
        petal.position.x = (Math.random() - 0.5) * 22;
        petal.position.z = (Math.random() - 0.5) * 22;
      }
    });

    updateDestinationPins();

    renderer.render(scene, camera);
  };

  init3DWorld();

  // =========================================================================
  // 4. DESTINATION NAVIGATION & MODAL MANAGEMENT
  // =========================================================================
  const navigateToDestination = (destId) => {
    state.visitedDestinations.add(destId);
    updateProgressHUD();

    if (camera && destinationCoords[destId] && controls) {
      const target = destinationCoords[destId];
      controls.target.set(target.x, target.y, target.z);
    }

    closeAllModals();

    const modalEl = document.getElementById(`modal-${destId}`);
    if (modalEl) {
      modalEl.classList.add('open');
      modalEl.setAttribute('aria-hidden', 'false');
      state.currentModal = destId;

      document.querySelectorAll('.hud-nav-chip').forEach((chip) => {
        chip.classList.toggle('active', chip.getAttribute('data-dest') === destId);
      });

      triggerChimeNote(523.25); // C5
    }
  };

  const closeAllModals = () => {
    document.querySelectorAll('.dest-modal').forEach((modal) => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.hud-nav-chip').forEach((chip) => chip.classList.remove('active'));
    state.currentModal = null;
  };

  document.querySelectorAll('.dest-close-btn').forEach((btn) => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.dest-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.hud-nav-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const dest = chip.getAttribute('data-dest');
      if (dest) navigateToDestination(dest);
    });
  });

  document.querySelectorAll('.destination-pin').forEach((pin) => {
    pin.addEventListener('click', () => {
      const dest = pin.getAttribute('data-dest');
      if (dest) navigateToDestination(dest);
    });
  });

  const homeBtn = document.getElementById('hud-home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      closeAllModals();
      if (controls && camera) {
        controls.target.set(0, 0, 0);
        camera.position.set(24, 22, 28);
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeLightbox();
      closeMap();
      closeSurprise();
    }
  });

  // =========================================================================
  // 5. ISLAND MAP MODAL
  // =========================================================================
  const mapModal = document.getElementById('map-modal');
  const mapBtn = document.getElementById('hud-map-btn');
  const mapCloseBtn = document.getElementById('map-close-btn');
  const mapBackdrop = document.getElementById('map-backdrop');

  const openMap = () => {
    if (mapModal) {
      mapModal.classList.add('open');
      mapModal.setAttribute('aria-hidden', 'false');
    }
  };

  const closeMap = () => {
    if (mapModal) {
      mapModal.classList.remove('open');
      mapModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (mapBtn) mapBtn.addEventListener('click', openMap);
  if (mapCloseBtn) mapCloseBtn.addEventListener('click', closeMap);
  if (mapBackdrop) mapBackdrop.addEventListener('click', closeMap);

  document.querySelectorAll('.map-pin-btn').forEach((pinBtn) => {
    pinBtn.addEventListener('click', () => {
      const dest = pinBtn.getAttribute('data-dest');
      closeMap();
      if (dest) navigateToDestination(dest);
    });
  });

  // =========================================================================
  // 6. THE MEMORY FOREST (PHOTOGRAPHY GALLERY) FILTERS
  // =========================================================================
  const natureFilterBtns = document.querySelectorAll('.nature-tab-btn');
  const photoCards = document.querySelectorAll('.photo-card');

  natureFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      natureFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-nature');

      photoCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================================
  // 7. FULLSCREEN MEDIA LIGHTBOX (ARTWORK & PHOTOGRAPHY)
  // =========================================================================
  const lightbox = document.getElementById('media-lightbox');
  const lightboxBg = document.getElementById('lightbox-bg');
  const lightboxX = document.getElementById('lightbox-x-btn');
  const lightboxImg = document.getElementById('lightbox-main-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxMeta = document.getElementById('lightbox-meta');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryItems = [];
  let currentGalleryIndex = 0;

  const openLightboxForItems = (items, index) => {
    currentGalleryItems = items;
    currentGalleryIndex = index;
    updateLightboxContent();

    if (lightbox) {
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    }
  };

  const updateLightboxContent = () => {
    if (currentGalleryIndex < 0 || currentGalleryIndex >= currentGalleryItems.length) return;
    const item = currentGalleryItems[currentGalleryIndex];

    if (lightboxImg) lightboxImg.src = item.img;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxMeta) lightboxMeta.textContent = item.meta;
    if (lightboxDesc) lightboxDesc.textContent = item.desc;
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }
  };

  if (lightboxX) lightboxX.addEventListener('click', closeLightbox);
  if (lightboxBg) lightboxBg.addEventListener('click', closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
      updateLightboxContent();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryItems.length;
      updateLightboxContent();
    });
  }

  // Setup Atelier artwork cards
  const atelierCards = Array.from(document.querySelectorAll('.atelier-card'));
  const atelierItems = atelierCards.map((card) => ({
    img: card.getAttribute('data-full'),
    title: card.getAttribute('data-title'),
    meta: card.getAttribute('data-medium'),
    desc: card.getAttribute('data-notes')
  }));

  atelierCards.forEach((card, idx) => {
    card.addEventListener('click', () => openLightboxForItems(atelierItems, idx));
  });

  // Setup Photography cards (6 real photos!)
  const photoCardElements = Array.from(document.querySelectorAll('.photo-card'));
  const photoItems = photoCardElements.map((card) => ({
    img: card.getAttribute('data-full'),
    title: card.getAttribute('data-title'),
    meta: card.getAttribute('data-meta'),
    desc: card.getAttribute('data-desc')
  }));

  photoCardElements.forEach((card, idx) => {
    card.addEventListener('click', () => openLightboxForItems(photoItems, idx));
  });

  // =========================================================================
  // 8. THE MAILBOX (EMAIL COPY & CONTACT FORM)
  // =========================================================================
  const btnCopyEmail = document.getElementById('btn-copy-email');
  const emailTextEl = document.getElementById('email-address-text');
  const copyTooltip = document.getElementById('copy-tooltip');

  if (btnCopyEmail && emailTextEl) {
    btnCopyEmail.addEventListener('click', async () => {
      const email = emailTextEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        const temp = document.createElement('textarea');
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }

      if (copyTooltip) {
        copyTooltip.classList.add('active');
        setTimeout(() => copyTooltip.classList.remove('active'), 2200);
      }
    });
  }

  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;

      if (!nameInput.value.trim()) {
        document.getElementById('name-error').textContent = 'Please provide your name.';
        valid = false;
      } else {
        document.getElementById('name-error').textContent = '';
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address.';
        valid = false;
      } else {
        document.getElementById('email-error').textContent = '';
      }

      if (!subjectInput.value.trim()) {
        document.getElementById('subject-error').textContent = 'Please enter a subject.';
        valid = false;
      } else {
        document.getElementById('subject-error').textContent = '';
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
        document.getElementById('message-error').textContent = 'Please write a letter of at least 8 characters.';
        valid = false;
      } else {
        document.getElementById('message-error').textContent = '';
      }

      if (!valid) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Letter... 💌';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Letter 💌';

        formStatus.className = 'form-feedback-alert success';
        formStatus.textContent = 'Thank you! Your letter has been delivered to Muskan. I will get back to you soon! 🌸';
        contactForm.reset();

        setTimeout(() => {
          formStatus.style.display = 'none';
          formStatus.className = 'form-feedback-alert';
        }, 6000);
      }, 1000);
    });
  }

  // =========================================================================
  // 9. ETHEREAL AMBIENT AUDIO (WEB AUDIO API CHIMES)
  // =========================================================================
  const soundBtn = document.getElementById('hud-sound-btn');
  const soundIconOn = soundBtn ? soundBtn.querySelector('.sound-icon-on') : null;
  const soundIconOff = soundBtn ? soundBtn.querySelector('.sound-icon-off') : null;

  const getAudioContext = () => {
    if (!state.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) state.audioCtx = new AudioCtx();
    }
    return state.audioCtx;
  };

  const triggerChimeNote = (freq = 440) => {
    if (!state.audioEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.7);
  };

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      state.audioEnabled = !state.audioEnabled;

      if (state.audioEnabled) {
        soundIconOn.style.display = 'inline-block';
        soundIconOff.style.display = 'none';
        triggerChimeNote(523.25);
      } else {
        soundIconOn.style.display = 'none';
        soundIconOff.style.display = 'inline-block';
      }
    });
  }

  // =========================================================================
  // 10. HIDDEN DISCOVERIES (EASTER EGGS)
  // =========================================================================
  const surprisePopup = document.getElementById('surprise-popup');
  const surpriseIcon = document.getElementById('surprise-icon');
  const surpriseTitle = document.getElementById('surprise-title');
  const surpriseBody = document.getElementById('surprise-body');
  const surpriseClose = document.getElementById('surprise-close');

  const showSurprise = (icon, title, body) => {
    if (surpriseIcon) surpriseIcon.textContent = icon;
    if (surpriseTitle) surpriseTitle.textContent = title;
    if (surpriseBody) surpriseBody.textContent = body;

    if (surprisePopup) {
      surprisePopup.classList.add('open');
      surprisePopup.setAttribute('aria-hidden', 'false');
    }

    triggerChimeNote(659.25); // E5
  };

  const closeSurprise = () => {
    if (surprisePopup) {
      surprisePopup.classList.remove('open');
      surprisePopup.setAttribute('aria-hidden', 'true');
    }
  };

  if (surpriseClose) surpriseClose.addEventListener('click', closeSurprise);

  // 1. Butterfly
  const butterfly = document.getElementById('easter-butterfly');
  if (butterfly) {
    butterfly.addEventListener('click', () => {
      showSurprise(
        '🦋',
        'You Met the Friendly Guide Butterfly!',
        'Fun Fact: When Muskan is not coding in Python or exploring robotics, you can find her sketching peaceful characters under big trees or capturing night skies and campus architecture.'
      );
    });
  }

  // 2. Mystery Gift
  const giftbox = document.getElementById('easter-giftbox');
  if (giftbox) {
    giftbox.addEventListener('click', () => {
      showSurprise(
        '🎁',
        'Personal Note from Muskan',
        '“Thank you for stepping Beyond the Door! I believe the most memorable engineering combines technical precision with genuine human creativity. Never stop asking questions!”'
      );
    });
  }

  // 3. Collectible Stars
  ['easter-star-1', 'easter-star-2', 'easter-star-3'].forEach((id) => {
    const starEl = document.getElementById(id);
    if (starEl) {
      starEl.addEventListener('click', () => {
        if (!state.collectedStars.has(id)) {
          state.collectedStars.add(id);
          updateStarsHUD();
          starEl.style.transform = 'scale(1.8) rotate(360deg)';
          starEl.style.opacity = '0';
          setTimeout(() => (starEl.style.display = 'none'), 400);

          showSurprise('⭐', `Island Star ${state.collectedStars.size}/3 Collected!`, 'You found one of the hidden celestial stars on the floating island!');
        }
      });
    }
  });

  // 4. Paper Airplane
  const airplane = document.getElementById('easter-airplane');
  if (airplane) {
    airplane.addEventListener('click', () => {
      showSurprise(
        '✈️',
        'Latest Updates from Muskan',
        'Currently diving deep into first-semester AI engineering, testing integration patterns on Plan2Space, and exploring new dusk photography perspectives!'
      );
    });
  }

  // =========================================================================
  // 11. MAGICAL CURSOR & INTERACTION SPARKLES
  // =========================================================================
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (!isTouch) {
    const magicalCursor = document.getElementById('magical-cursor');
    const sparkleContainer = document.getElementById('sparkle-container');

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isVisible = false;

    const renderCursor = () => {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;

      if (magicalCursor) {
        magicalCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }

      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible && magicalCursor) {
        isVisible = true;
        magicalCursor.classList.add('visible');
      }
    });

    document.addEventListener('mouseleave', () => {
      if (magicalCursor) {
        isVisible = false;
        magicalCursor.classList.remove('visible');
      }
    });

    const sparkleColors = ['#f472b6', '#ec4899', '#fbcfe8', '#C0849B', '#fbbf24'];

    const spawnSparkles = (x, y, count = 6) => {
      if (!sparkleContainer) return;

      for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'sparkle-particle';
        particle.textContent = ['✦', '★', '✧', '🌸', '✨'][Math.floor(Math.random() * 5)];

        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const dist = 25 + Math.random() * 35;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        sparkleContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 700);
      }
    };

    window.addEventListener('click', (e) => {
      spawnSparkles(e.clientX, e.clientY, 7);
    });

    document.querySelectorAll('button, a, .atelier-card, .photo-card, .destination-pin, .discovery-item, .magical-door-frame').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (magicalCursor) magicalCursor.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        if (magicalCursor) magicalCursor.classList.remove('is-hovering');
      });
    });
  }
});
