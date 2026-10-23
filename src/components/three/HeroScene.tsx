import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A constructivist sculpture in the site's red / ink palette — the hero poster, brought into 3D.
 *
 * Interactions
 * - mouse moves the whole composition (parallax + camera drift)
 * - hover a shape: it swells and swaps colour
 * - click a shape: it gets a spin kick
 * - drag horizontally: spins the sculpture with inertia (touch-friendly, vertical scroll still works)
 * - scroll: the pieces drift apart as the hero leaves the screen
 */

type Tone = "accent" | "ink";

interface ShapeDef {
  geo: () => THREE.BufferGeometry;
  tone: Tone;
  pos: [number, number, number];
  rot: [number, number, number];
  float: number;
  spin: number;
}

const SHAPES: ShapeDef[] = [
  { geo: () => new THREE.BoxGeometry(2.4, 2.4, 2.4), tone: "accent", pos: [0.4, 0.2, 0], rot: [0.45, 0.65, 0.1], float: 0.12, spin: 0.12 },
  { geo: () => new THREE.SphereGeometry(1.3, 64, 64), tone: "ink", pos: [-2.3, 1.9, -0.8], rot: [0, 0, 0], float: 0.22, spin: 0 },
  { geo: () => new THREE.CylinderGeometry(1.35, 1.35, 0.7, 64, 1, false, 0, Math.PI), tone: "ink", pos: [2.5, -1.6, 0.6], rot: [Math.PI / 2, 0, 0.4], float: 0.18, spin: 0.1 },
  { geo: () => new THREE.TorusGeometry(1.05, 0.34, 32, 96, Math.PI), tone: "accent", pos: [2.4, 2.2, -0.6], rot: [0.2, -0.3, 0.2], float: 0.2, spin: 0.08 },
  { geo: () => new THREE.BoxGeometry(4.4, 0.55, 0.55), tone: "ink", pos: [-0.9, -2.7, 0.9], rot: [0.2, 0.3, -0.12], float: 0.1, spin: 0.05 },
  { geo: () => new THREE.CylinderGeometry(0.45, 0.45, 3, 48), tone: "accent", pos: [-3.3, -0.5, 0.6], rot: [0.2, 0, 0.35], float: 0.16, spin: 0.06 },
  { geo: () => new THREE.BoxGeometry(0.95, 0.95, 0.95), tone: "ink", pos: [1.3, 3.1, 1.2], rot: [0.6, 0.3, 0.2], float: 0.28, spin: 0.25 },
  { geo: () => new THREE.SphereGeometry(0.5, 48, 48), tone: "accent", pos: [-1.0, 3.1, 1.4], rot: [0, 0, 0], float: 0.28, spin: 0 },
  { geo: () => new THREE.ConeGeometry(0.8, 1.5, 4), tone: "ink", pos: [3.6, 0.4, 1.0], rot: [0.3, 0.4, -0.3], float: 0.22, spin: 0.2 },
  { geo: () => new THREE.CylinderGeometry(1.1, 1.1, 0.28, 64, 1, false, 0, Math.PI / 2), tone: "accent", pos: [-2.4, -2.4, -0.9], rot: [Math.PI / 2, 0, 0.2], float: 0.14, spin: 0.1 },
  { geo: () => new THREE.TorusGeometry(0.55, 0.16, 24, 64), tone: "ink", pos: [3.3, -3.0, -0.5], rot: [0.8, 0.2, 0], float: 0.2, spin: 0.3 },
];

/** Reads an "H S% L%" CSS token as an sRGB colour (setHSL defaults to linear, which washes it out). */
const readToken = (name: string, fallback: string, minLightness = 0) => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const [h, s, l] = raw.split(/\s+/).map(parseFloat);
  if ([h, s, l].some((v) => Number.isNaN(v))) return new THREE.Color(fallback);
  return new THREE.Color().setHSL(h / 360, s / 100, Math.max(l / 100, minLightness), THREE.SRGBColorSpace);
};

// Ink is lifted a touch above pure black so the toon shading bands stay readable
const readPalette = () => ({
  accent: readToken("--primary", "#ec1313"),
  ink: readToken("--foreground", "#0d0d0d", 0.12),
});

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

