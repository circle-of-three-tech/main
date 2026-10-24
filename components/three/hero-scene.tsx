"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Edges, Environment, Float, Lightformer, RoundedBox, Sparkles } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "@/lib/theme";

const PALETTES = {
  dark: { line: "#F5F7FF", accent: "#3DF2FF", violet: "#7B5CFF", face: "#05061A", faceOpacity: 0.55, glass: "#e8f1ff", ambient: 0.4 },
  light: { line: "#0B0F3A", accent: "#0077A3", violet: "#5A3FE0", face: "#0B0F3A", faceOpacity: 0.85, glass: "#ffffff", ambient: 0.9 },
};
type Palette = (typeof PALETTES)["dark"];

const ISO_X = Math.atan(1 / Math.SQRT2); // isometric tilt so cubes read like the logo
const CUBE_POSITIONS: [number, number, number][] = [
  [0, 0.92, 0],
  [-0.98, -0.72, 0],
  [0.98, -0.72, 0],
];
const SPLIT_DIRECTIONS = CUBE_POSITIONS.map(([x, y]) => new THREE.Vector3(x, y, 0).normalize());

function scrollProgress() {
  if (typeof window === "undefined") return 0;
  return Math.min(1, window.scrollY / (window.innerHeight * 0.9));
}

function GlassCube({ index, c }: { index: number; c: Palette }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const base = new THREE.Vector3(...CUBE_POSITIONS[index]);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const p = scrollProgress();
    // On scroll the triad splits apart: Build / Scale / Transform
    const target = base.clone().add(SPLIT_DIRECTIONS[index].clone().multiplyScalar(p * 2.4));
    g.position.lerp(target, 1 - Math.pow(0.001, delta));
    const s = hovered ? 1.12 : 1;
    g.scale.lerp(new THREE.Vector3(s, s, s), 1 - Math.pow(0.002, delta));
    g.rotation.y += delta * (0.15 + index * 0.05 + (hovered ? 0.8 : 0));
    g.rotation.x = ISO_X + Math.sin(state.clock.elapsedTime * 0.4 + index) * 0.08;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5} floatingRange={[-0.08, 0.08]}>
      <group ref={ref} position={base} rotation={[ISO_X, Math.PI / 4, 0]}>
        <RoundedBox
          args={[1.1, 1.1, 1.1]}
          radius={0.06}
          smoothness={4}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => setHovered(false)}
        >
          <meshPhysicalMaterial
            color={c.glass}
            transmission={1}
            thickness={1.1}
            roughness={0.04}
            ior={1.45}
            iridescence={1}
            iridescenceIOR={1.3}
            clearcoat={1}
            attenuationColor="#3DF2FF"
            attenuationDistance={2.5}
            envMapIntensity={1.4}
          />
        </RoundedBox>
        <mesh scale={1.004}>
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshBasicMaterial visible={false} />
          <Edges color={hovered ? c.accent : c.line} lineWidth={1.6} />
        </mesh>
        {/* solid dark face echoing the logo's shaded side */}
        <mesh position={[0.555, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.0, 1.0]} />
          <meshBasicMaterial color={c.face} transparent opacity={c.faceOpacity} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

function Rings({ c }: { c: Palette }) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (outer.current) outer.current.rotation.z += delta * 0.08;
    if (inner.current) {
      inner.current.rotation.x += delta * 0.12;
      inner.current.rotation.y += delta * 0.1;
    }
    if (orbit.current) orbit.current.rotation.z -= delta * 0.6;
  });
  return (
    <group>
      <mesh ref={outer}>
        <torusGeometry args={[2.55, 0.012, 16, 220]} />
        <meshBasicMaterial color={c.line} toneMapped={false} />
      </mesh>
      <mesh ref={inner} rotation={[1.2, 0.3, 0]}>
        <torusGeometry args={[2.95, 0.006, 16, 220]} />
        <meshBasicMaterial color={c.violet} toneMapped={false} transparent opacity={0.8} />
      </mesh>
      <group ref={orbit}>
        <mesh position={[2.55, 0, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={c.accent} toneMapped={false} />
        </mesh>
        <pointLight position={[2.55, 0, 0.2]} color="#3DF2FF" intensity={6} distance={3} />
      </group>
    </group>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = scrollProgress();
    const k = 1 - Math.pow(0.01, delta);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.35 + p * 0.8, k);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.y * 0.25, k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, p * 0.6, k);
  });
  return <group ref={group}>{children}</group>;
}

export default function HeroScene() {
  const c = PALETTES[useTheme()];
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 10.5], fov: 38 }}
      style={{ background: "transparent" }}
    >
      <AdaptiveDpr pixelated={false} />
      <ambientLight intensity={c.ambient} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-5, -3, 2]} intensity={1.2} color="#7B5CFF" />
      <Rig>
        {CUBE_POSITIONS.map((_, i) => (
          <GlassCube key={i} index={i} c={c} />
        ))}
        <Rings c={c} />
        <Sparkles count={70} scale={[7, 5, 3]} size={2.2} speed={0.35} color={c.accent} opacity={0.7} />
      </Rig>
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 4, -4]} scale={[10, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={3} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#3DF2FF" />
        <Lightformer form="rect" intensity={3} position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#7B5CFF" />
        <Lightformer form="ring" intensity={2} position={[0, 0, 6]} scale={3} color="#ffffff" />
      </Environment>
    </Canvas>
  );
}
