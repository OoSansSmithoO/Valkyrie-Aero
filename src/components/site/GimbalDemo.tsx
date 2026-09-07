import { Canvas, useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei/core/Grid.js";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from "react";
import * as THREE from "three";

type Sim = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  roll: number;
  speed: number;
  gimbalAz: number;
  gimbalEl: number;
  prop: number;
  cx: number;
  cy: number;
  cz: number;
};

type Drone = {
  x: number;
  y: number;
  z: number;
  alive: boolean;
  vy: number;
  spin: number;
  smoke: number;
};

type Tracer = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
};

type ControlsProbe = {
  getYaw: () => number;
  getSpeed: () => number;
  getRoll: () => number;
  setSteer?: (v: number) => void;
  setKeys?: (codes: string[]) => void;
};

declare global {
  interface Window {
    __controlsTest?: ControlsProbe;
  }
}

const SKIN = "#4a5158";
const DARK = "#1a1f24";
const GLASS = "#0b1411";
const GUN = "#2a2e32";
const TRACER_N = 72;
const DRONE_N = 4;

const _euler = new THREE.Euler();
const _off = new THREE.Vector3();

function wrapPi(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a));
}

function localPoint(s: Sim, lx: number, ly: number, lz: number, out: THREE.Vector3) {
  _euler.set(s.pitch, s.yaw, -s.roll, "YXZ");
  _off.set(lx, ly, lz).applyEuler(_euler);
  out.set(s.x + _off.x, s.y + _off.y, s.z + _off.z);
}

function freshSim(): Sim {
  return {
    x: 0,
    y: 4.2,
    z: 0,
    yaw: 0,
    pitch: 0.02,
    roll: 0,
    speed: 22,
    gimbalAz: 0.18,
    gimbalEl: -0.04,
    prop: 0,
    cx: 16,
    cy: 7,
    cz: -72,
  };
}

function spawnDrones(s: Sim, drones: Drone[]) {
  const fx = -Math.sin(s.yaw);
  const fz = -Math.cos(s.yaw);
  const rx = Math.cos(s.yaw);
  const rz = -Math.sin(s.yaw);
  for (let i = 0; i < DRONE_N; i++) {
    const along = 58 + i * 9;
    const side = (i - 1.5) * 7;
    drones[i] = {
      x: s.x + fx * along + rx * side,
      y: s.y + 1.8 + (i % 2) * 2.4,
      z: s.z + fz * along + rz * side,
      alive: true,
      vy: 0,
      spin: 0,
      smoke: 0,
    };
  }
}

function Blade({ i }: { i: number }) {
  const a = (i / 5) * Math.PI * 2;
  return (
    <mesh position={[Math.sin(a) * 0.62, Math.cos(a) * 0.62, 0]} rotation={[0, 0, -a]} castShadow>
      <boxGeometry args={[0.11, 1.05, 0.028]} />
      <meshStandardMaterial color={DARK} metalness={0.35} roughness={0.45} />
    </mesh>
  );
}