interface HeroSceneProps {
  ready: boolean;
  className?: string;
  onReady?: () => void;
  onError?: () => void;
}

const HeroScene = ({ ready, className, onReady, onError }: HeroSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(ready);
  const callbacks = useRef({ onReady, onError });
  callbacks.current = { onReady, onError };

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      callbacks.current.onError?.();
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionScale = reducedMotion ? 0 : 1;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "pan-y";
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 18);
    let baseZ = 18;

    // Tuned so the lit faces land on the exact brand red, with two darker bands
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(-5, 6, 8);
    const rim = new THREE.DirectionalLight(0xffffff, 0.6);
    rim.position.set(6, -3, -4);
    scene.add(key, rim);

    // Three-step toon ramp → flat, screen-printed shading
    const ramp = new THREE.DataTexture(new Uint8Array([40, 140, 255]), 3, 1, THREE.RedFormat);
    ramp.minFilter = THREE.NearestFilter;
    ramp.magFilter = THREE.NearestFilter;
    ramp.needsUpdate = true;

    const palette: Record<Tone, THREE.Color> = readPalette();

    const root = new THREE.Group();
    scene.add(root);

    const meshes = SHAPES.map((def, i) => {
      const material = new THREE.MeshToonMaterial({ color: palette[def.tone].clone(), gradientMap: ramp });
      const mesh = new THREE.Mesh(def.geo(), material);
      mesh.position.set(...def.pos);
      mesh.rotation.set(...def.rot);
      mesh.scale.setScalar(0.0001);
      mesh.userData = {
        def,
        index: i,
        base: new THREE.Vector3(...def.pos),
        hover: 0,
        spinVel: new THREE.Vector3(),
        phase: Math.random() * Math.PI * 2,
      };
      root.add(mesh);
      return mesh;
    });

    // Technical-drawing layer: wireframe icosahedron + dashed orbit with a satellite
    const wireMaterial = new THREE.LineBasicMaterial({ color: palette.ink.clone(), transparent: true, opacity: 0.12 });
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3.6, 1)), wireMaterial);
    wire.position.set(0.2, 0.1, -2.5);
    root.add(wire);

    const orbitRadius = 4.7;
    const orbitPoints = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, Math.PI * 2, false, 0).getPoints(180);
    const orbitMaterial = new THREE.LineDashedMaterial({
      color: palette.ink.clone(),
      dashSize: 0.16,
      gapSize: 0.14,
      transparent: true,
      opacity: 0.35,
    });
    const orbit = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(orbitPoints.map((p) => new THREE.Vector3(p.x, p.y, 0))),
      orbitMaterial,
    );
    orbit.computeLineDistances();
    orbit.rotation.set(1.15, 0.2, 0.3);
    root.add(orbit);

    const satelliteMaterial = new THREE.MeshToonMaterial({ color: palette.accent.clone(), gradientMap: ramp });
    const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 24), satelliteMaterial);
    orbit.add(satellite);

    // Drifting square "dust" for depth
    const dustCount = 140;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 16;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: palette.ink.clone(),
      size: 0.05,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // --- Interaction state -------------------------------------------------
    const pointer = new THREE.Vector2(0, 0);
    const ndc = new THREE.Vector2(9, 9);
    const raycaster = new THREE.Raycaster();
    let hovered: THREE.Mesh | null = null;
    let dragging = false;
    let lastX = 0;
    let dragVelocity = 0;
    let dragRotation = 0;
    let scrollProgress = 0;

    const section = mount.closest("section") ?? mount;

    const onWindowPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };

    const onCanvasMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      if (dragging) {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        dragVelocity = dx * 0.006;
        dragRotation += dragVelocity;
      }
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      if (hovered) {
        const v = hovered.userData.spinVel as THREE.Vector3;
        v.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12 + 6, (Math.random() - 0.5) * 6);
      }
    };

    const onUp = () => {
      dragging = false;
    };

    const onLeave = () => {
      ndc.set(9, 9);
      dragging = false;
    };

    const onScroll = () => {
      const h = (section as HTMLElement).offsetHeight || window.innerHeight;
      scrollProgress = clamp01(window.scrollY / h);
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      callbacks.current.onError?.();
    };

    window.addEventListener("pointermove", onWindowPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointermove", onCanvasMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);
    canvas.addEventListener("webglcontextlost", onContextLost);
    onScroll();

    // Fit the composition to whatever box the canvas lives in
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      baseZ = Math.max(21, 22 / camera.aspect);
      camera.position.z = baseZ;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    // Don't burn GPU while the hero is off-screen
    let inView = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    visibilityObserver.observe(mount);

    // Follow theme changes (light ↔ dark)
    const themeObserver = new MutationObserver(() => {
      const next = readPalette();
      palette.accent.copy(next.accent);
      palette.ink.copy(next.ink);
      wireMaterial.color.copy(palette.ink);
      orbitMaterial.color.copy(palette.ink);
      dustMaterial.color.copy(palette.ink);
      satelliteMaterial.color.copy(palette.accent);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // --- Render loop ------------------------------------------------------
    const startTime = performance.now();
    let lastTime = startTime;
    let introStart = -1;
    let raf = 0;
    let notified = false;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!inView) return;
      const t = (now - startTime) / 1000;

      if (readyRef.current && introStart < 0) introStart = t;
      const intro = introStart < 0 ? -1 : t - introStart;

      if (!dragging) {
        dragVelocity *= 0.94;
        dragRotation += dragVelocity;
      }

      root.rotation.y += (pointer.x * 0.35 + dragRotation - root.rotation.y) * 0.05;
      root.rotation.x += (-pointer.y * 0.18 - root.rotation.x) * 0.05;
      root.rotation.z = scrollProgress * 0.25;
      root.position.y = scrollProgress * 1.8;

      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(meshes, false)[0];
      hovered = hit ? (hit.object as THREE.Mesh) : null;

      const explode = 1 + scrollProgress * 0.9;

      for (const mesh of meshes) {
        const d = mesh.userData as {
          def: ShapeDef;
          index: number;
          base: THREE.Vector3;
          hover: number;
          spinVel: THREE.Vector3;
          phase: number;
        };

        const appear = intro < 0 ? 0 : reducedMotion ? 1 : easeOutBack(clamp01((intro - d.index * 0.07) / 0.9));
        d.hover += ((mesh === hovered ? 1 : 0) - d.hover) * 0.12;
        mesh.scale.setScalar(Math.max(appear * (1 + d.hover * 0.15), 0.0001));

        mesh.position.set(
          d.base.x * explode,
          d.base.y * explode + Math.sin(t * 0.8 + d.phase) * d.def.float * motionScale,
          d.base.z + scrollProgress * 2,
        );

        mesh.rotation.x += (d.def.spin * 0.6 * motionScale + d.spinVel.x) * dt;
        mesh.rotation.y += (d.def.spin * motionScale + d.spinVel.y) * dt;
        mesh.rotation.z += d.spinVel.z * dt;
        d.spinVel.multiplyScalar(0.96);

        // Hard colour swap (red ↔ ink) reads like a screen-print; the scale pop stays smooth
        const tone: Tone = d.hover > 0.5 ? (d.def.tone === "accent" ? "ink" : "accent") : d.def.tone;
        (mesh.material as THREE.MeshToonMaterial).color.copy(palette[tone]);
      }

      wire.rotation.x += dt * 0.05 * motionScale;
      wire.rotation.y += dt * 0.08 * motionScale;

      const a = t * 0.6 * (reducedMotion ? 0 : 1) + 0.8;
      satellite.position.set(Math.cos(a) * orbitRadius, Math.sin(a) * orbitRadius, 0);

      dust.rotation.y = t * 0.02 * motionScale;

      camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (pointer.y * 0.5 - camera.position.y) * 0.04;
      camera.position.z = baseZ;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      if (!notified) {
        notified = true;
        callbacks.current.onReady?.();
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onWindowPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointermove", onCanvasMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);

      scene.traverse((obj) => {
        const o = obj as THREE.Mesh;
        o.geometry?.dispose();
        const m = o.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      });
      ramp.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={mountRef} className={className} data-cursor="DRAG" aria-hidden />;
};

export default HeroScene;
