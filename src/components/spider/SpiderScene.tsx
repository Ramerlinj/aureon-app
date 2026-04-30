import { useRef, useState, useEffect, useMemo, Suspense } from "react";

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

const SpiderModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/spiderrobot.glb");

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * 0.18;
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.1) * 0.04;
  });

  return (
    <group ref={groupRef} scale={1.2} position={[0, -0.2, 0]}>
      <primitive object={scene} />
    </group>
  );
};

const SpiderSceneInner = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cameraProps = useMemo(
    () => ({ position: [0, 1.1, 3.2], fov: 30 }),
    [],
  );

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Canvas
      dpr={[1, 2]}
      camera={cameraProps}
      className="spider-canvas"
      style={{ touchAction: "none" }}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={["#030303"]} />
      <ambientLight intensity={0.45} />
      <directionalLight intensity={1.2} position={[4, 6, 4]} color="#ffffff" />
      <spotLight
        intensity={1.25}
        position={[-3, 6, 2]}
        color="#be1b1b"
        angle={0.5}
        penumbra={0.4}
      />
      <Suspense fallback={null}>
        <SpiderModel />
        <Environment preset="studio" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.35}
      />
    </Canvas>
  );
};

const SpiderScene = () => (
  <Suspense fallback={null}>
    <SpiderSceneInner />
  </Suspense>
);

useGLTF.preload("/spiderrobot.glb");

export default SpiderScene;
