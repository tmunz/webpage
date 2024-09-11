import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import { RepeatWrapping, TextureLoader, Vector2 } from "three";

export function Ground() {
  // https://polyhaven.com/a/rough_plasterbrick_05
  const [roughness, normal] = useLoader(TextureLoader, [
    require('./assets/terrain-roughness.jpg'),
    require('./assets/terrain-normal.jpg'),
  ]);

  useEffect(() => {
    [normal, roughness].forEach((t) => {
      t.wrapS = RepeatWrapping;
      t.wrapT = RepeatWrapping;
      t.repeat.set(5, 5);
      t.offset.set(0, 0);
    });
  }, [normal, roughness]);

  return (
    <mesh rotation-x={-Math.PI * 0.5} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <MeshReflectorMaterial
        envMapIntensity={100}
        normalMap={normal}
        normalScale={new Vector2(0.15, 0.15)}
        roughnessMap={roughness}
        dithering
        color={[0.015, 0.015, 0.015]}
        roughness={0.7}
        blur={[100, 40]} // Blur ground reflections (width, heigt), 0 skips blur
        mixBlur={30} // How much blur mixes with surface roughness (default = 1)
        mixStrength={80} // Strength of the reflections
        mixContrast={1} // Contrast of the reflections
        resolution={128} // Off-buffer resolution, lower=faster, higher=better quality, slower
        mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
        depthScale={0.01} // Scale the depth factor (0 = no depth, default = 0)
        minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
        maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
        depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
        reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
      />
    </mesh>
  );
}