function SuperTucano({ simRef }: { simRef: MutableRefObject<Sim> }) {
  const root = useRef<THREE.Group>(null);
  const prop = useRef<THREE.Group>(null);
  const turret = useRef<THREE.Group>(null);
  const look = useMemo(() => new THREE.Vector3(), []);
  const origin = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const s = simRef.current;
    const g = root.current;
    if (g) {
      g.position.set(s.x, s.y, s.z);
      g.rotation.order = "YXZ";
      g.rotation.y = s.yaw;
      g.rotation.x = s.pitch;
      g.rotation.z = -s.roll;
    }
    if (prop.current) prop.current.rotation.z -= (4.2 + s.speed * 0.35) * dt;
    if (turret.current) {
      turret.current.getWorldPosition(origin);
      look.set(
        origin.x - Math.sin(s.gimbalAz) * Math.cos(s.gimbalEl) * 40,
        origin.y + Math.sin(s.gimbalEl) * 40,
        origin.z - Math.cos(s.gimbalAz) * Math.cos(s.gimbalEl) * 40,
      );
      turret.current.lookAt(look);
    }
  });

  return (
    <group ref={root}>
      <group ref={prop} position={[0, 0.02, -5.55]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[0.22, 12, 10]} />
          <meshStandardMaterial color={SKIN} metalness={0.55} roughness={0.32} />
        </mesh>
        {([0, 1, 2, 3, 4] as const).map((i) => (
          <Blade key={i} i={i} />
        ))}
      </group>

      <mesh position={[0, 0.02, -4.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.52, 0.58, 1.15, 16]} />
        <meshStandardMaterial color={SKIN} metalness={0.5} roughness={0.38} />
      </mesh>
      <mesh position={[0.42, 0.08, -4.35]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.18, 0.12, 0.55]} />
        <meshStandardMaterial color="#2a1c14" metalness={0.2} roughness={0.6} emissive="#3a2210" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-0.42, 0.08, -4.35]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.18, 0.12, 0.55]} />
        <meshStandardMaterial color="#2a1c14" metalness={0.2} roughness={0.6} emissive="#3a2210" emissiveIntensity={0.35} />
      </mesh>

      <mesh position={[0, 0.04, -3.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.54, 2.2, 16]} />
        <meshStandardMaterial color={SKIN} metalness={0.48} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, -0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.48, 0.5, 3.1, 16]} />
        <meshStandardMaterial color={SKIN} metalness={0.48} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.08, 2.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.48, 2.4, 12]} />
        <meshStandardMaterial color={SKIN} metalness={0.48} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.18, 4.55]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.22, 1.5, 10]} />
        <meshStandardMaterial color={SKIN} metalness={0.48} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.52, -2.85]} rotation={[0.12, 0, 0]}>
        <sphereGeometry args={[0.46, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshStandardMaterial color={GLASS} metalness={0.85} roughness={0.08} transparent opacity={0.62} />
      </mesh>
      <mesh position={[0, 0.58, -1.85]} rotation={[0.18, 0, 0]}>
        <sphereGeometry args={[0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
        <meshStandardMaterial color={GLASS} metalness={0.85} roughness={0.08} transparent opacity={0.62} />
      </mesh>
      <mesh position={[0, 0.38, -2.35]}>
        <boxGeometry args={[0.72, 0.06, 2.15]} />
        <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.45} />
      </mesh>

      <mesh position={[1.7, -0.12, -0.35]} rotation={[0, 0.05, 0.05]} castShadow>
        <boxGeometry args={[3.55, 0.07, 1.55]} />
        <meshStandardMaterial color={SKIN} metalness={0.45} roughness={0.42} />
      </mesh>
      <mesh position={[-1.7, -0.12, -0.35]} rotation={[0, -0.05, -0.05]} castShadow>
        <boxGeometry args={[3.55, 0.07, 1.55]} />
        <meshStandardMaterial color={SKIN} metalness={0.45} roughness={0.42} />
      </mesh>
      <mesh position={[3.55, -0.08, -0.15]}>
        <boxGeometry args={[0.55, 0.05, 0.22]} />
        <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.42} />
      </mesh>
      <mesh position={[-3.55, -0.08, -0.15]}>
        <boxGeometry args={[0.55, 0.05, 0.22]} />
        <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.42} />
      </mesh>
      {[1.35, 2.35].map((x) => (
        <mesh key={`p-l-${x}`} position={[x, -0.28, -0.15]}>
          <boxGeometry args={[0.08, 0.28, 0.7]} />
          <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.45} />
        </mesh>
      ))}
      {[-1.35, -2.35].map((x) => (
        <mesh key={`p-r-${x}`} position={[x, -0.28, -0.15]}>
          <boxGeometry args={[0.08, 0.28, 0.7]} />
          <meshStandardMaterial color={DARK} metalness={0.4} roughness={0.45} />
        </mesh>
      ))}

      <mesh position={[0.88, -0.16, -0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.032, 0.62, 8]} />
        <meshStandardMaterial color={GUN} metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[-0.88, -0.16, -0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.032, 0.62, 8]} />
        <meshStandardMaterial color={GUN} metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[1.35, -0.55, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.95, 10]} />
        <meshStandardMaterial color={GUN} metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[-1.35, -0.55, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.95, 10]} />
        <meshStandardMaterial color={GUN} metalness={0.65} roughness={0.3} />
      </mesh>

      <mesh position={[0, 1.15, 4.15]}>
        <boxGeometry args={[0.08, 1.85, 1.15]} />
        <meshStandardMaterial color={SKIN} metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.55, 3.55]} rotation={[0.55, 0, 0]}>
        <boxGeometry args={[0.07, 0.35, 1.1]} />
        <meshStandardMaterial color={SKIN} metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.55, 4.35]}>
        <boxGeometry args={[2.35, 0.05, 0.55]} />
        <meshStandardMaterial color={SKIN} metalness={0.45} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.35, 4.05]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.05, 0.55, 0.7]} />
        <meshStandardMaterial color={SKIN} metalness={0.45} roughness={0.4} />
      </mesh>

      <group ref={turret} position={[0, -0.48, -4.35]}>
        <mesh>
          <sphereGeometry args={[0.2, 18, 14]} />
          <meshStandardMaterial color="#2a3036" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.048, 0.48, 10]} />
          <meshStandardMaterial color={GUN} metalness={0.75} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.08, 16]} />
          <meshStandardMaterial color="#d8d8d8" emissive="#e10613" emissiveIntensity={0.4} metalness={0.4} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function Drones({ dronesRef }: { dronesRef: MutableRefObject<Drone[]> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    dronesRef.current.forEach((d, i) => {
      const child = g.children[i];
      if (!child) return;
      child.visible = d.alive || d.smoke > 0.05;
      child.position.set(d.x, d.y, d.z);
      child.rotation.z = d.spin;
      child.rotation.x += d.alive ? dt * 8 : dt * 3;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: DRONE_N }, (_, i) => (
        <group key={i}>
          <mesh>
            <boxGeometry args={[0.55, 0.12, 0.55]} />
            <meshStandardMaterial color="#9aa0a6" metalness={0.4} roughness={0.45} />
          </mesh>
          <mesh position={[0.38, 0.08, 0.38]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 10]} />
            <meshBasicMaterial color="#c8c8c8" />
          </mesh>
          <mesh position={[-0.38, 0.08, 0.38]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 10]} />
            <meshBasicMaterial color="#c8c8c8" />
          </mesh>
          <mesh position={[0.38, 0.08, -0.38]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 10]} />
            <meshBasicMaterial color="#c8c8c8" />
          </mesh>
          <mesh position={[-0.38, 0.08, -0.38]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 10]} />
            <meshBasicMaterial color="#c8c8c8" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Tracers({ tracersRef }: { tracersRef: MutableRefObject<Tracer[]> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const aim = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const inst = mesh.current;
    if (!inst) return;
    const list = tracersRef.current;
    for (let i = 0; i < TRACER_N; i++) {
      const t = list[i];
      if (!t || t.life <= 0) {
        dummy.scale.set(0, 0, 0);
        dummy.position.set(0, -20, 0);
      } else {
        dummy.scale.set(1, 1, 1);
        dummy.position.set(t.x, t.y, t.z);
        aim.set(t.x + t.vx, t.y + t.vy, t.z + t.vz);
        dummy.lookAt(aim);
      }
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, TRACER_N]}>
      <boxGeometry args={[0.035, 0.035, 1.15]} />
      <meshBasicMaterial color="#f4eee0" />
    </instancedMesh>
  );
}

