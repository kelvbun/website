import {
  ACESFilmicToneMapping,
  CanvasTexture,
  DataTexture,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  LatheGeometry,
  LinearFilter,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  PCFShadowMap,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from "three";
import * as Three from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function mountPanda(container: HTMLButtonElement) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const scene = new Scene();
  const camera = new OrthographicCamera(-2.4, 2.4, 2.15, -2.15, 0.1, 30);
  camera.position.set(0, 2.7, 9);
  camera.lookAt(0, 1.8, 0);
  scene.add(new HemisphereLight(0xfff1db, 0x9b784c, 1.2));
  const light = new DirectionalLight(0xffdfad, 5);
  light.position.set(-3, 8, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.radius = 6;
  light.shadow.bias = -0.001;
  light.shadow.normalBias = 0.025;
  scene.add(light);
  const fill = new DirectionalLight(0xffecd2, 1.2);
  fill.position.copy(camera.position);
  fill.target.position.set(0, 1.8, 0);
  scene.add(fill, fill.target);
  const rim = new DirectionalLight(0xffefd7, 0.6);
  rim.position.set(4, 3, -2);
  scene.add(rim);

  const geometry = new SphereGeometry(1, 40, 28);
  const headTint = new DataTexture(
    new Uint8Array([255, 250, 233, 255, 255, 255, 255, 255, 255, 255, 255, 255]),
    1,
    3,
  );
  headTint.colorSpace = SRGBColorSpace;
  headTint.magFilter = LinearFilter;
  headTint.needsUpdate = true;
  const bellyTint = new DataTexture(
    new Uint8Array([244, 215, 170, 255, 255, 249, 233, 255, 255, 255, 255, 255]),
    1,
    3,
  );
  bellyTint.colorSpace = SRGBColorSpace;
  bellyTint.magFilter = LinearFilter;
  bellyTint.needsUpdate = true;
  const materials = {
    cream: new MeshStandardMaterial({ color: "#ffffff", roughness: 0.32 }),
    head: new MeshStandardMaterial({
      map: headTint,
      emissive: "#fff8eb",
      emissiveIntensity: 0.2,
      roughness: 0.32,
      toneMapped: false,
    }),
    belly: new MeshStandardMaterial({ map: bellyTint, roughness: 0.8 }),
    black: new MeshStandardMaterial({ color: "#0c0e10", roughness: 0.6 }),
    footBlack: new MeshStandardMaterial({ color: "#080b19", roughness: 0.85 }),
    patch: new MeshStandardMaterial({ color: "#24231f", roughness: 0.9 }),
    eyes: new MeshStandardMaterial({ color: "#07090d", roughness: 0.12 }),
    pink: new MeshStandardMaterial({ color: "#ffb7b5", roughness: 0.65 }),
    cheek: new MeshStandardMaterial({
      color: "#ff9eaa",
      roughness: 1,
      transparent: true,
      opacity: 0.5,
    }),
    blush: new MeshStandardMaterial({ color: "#e99291", roughness: 0.8 }),
    trunk: new MeshStandardMaterial({ color: "#2f1f0e", roughness: 1 }),
    green: new MeshStandardMaterial({
      color: "#4d7c47",
      emissive: "#527f39",
      emissiveIntensity: 0.4,
      roughness: 0.4,
    }),
    // Compensate for the warm key light so the rendered foliage and ground stay sage green.
    node: new MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
    grass: new MeshStandardMaterial({ color: "#63896a", roughness: 1 }),
    grassSide: new MeshBasicMaterial({ color: "#a5b973", toneMapped: false }),
  };
  function addPart(
    parent: Group | Scene,
    material: keyof typeof materials,
    position: [number, number, number],
    scale: [number, number, number],
    tilt = 0,
  ) {
    const mesh = new Mesh(geometry, materials[material]);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.rotation.z = tilt;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // All parts are actual meshes; the head pivots independently of the bamboo hug.
  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Three's geometry constructor.
  const grassOutline = new Three.Shape();
  grassOutline.absellipse(0, 0, 2.02, 1.6, 0, Math.PI * 2, false, 0);
  const grassGeometry = new ExtrudeGeometry(grassOutline, {
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.08,
    bevelThickness: 0.05,
    curveSegments: 48,
    depth: 0.07,
  });
  const grass = new Mesh(grassGeometry, [materials.grass, materials.grassSide]);
  grass.rotation.x = -Math.PI / 2 + 0.3;
  grass.position.y = 0.21;
  grass.castShadow = true;
  grass.receiveShadow = true;
  scene.add(grass);
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 128;
  const shadowContext = shadowCanvas.getContext("2d")!;
  const shadowGradient = shadowContext.createRadialGradient(64, 64, 4, 64, 64, 64);
  shadowGradient.addColorStop(0, "rgba(38, 55, 29, 0.68)");
  shadowGradient.addColorStop(0.55, "rgba(38, 55, 29, 0.36)");
  shadowGradient.addColorStop(1, "rgba(38, 55, 29, 0)");
  shadowContext.fillStyle = shadowGradient;
  shadowContext.fillRect(0, 0, 128, 128);
  const contactTexture = new CanvasTexture(shadowCanvas);
  const contactGeometry = new PlaneGeometry(3.2, 2.6);
  const contactMaterial = new MeshBasicMaterial({
    map: contactTexture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const contact = new Mesh(contactGeometry, contactMaterial);
  contact.rotation.copy(grass.rotation);
  contact.position.copy(grass.position);
  contact.translateZ(0.13);
  contact.translateY(-0.35);
  contact.position.x = -0.3;
  scene.add(contact);
  const bambooGeometry = new LatheGeometry(
    [
      [0, 0],
      [0.22, 0],
      [0.27, 0.05],
      [0.26, 0.85],
      [0.29, 0.92],
      [0.29, 0.98],
      [0.26, 1.04],
      [0.25, 1.88],
      [0.28, 1.95],
      [0.28, 2.01],
      [0.25, 2.07],
      [0.25, 3.18],
      [0.21, 3.23],
      [0, 3.23],
    ].map(([radius, height]) => new Vector2(radius, height)),
    32,
  );
  const bamboo = new Mesh(bambooGeometry, materials.green);
  bamboo.position.set(0.875, 0.2, -0.35);
  bamboo.scale.set(1.32, 1.1, 1.22);
  bamboo.castShadow = true;
  scene.add(bamboo);
  addPart(scene, "green", [1.275, 2.91, -0.35], [0.1, 0.45, 0.045], -0.65);
  addPart(scene, "green", [-0.46, 2.83, -0.35], [0.075, 0.2, 0.04], -0.8);
  addPart(scene, "green", [1.24, 2.61, -0.35], [0.085, 0.33, 0.045], 0.8);
  const treeGeometry = new LatheGeometry(
    [
      [0, 0],
      [0.48, 0],
      [0.6, 0.09],
      [0.63, 0.35],
      [0.56, 0.8],
      [0.4, 1.3],
      [0.2, 1.78],
      [0.07, 1.94],
      [0, 1.96],
    ].map(([radius, height]) => new Vector2(radius, height)),
    9,
  );
  const treeColors: number[] = [];
  const treePositions = treeGeometry.attributes.position;
  const treeNormals = treeGeometry.attributes.normal;
  const treeBottom = new Three.Color("#8aa663");
  const treeMiddle = new Three.Color("#8eb369");
  const treeTop = new Three.Color("#79a66f");
  for (let i = 0; i < treePositions.count; i++) {
    const height = treePositions.getY(i) / 1.96;
    const tint =
      height < 0.55
        ? treeBottom.clone().lerp(treeMiddle, height / 0.55)
        : treeMiddle.clone().lerp(treeTop, (height - 0.55) / 0.45);
    const front = Math.max(0, treeNormals.getZ(i));
    tint.r *= 0.5 + 0.5 * front;
    tint.g *= 0.78 + 0.22 * front;
    tint.b *= 0.8 + 0.2 * front;
    treeColors.push(tint.r, tint.g, tint.b);
  }
  treeGeometry.setAttribute("color", new Three.Float32BufferAttribute(treeColors, 3));
  const trunkGeometry = new RoundedBoxGeometry(1, 1, 1, 3, 0.16);
  for (const [x, size] of [
    [-1.55, 0.68],
    [1.6, 0.38],
  ]) {
    const trunkHeight = size * (x > 0 ? 0.65 : 0.24);
    const trunk = new Mesh(trunkGeometry, materials.trunk);
    trunk.position.set(x + (x > 0 ? 0.05 : 0), 0.43 + trunkHeight / 2, -0.4);
    trunk.scale.set(size * 0.45, trunkHeight, size * 0.45);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    scene.add(trunk);
    const tree = new Mesh(treeGeometry, materials.node);
    tree.position.set(x, 0.43 + trunkHeight, -0.4);
    tree.scale.set(size, size, size * 0.8);
    if (x < 0) {
      tree.rotation.z = 0.06;
      tree.scale.x += 0.04;
    } else {
      tree.position.x += 0.05;
      tree.position.y -= 0.1;
      tree.scale.x += 0.08;
      tree.scale.y -= 0.02;
    }
    tree.castShadow = true;
    tree.receiveShadow = true;
    scene.add(tree);
  }
  addPart(scene, "belly", [-0.5, 0.8, 0.12], [0.72, 0.79, 0.69]);
  addPart(scene, "cream", [-1.04, 0.29, 0.65], [0.17, 0.16, 0.2]);
  const footGeometry = new SphereGeometry(1, 40, 28, 0, Math.PI * 2, 0, 2.25);
  footGeometry.applyMatrix4(new Matrix4().makeShear(0, 0, 0.3, 0, 0, 0));
  const foot = new Mesh(footGeometry, materials.footBlack);
  foot.position.set(0.25, 0.48, 0.6);
  foot.scale.set(0.63, 0.49, 0.45);
  foot.castShadow = true;
  foot.receiveShadow = true;
  scene.add(foot);
  const armGeometry = new LatheGeometry(
    new Three.SplineCurve(
      [
        [0, -0.55],
        [0.13, -0.51],
        [0.26, -0.3],
        [0.32, -0.03],
        [0.34, 0.22],
        [0.27, 0.43],
        [0.12, 0.54],
        [0, 0.56],
      ].map(([radius, height]) => new Vector2(radius, height)),
    ).getPoints(32),
    32,
  );
  const arm = new Mesh(armGeometry, materials.black);
  arm.position.set(0.3, 1.26, 0.55);
  arm.rotation.z = -Math.PI / 2 + 0.32;
  arm.scale.z = 1.15;
  arm.castShadow = true;
  arm.receiveShadow = true;
  scene.add(arm);

  const head = new Group();
  head.position.set(-0.28, 1.895, 0.25);
  head.rotation.z = 0.24;
  scene.add(head);
  addPart(head, "black", [-0.69, 0.74, -0.09], [0.35, 0.41, 0.25], -0.3);
  addPart(head, "black", [0.73, 0.61, -0.09], [0.33, 0.36, 0.25], 0.3);
  const headGeometry = geometry.clone();
  const headVertices = headGeometry.attributes.position;
  for (let i = 0; i < headVertices.count; i++) {
    const y = headVertices.getY(i);
    headVertices.setXYZ(
      i,
      headVertices.getX(i) *
        (1 - y * 0.15) *
        (headVertices.getX(i) < 0 ? 1 + Math.min(y, 0) * 0.2 : 1),
      y < 0 ? y * 0.91 : y,
      headVertices.getZ(i),
    );
  }
  headGeometry.computeVertexNormals();
  const cheeks = addPart(head, "head", [0, 0, 0], [1.16, 0.96, 0.78]);
  cheeks.geometry = headGeometry;
  // Seat the markings on the curved face so they stay visible during head turns.
  function facePart(
    material: keyof typeof materials,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number,
    tilt = 0,
  ) {
    const localY = y / (y < 0 ? 0.8736 : 0.96);
    const z = 0.78 * Math.sqrt(1 - (x / (1.16 * (1 - localY * 0.15))) ** 2 - localY ** 2);
    const part = addPart(head, material, [x, y, z], [width, height, depth], tilt);
    part.castShadow = false;
    part.rotation.y = x * 0.8;
    part.rotation.x = -y * 0.8;
    return part;
  }
  for (const side of [-1, 1]) {
    const eyeX = 0.27 + side * 0.4 + (side > 0 ? 0.07 : 0.035);
    const eyeY = 0.04 - (side > 0 ? 0.07 : 0.03);
    facePart("patch", eyeX, eyeY, side > 0 ? 0.16 : 0.17, 0.24, 0.055, side * 0.9);
    const eye = facePart("eyes", eyeX - side * 0.01, eyeY + 0.04, 0.07, 0.075, 0.055);
    eye.position.z += 0.055;
    addPart(
      head,
      "cream",
      [eye.position.x - 0.018, eye.position.y + 0.025, eye.position.z + 0.049],
      [0.017, 0.012, 0.008],
    );
    facePart("cheek", 0.23 + side * 0.78, -0.29, 0.17, 0.12, 0.025, side * 0.15);
    for (const offset of [-0.05, 0.05]) {
      const freckle = facePart("blush", 0.23 + side * 0.78 + offset, -0.285, 0.029, 0.035, 0.014);
      freckle.position.z += 0.035;
    }
  }
  facePart("patch", 0.31, 0.09, 0.062, 0.04, 0.035);
  facePart("pink", 0.32, -0.105, 0.085, 0.085, 0.035);
  function updateFrame(width: number, height: number) {
    if (!width || !height) return;
    camera.left = -(2.15 * width) / height;
    camera.right = -camera.left;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    wake();
  }

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  let frame = 0;
  let previous = 0;
  let targetX = 0;
  let targetY = 0;
  const cheerDuration = 900;
  let clickStarted = -Infinity;
  function render(time: number) {
    frame = 0;
    const blend = 1 - Math.exp(-8 * Math.min((time - previous) / 1000, 0.05));
    previous = time;
    head.rotation.x = MathUtils.lerp(head.rotation.x, targetX, blend);
    head.rotation.y = MathUtils.lerp(head.rotation.y, targetY, blend);
    const progress = Math.min((time - clickStarted) / cheerDuration, 1);
    const bounce = Math.sin(progress * Math.PI);
    const wiggle = Math.sin(progress * Math.PI * 4) * bounce;
    head.position.y = 1.895 + bounce * 0.08;
    head.rotation.z = 0.24 - head.rotation.y * 0.1 + wiggle * 0.07;
    arm.rotation.z = -Math.PI / 2 + 0.32 + wiggle * 0.1;
    renderer.render(scene, camera);
    if (
      progress < 1 ||
      Math.abs(head.rotation.x - targetX) + Math.abs(head.rotation.y - targetY) > 0.001
    )
      wake();
  }
  function wake() {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render);
  }
  function reset() {
    targetX = 0;
    targetY = 0;
    if (motion.matches) {
      clickStarted = -Infinity;
      head.position.y = 1.895;
      head.rotation.set(0, 0, 0.24);
      arm.rotation.z = -Math.PI / 2 + 0.32;
    }
    wake();
  }
  function cheer() {
    if (motion.matches) return;
    const now = performance.now();
    if (now - clickStarted < cheerDuration) return;
    clickStarted = now;
    wake();
  }
  function follow(event: PointerEvent) {
    if (!visible || motion.matches || event.pointerType === "touch") return;
    const bounds = container.getBoundingClientRect();
    targetY = MathUtils.clamp((event.clientX - bounds.left - bounds.width / 2) / 750, -0.3, 0.3);
    targetX = MathUtils.clamp((event.clientY - bounds.top - bounds.height / 2) / 850, -0.18, 0.18);
    wake();
  }
  const resize = new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect();
    updateFrame(width, height);
  });
  const visibility = new IntersectionObserver(([entry]) => {
    visible = Boolean(entry?.isIntersecting);
    if (visible) wake();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  resize.observe(container);
  visibility.observe(container);
  window.addEventListener("pointermove", follow, { passive: true });
  container.addEventListener("click", cheer);
  document.documentElement.addEventListener("pointerleave", reset);
  window.addEventListener("blur", reset);
  document.addEventListener("visibilitychange", reset);
  motion.addEventListener("change", reset);
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);
  wake();

  return () => {
    cancelAnimationFrame(frame);
    resize.disconnect();
    visibility.disconnect();
    window.removeEventListener("pointermove", follow);
    container.removeEventListener("click", cheer);
    document.documentElement.removeEventListener("pointerleave", reset);
    window.removeEventListener("blur", reset);
    document.removeEventListener("visibilitychange", reset);
    motion.removeEventListener("change", reset);
    geometry.dispose();
    headGeometry.dispose();
    headTint.dispose();
    bellyTint.dispose();
    footGeometry.dispose();
    armGeometry.dispose();
    grassGeometry.dispose();
    contactGeometry.dispose();
    contactMaterial.dispose();
    contactTexture.dispose();
    bambooGeometry.dispose();
    treeGeometry.dispose();
    trunkGeometry.dispose();
    Object.values(materials).forEach((material) => material.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
