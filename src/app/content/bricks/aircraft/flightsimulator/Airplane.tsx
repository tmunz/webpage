import React, { useRef, forwardRef, ForwardedRef } from "react";
import { getRandomColor } from "../../../../utils/ColorUtils";
import { Group } from "three";


export const Airplane = forwardRef((props, ref: ForwardedRef<Group>) => {
  const colors = ['#dff69e', '#00ceff', '#002bca', '#ff00e0', '#3f159f', '#71b583', '#00a2ff'];
  const { current: color } = useRef(getRandomColor(colors));

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0, 0.06, 0.06, 4]} />
        <meshLambertMaterial color={0xff00dc} />
      </mesh>
      <mesh position={[0.065, -0.047, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.25, 0.1, 1.2]} />
        <meshLambertMaterial color={0x80f5fe} />
      </mesh>
    </group>
  );
});