function ChaseCam({ simRef }: { simRef: MutableRefObject<Sim> }) {
  const desired = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }, dt) => {
    const s = simRef.current;
    const fx = -Math.sin(s.yaw);
    const fz = -Math.cos(s.yaw);
    desired.set(s.x - fx * 16.5, s.y + 3.4, s.z - fz * 16.5);
    camera.position.lerp(desired, 1 - Math.exp(-dt * 3.2));
    look.set(s.x + fx * 3.5, s.y + 0.35, s.z + fz * 3.5);
    camera.up.set(0, 1, 0);
    camera.lookAt(look);
  });
  return null;
}

function Scene({
  simRef,
  dronesRef,
  tracersRef,
}: {
  simRef: MutableRefObject<Sim>;
  dronesRef: MutableRefObject<Drone[]>;
  tracersRef: MutableRefObject<Tracer[]>;
}) {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 28, 110]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[8, 14, 6]} intensity={1.25} color="#e8e4dc" />
      <directionalLight position={[-10, 4, -4]} intensity={0.4} color="#8a8a8a" />
      <Grid
        infiniteGrid
        fadeDistance={90}
        fadeStrength={1.15}
        sectionColor="#3a1014"
        cellColor="#161616"
        cellSize={2}
        sectionSize={10}
        position={[0, 0, 0]}
      />
      <SuperTucano simRef={simRef} />
      <Drones dronesRef={dronesRef} />
      <Tracers tracersRef={tracersRef} />
      <ChaseCam simRef={simRef} />
    </>
  );
}

