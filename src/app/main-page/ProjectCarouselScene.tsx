/* eslint-disable react/no-unknown-property -- Three.js elements use the Fiber renderer. */
import React, { MutableRefObject, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { Color, DirectionalLight, Group, MathUtils, MeshStandardMaterial, Vector3 } from 'three';
import { featuredProjects } from './FeaturedProjects';
import { ProjectArtwork } from './ProjectArtwork';
import { ArtworkProps } from './artwork/ArtworkSurface';
import { usePagePointer } from './usePagePointer';

interface SceneProps {
  index: number;
  reducedMotion: boolean;
  running: boolean;
  paused: boolean;
  onReady: () => void;
  onProjectPointerDown: (index: number) => void;
}

function Artwork({ projectIndex, selected, reducedMotion, time, interaction, motion, onProjectPointerDown }: ArtworkProps & {
  projectIndex: number; selected: number; reducedMotion: boolean; time: MutableRefObject<number>;
  onProjectPointerDown: (index: number) => void;
}) {
  const group = useRef<Group>(null);
  const frameMaterial = useRef<MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const frameColor = useRef(new Color());
  const neutralInput = useRef(new Vector3());
  const slot = ((projectIndex - selected + 4) % 3) - 1;
  const initialPosition = useRef<[number, number, number]>([slot * 3.15, 0, slot === 0 ? 0.6 : -1.3]);
  const project = featuredProjects[projectIndex];
  const invalidate = useThree(state => state.invalidate);

  useEffect(() => {
    setHovered(false);
  }, [selected]);

  useLayoutEffect(() => {
    if (!group.current || !reducedMotion) return;
    group.current.position.set(slot * 3.15, slot === 0 ? 0.12 : -0.12, slot === 0 ? 0.6 : -1.3);
    group.current.rotation.set(0, -slot * 0.38, -slot * 0.06);
    invalidate();
  }, [slot, reducedMotion, invalidate]);

  useFrame((_, delta) => {
    const t = Math.min(delta, 0.05);
    if (frameMaterial.current) {
      frameColor.current.set(hovered ? '#454541' : '#242423');
      frameMaterial.current.color.lerp(frameColor.current, reducedMotion ? 1 : 1 - Math.exp(-8 * t));
    }
    if (!group.current || reducedMotion) return;
    const active = slot === 0;
    const target = group.current;
    target.position.x = MathUtils.damp(target.position.x, slot * 3.15, 5, t);
    target.position.y = MathUtils.damp(target.position.y,
      (active ? 0.12 : -0.12) + Math.sin(time.current * 0.65 + projectIndex * 2) * 0.065, 5, t);
    target.position.z = MathUtils.damp(target.position.z, active ? 0.6 : -1.3, 5, t);
    target.rotation.x = MathUtils.damp(target.rotation.x, active ? -interaction.current.y * 0.18 : 0, 4, t);
    target.rotation.y = MathUtils.damp(target.rotation.y, -slot * 0.38 + (active ? interaction.current.x * 0.28 : 0), 4, t);
    target.rotation.z = MathUtils.damp(target.rotation.z, -slot * 0.06, 5, t);
  });

  return (
    <group ref={group} position={initialPosition.current} onPointerDown={event => {
      event.stopPropagation();
      if (event.button === 0) onProjectPointerDown(projectIndex);
    }}
    onPointerMove={event => {
      if (event.pointerType === 'touch' || !group.current) return;
      event.stopPropagation();
      setHovered(true);
      invalidate();
    }}
    onPointerOut={() => {
      setHovered(false);
      invalidate();
    }}>
      <RoundedBox args={[3.35, 2.65, 0.13]} radius={0.09} smoothness={4}>
        <meshStandardMaterial ref={frameMaterial} color="#242423" roughness={0.45} metalness={0.25} />
      </RoundedBox>
      <ProjectArtwork projectIndex={projectIndex} time={time}
        interaction={slot === 0 ? interaction : neutralInput} motion={slot === 0 ? motion : neutralInput} />
      <Html position={[0, -0.94, 0.14]} center zIndexRange={[1, 0]} style={{ pointerEvents: 'none' }}>
        <span className={`project-artwork-hint${hovered ? ' project-artwork-hint--visible' : ''}`}>Open project ↗</span>
      </Html>
      <mesh position={[-1.43, -1.19, 0.08]}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial color={project.color} />
      </mesh>
      <mesh position={[0.9, -1.19, 0.08]}>
        <planeGeometry args={[0.85, 0.012]} />
        <meshBasicMaterial color="#777773" />
      </mesh>
    </group>
  );
}

function Gallery({ index, reducedMotion, paused, onReady, onProjectPointerDown }: Omit<SceneProps, 'running'>) {
  const time = useRef(0);
  const { interaction, motion } = usePagePointer(reducedMotion);
  const rimLight = useRef<DirectionalLight>(null);
  const accent = useRef(new Color(featuredProjects[index].color));
  const viewport = useThree(state => state.viewport);
  const compact = useThree(state => state.size.width < 600);
  const camera = useThree(state => state.camera);
  const invalidate = useThree(state => state.invalidate);
  useEffect(onReady, [onReady]);
  useEffect(() => { accent.current.set(featuredProjects[index].color); }, [index]);
  useLayoutEffect(() => {
    if (!reducedMotion) return;
    camera.position.set(0, 0.15, 8.5);
    camera.lookAt(0, 0, 0);
    if (rimLight.current) rimLight.current.color.copy(accent.current);
    invalidate();
  }, [camera, invalidate, index, reducedMotion]);

  useFrame((_, delta) => {
    if (!paused && !reducedMotion) time.current += Math.min(delta, 0.05);
  }, -2);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const t = Math.min(delta, 0.05);
    camera.position.x = MathUtils.damp(camera.position.x,
      (index - 1) * 0.1 + Math.sin(time.current * 0.16) * 0.12, 2, t);
    camera.position.y = MathUtils.damp(camera.position.y, 0.15 + Math.sin(time.current * 0.22) * 0.06, 2, t);
    camera.position.z = MathUtils.damp(camera.position.z, 8.5 + Math.sin(time.current * 0.18) * 0.16, 2, t);
    camera.lookAt(0, 0, 0);
    rimLight.current?.color.lerp(accent.current, 1 - Math.exp(-2 * t));
  }, -1);

  return (
    <>
      <directionalLight ref={rimLight} position={[-4, 2, -1]} intensity={2.8} />
      <group scale={Math.min(viewport.width / (compact ? 5.8 : 9.6), viewport.height / 3.8)}>
        {featuredProjects.map((project, projectIndex) => (
          <Artwork key={project.repository} projectIndex={projectIndex} selected={index}
            reducedMotion={reducedMotion} time={time} interaction={interaction} motion={motion} onProjectPointerDown={onProjectPointerDown} />
        ))}
      </group>
    </>
  );
}

export default function ProjectCarouselScene({ index, reducedMotion, running, paused, onReady, onProjectPointerDown }: SceneProps) {
  return (
    <Canvas camera={{ position: [0, 0.15, 8.5], fov: 35 }} dpr={[1, 1.5]}
      frameloop={!running ? 'never' : reducedMotion ? 'demand' : 'always'}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}>
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 5, 6]} intensity={3} />
      <directionalLight position={[-5, 0, 2]} intensity={1} color="#d5d5fa" />
      <Suspense fallback={null}>
        <Gallery index={index} reducedMotion={reducedMotion} paused={paused} onReady={onReady}
          onProjectPointerDown={onProjectPointerDown} />
      </Suspense>
    </Canvas>
  );
}
