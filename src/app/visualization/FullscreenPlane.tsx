import React, { forwardRef } from 'react';
import { MeshProps, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Mesh, Vector3 } from 'three';

export const FullscreenPlane = forwardRef<Mesh, MeshProps>((props: MeshProps, ref) => {
  const { size, camera } = useThree();

  const perspectiveCamera = camera as PerspectiveCamera;
  if (!perspectiveCamera.isPerspectiveCamera) {
    console.warn('FullscreenPlane only works with a PerspectiveCamera.');
    return null;
  }

  const planePosition: Vector3 = props.position as Vector3 ?? new Vector3(0, 0, 0);
  console.log('planePosition', (perspectiveCamera.position.z - planePosition.z), Math.tan((perspectiveCamera.fov * Math.PI) / 360));
  const planeHeight = 2 * (perspectiveCamera.position.z - planePosition.z) * Math.tan((perspectiveCamera.fov * Math.PI) / 360);
  const planeWidth = planeHeight * (size.width / size.height);


  return (
    <mesh ref={ref} {...props} position={planePosition}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      {props.children}
    </mesh>
  );
});