const MUZZLES: { lx: number; ly: number; lz: number; gimbal: boolean }[] = [
  { lx: 0, ly: -0.48, lz: -4.55, gimbal: true },
  { lx: 0.88, ly: -0.16, lz: -1.25, gimbal: false },
  { lx: -0.88, ly: -0.16, lz: -1.25, gimbal: false },
  { lx: 1.35, ly: -0.55, lz: -0.7, gimbal: false },
  { lx: -1.35, ly: -0.55, lz: -0.7, gimbal: false },
];

export function GimbalDemo() {
  const [mounted, setMounted] = useState(false);
  const [crewed, setCrewed] = useState(false);
  const [firingUi, setFiringUi] = useState(false);
  const [hud, setHud] = useState({
    roll: "0.0",
    az: "0.0",
    el: "0.0",
    tas: "22",
    track: "TRACK STABLE",
  });
  const simRef = useRef<Sim>(freshSim());
  const dronesRef = useRef<Drone[]>(
    Array.from({ length: DRONE_N }, () => ({
      x: 16,
      y: 7,
      z: -72,
      alive: true,
      vy: 0,
      spin: 0,
      smoke: 0,
    })),
  );
  const tracersRef = useRef<Tracer[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const keyOverrideRef = useRef<string[] | null>(null);
  const steerOverrideRef = useRef<number | null>(null);
  const touchRollRef = useRef(0);
  const firingRef = useRef(false);
  const fireAcc = useRef(0);
  const muzzle = useMemo(() => new THREE.Vector3(), []);
  const crewedRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const hudAcc = useRef(0);
  const killFlash = useRef(0);
  crewedRef.current = crewed;

  useEffect(() => {
    spawnDrones(simRef.current, dronesRef.current);
    setMounted(true);
  }, []);

  useEffect(() => {
    const sim = simRef.current;
    const probe: ControlsProbe = {
      getYaw: () => sim.yaw,
      getSpeed: () => sim.speed,
      getRoll: () => sim.roll,
      setSteer: (v) => {
        steerOverrideRef.current = v;
      },
      setKeys: (codes) => {
        keyOverrideRef.current = codes.length ? codes : null;
        if (!codes.length) steerOverrideRef.current = null;
      },
    };
    window.__controlsTest = probe;
    return () => {
      if (window.__controlsTest === probe) delete window.__controlsTest;
    };
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (!crewedRef.current && !keyOverrideRef.current) return;
      keysRef.current.add(e.code);
      if (e.code === "Space" || e.code === "KeyF") {
        firingRef.current = true;
        e.preventDefault();
      }
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
      if (e.code === "Space" || e.code === "KeyF") firingRef.current = false;
    };
    const clear = () => {
      keysRef.current.clear();
      firingRef.current = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let t0 = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;
      const s = simRef.current;
      const held = new Set(keyOverrideRef.current ?? (crewedRef.current ? keysRef.current : []));
      let rollCmd = touchRollRef.current;
      if (steerOverrideRef.current != null) rollCmd = steerOverrideRef.current;
      else {
        if (held.has("KeyA") || held.has("ArrowLeft")) rollCmd += 1;
        if (held.has("KeyD") || held.has("ArrowRight")) rollCmd -= 1;
      }
      rollCmd = Math.max(-1, Math.min(1, rollCmd));
      let throttle = 0;
      if (held.has("KeyW") || held.has("ArrowUp")) throttle += 1;
      if (held.has("KeyS") || held.has("ArrowDown")) throttle -= 1;

      const targetRoll = rollCmd * 0.92;
      s.roll += (targetRoll - s.roll) * (1 - Math.exp(-dt * 3.4));
      const targetSpeed = 18 + throttle * 14;
      s.speed += (targetSpeed - s.speed) * (1 - Math.exp(-dt * 1.1));
      s.yaw += s.roll * 1.65 * dt;
      s.pitch += (0.02 - s.roll * 0.04 - s.pitch) * (1 - Math.exp(-dt * 2.2));
      const fx = -Math.sin(s.yaw);
      const fz = -Math.cos(s.yaw);
      s.x += fx * s.speed * dt;
      s.z += fz * s.speed * dt;
      s.y += Math.sin(s.pitch) * s.speed * dt * 0.25;
      s.y += (4.2 - s.y) * dt * 0.35;
      s.prop += s.speed * dt;

      const drones = dronesRef.current;
      let alive = 0;
      let nearest: Drone | null = null;
      let nearestD = 1e9;
      for (const d of drones) {
        if (d.alive) {
          alive += 1;
          d.y += Math.sin(now * 0.001 + d.x) * dt * 0.4;
          const dist = Math.hypot(d.x - s.x, d.y - s.y, d.z - s.z);
          if (dist < nearestD) {
            nearestD = dist;
            nearest = d;
          }
        } else {
          d.vy -= 18 * dt;
          d.y += d.vy * dt;
          d.spin += dt * 6;
          d.smoke = Math.max(0, d.smoke - dt);
        }
      }
      if (alive === 0 || nearestD < 22) spawnDrones(s, drones);

      if (nearest) {
        s.cx = nearest.x;
        s.cy = nearest.y;
        s.cz = nearest.z;
      }

      if (!crewedRef.current && keyOverrideRef.current == null && steerOverrideRef.current == null) {
        const desAz = Math.atan2(-(s.cx - s.x), -(s.cz - s.z));
        const desEl = Math.atan2(s.cy - s.y, Math.hypot(s.cx - s.x, s.cz - s.z));
        s.gimbalAz += wrapPi(desAz - s.gimbalAz) * (1 - Math.exp(-dt * 3.6));
        s.gimbalEl += (desEl - s.gimbalEl) * (1 - Math.exp(-dt * 3.6));
      }
      s.gimbalEl = Math.max(-0.7, Math.min(0.55, s.gimbalEl));

      const giz = -Math.sin(s.gimbalAz) * Math.cos(s.gimbalEl);
      const giy = Math.sin(s.gimbalEl);
      const gizZ = -Math.cos(s.gimbalAz) * Math.cos(s.gimbalEl);
      const fy = Math.sin(s.pitch);
      const fwx = -Math.sin(s.yaw) * Math.cos(s.pitch);
      const fwz = -Math.cos(s.yaw) * Math.cos(s.pitch);

      const tracers = tracersRef.current;
      for (let i = tracers.length - 1; i >= 0; i--) {
        const t = tracers[i];
        t.life -= dt;
        t.x += t.vx * dt;
        t.y += t.vy * dt;
        t.z += t.vz * dt;
        if (t.life <= 0) {
          tracers.splice(i, 1);
          continue;
        }
        for (const d of drones) {
          if (!d.alive) continue;
          if (Math.hypot(t.x - d.x, t.y - d.y, t.z - d.z) < 1.7) {
            d.alive = false;
            d.vy = -2;
            d.smoke = 2.4;
            t.life = 0;
            killFlash.current = 0.9;
          }
        }
      }

      const wantFire = firingRef.current || held.has("Space") || held.has("KeyF");
      if (wantFire && crewedRef.current) {
        fireAcc.current += dt;
        while (fireAcc.current > 0.055) {
          fireAcc.current -= 0.055;
          for (const m of MUZZLES) {
            if (tracers.length >= TRACER_N) break;
            localPoint(s, m.lx, m.ly, m.lz, muzzle);
            const dx = m.gimbal ? giz : fwx;
            const dy = m.gimbal ? giy : fy;
            const dz = m.gimbal ? gizZ : fwz;
            const spd = 86;
            tracers.push({
              x: muzzle.x,
              y: muzzle.y,
              z: muzzle.z,
              vx: dx * spd,
              vy: dy * spd,
              vz: dz * spd,
              life: 0.85,
            });
          }
        }
      } else {
        fireAcc.current = 0;
      }

      const azErr = wrapPi(Math.atan2(-(s.cx - s.x), -(s.cz - s.z)) - s.gimbalAz);
      const elErr = Math.atan2(s.cy - s.y, Math.hypot(s.cx - s.x, s.cz - s.z)) - s.gimbalEl;
      const err = Math.hypot(azErr, elErr);
      killFlash.current = Math.max(0, killFlash.current - dt);

      hudAcc.current += dt;
      if (hudAcc.current > 0.1) {
        hudAcc.current = 0;
        setFiringUi(wantFire && crewedRef.current);
        setHud({
          roll: ((s.roll * 180) / Math.PI).toFixed(1),
          az: ((s.gimbalAz * 180) / Math.PI).toFixed(1),
          el: ((s.gimbalEl * 180) / Math.PI).toFixed(1),
          tas: s.speed.toFixed(0),
          track: killFlash.current > 0 ? "KILL" : wantFire && crewedRef.current ? "GUNS HOT" : err < 0.12 ? "TRACK STABLE" : crewedRef.current ? "SLEW" : "ACQUIRE",
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [muzzle]);

  const slewFromPointer = (dx: number, dy: number) => {
    const s = simRef.current;
    s.gimbalAz -= dx * 0.0032;
    s.gimbalEl -= dy * 0.0032;
    s.gimbalEl = Math.max(-0.7, Math.min(0.55, s.gimbalEl));
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (document.pointerLockElement === stageRef.current) {
      slewFromPointer(e.movementX, e.movementY);
      return;
    }
    if (e.buttons !== 1) return;
    slewFromPointer(e.movementX, e.movementY);
  };

  const crew = () => {
    setCrewed(true);
    const el = stageRef.current;
    if (el && el.requestPointerLock) {
      void el.requestPointerLock();
    }
  };

  return (
    <div className="relative overflow-hidden bg-void hairline">
      <div
        ref={stageRef}
        className="relative aspect-[16/10] w-full touch-none"
        tabIndex={0}
        onPointerMove={onPointerMove}
        onPointerDown={(e) => {
          if (!crewed) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          firingRef.current = true;
        }}
        onPointerUp={() => {
          firingRef.current = false;
        }}
        onPointerLeave={() => {
          if (document.pointerLockElement !== stageRef.current) firingRef.current = false;
        }}
        onClick={() => {
          if (crewed) void stageRef.current?.requestPointerLock();
        }}
      >
        {mounted ? (
          <Canvas camera={{ position: [0, 7.5, 16], fov: 40 }} dpr={[1, 1.6]}>
            <Scene simRef={simRef} dronesRef={dronesRef} tracersRef={tracersRef} />
          </Canvas>
        ) : (
          <div className="h-full w-full bg-hangar" />
        )}

        <div className="pointer-events-none absolute inset-0 font-mono text-[10px] tracking-[0.2em] text-phosphor">
          <div className="absolute top-4 left-4 text-filament">GIMBAL ONLINE</div>
          <div className={`absolute top-4 right-4 ${hud.track === "GUNS HOT" || hud.track === "KILL" ? "text-filament" : ""}`}>
            {hud.track}
          </div>
          <div className="absolute bottom-4 left-4 text-fog">
            AZ {hud.az}° · EL {hud.el}°
          </div>
          <div className="absolute bottom-4 right-4 text-fog">
            ROLL {hud.roll}° · TAS {hud.tas}
          </div>
          <div className="absolute top-1/2 left-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 border border-phosphor/50" />
        </div>

        {!crewed ? (
          <button type="button" className="crew-gate" onClick={crew}>
            CLICK TO CREW
            <span>WASD BANKS · MOUSE SLEWS THE BALL · HOLD FIRE</span>
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-filament/20 px-4 py-3">
        <p className="font-mono text-[10px] tracking-[0.16em] text-fog">
          A-29 · CHIN BALL · WING .50 · PODS · HOLD LMB / SPACE
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="bank-pad"
            onPointerDown={() => {
              touchRollRef.current = 1;
              setCrewed(true);
            }}
            onPointerUp={() => {
              touchRollRef.current = 0;
            }}
            onPointerLeave={() => {
              touchRollRef.current = 0;
            }}
          >
            A BANK L
          </button>
          <button
            type="button"
            className={firingUi ? "fire-pad hot" : "fire-pad"}
            onPointerDown={() => {
              firingRef.current = true;
              setCrewed(true);
            }}
            onPointerUp={() => {
              firingRef.current = false;
            }}
            onPointerLeave={() => {
              firingRef.current = false;
            }}
          >
            FIRE
          </button>
          <button
            type="button"
            className="bank-pad"
            onPointerDown={() => {
              touchRollRef.current = -1;
              setCrewed(true);
            }}
            onPointerUp={() => {
              touchRollRef.current = 0;
            }}
            onPointerLeave={() => {
              touchRollRef.current = 0;
            }}
          >
            D BANK R
          </button>
        </div>
      </div>
    </div>
  );
}
