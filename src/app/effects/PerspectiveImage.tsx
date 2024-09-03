import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OrthographicCamera } from '@react-three/drei';

interface PerspectiveImageProps {
  img: string;
  depthImg: string;
  effectValue?: number;
  position?: { x: number, y: number };
}

export const PerspectiveImagePlane = ({ img, depthImg, effectValue = 0.5, position }: PerspectiveImageProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const positionRef = useRef(new THREE.Vector2(0, 0));
  const { pointer, size } = useThree();

  const [isTextureLoaded, setIsTextureLoaded] = useState(false);

  const originalTexture = useMemo(() => {
    const texture = new THREE.TextureLoader().load(img, () => {
      setIsTextureLoaded(true);
    });
    return texture;
  }, [img]);

  const depthTexture = useMemo(() => new THREE.TextureLoader().load(depthImg), [depthImg]);

  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      originalTexture: { value: originalTexture },
      depthTexture: { value: depthTexture },
      effectValue: { value: new THREE.Vector2(effectValue, effectValue) },
      position: { value: new THREE.Vector2(0, 0) },
    },
    fragmentShader: `
      uniform sampler2D originalTexture;
      uniform sampler2D depthTexture;
      uniform vec2 effectValue;
      uniform vec2 position;
      varying vec2 vUv;

      void main() {
        float depth = texture2D(depthTexture, vUv).r; // depthMap is expected to be grayscale, where r = b = g
        vec2 offset = (depth - 0.5) * position * effectValue * 0.1;
        gl_FragColor = texture2D(originalTexture, vUv + offset);
      }
    `,
    vertexShader: `
      varying vec2 vUv; 

      void main() {
        vUv = uv; 
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  }), [originalTexture, depthTexture, effectValue]);

  useEffect(() => {
    if (isTextureLoaded && ref.current && originalTexture.image) {
      const imgAspect = originalTexture.image.width / originalTexture.image.height;
      const adjustToWidth = imgAspect < size.width / size.height;
      ref.current.scale.set(
        adjustToWidth ? size.width : size.height * imgAspect,
        adjustToWidth ? size.width / imgAspect : size.height,
        1,
      );
    }
  }, [isTextureLoaded, originalTexture, size]);

  useFrame(() => {
    if (materialRef.current) {
      const p = (position ? position : { x: pointer.x / 2, y: pointer.y / 2 });
      positionRef.current.lerp(p, 0.1);
      materialRef.current.uniforms.position.value = positionRef.current;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1]} />
      <primitive ref={materialRef} object={shaderMaterial} attach="material" />
    </mesh>
  );
};

export const PerspectiveImage = (props: PerspectiveImageProps) => {
  return (
    <Canvas orthographic className='perspective-image'>
      <OrthographicCamera
        makeDefault
        near={0}
        far={2}
        position={[0, 0, 1]}
      />
      <PerspectiveImagePlane {...props} />
    </Canvas>
  );
};
