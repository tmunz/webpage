import React, { forwardRef } from 'react';
import { Vector3 } from "three";
import { NetworkNode3d } from "./NetworkGraphLayoutService";
import { Sphere } from '@react-three/drei';



export const NetworkGraphNode = forwardRef(function NetworkGraphNode(
  { node, objectInFocus, setDragNode, setObjectInFocus }:
    { node: NetworkNode3d, objectInFocus: string | null, setDragNode: (n: NetworkNode3d) => void, setObjectInFocus: (id: string | null) => void },
  ref: any
) {

  const color = node.userData.touched ? 0xff0000 : node.id === objectInFocus ? 0x00ff00 : 0x0077ff;
  const nodeMaterialProps = { color: color };
  const objProps = {
    scale: node.id === objectInFocus ? new Vector3(1.2, 1.2, 1.2) : new Vector3(1, 1, 1),
    userData: node,
    onPointerDown: () => {
      node.userData.touched = true;
      setDragNode(node);
    },
    onPointerOver: () => setObjectInFocus(node.id),
    onPointerLeave: () => node.id === objectInFocus && setObjectInFocus(null),
  };

  return <group
    key={node.id}
    ref={ref}
    position={[node.x, node.y, node.z]}
  >
    {node.userData.name &&
      <Sphere args={[10, 16, 16]} {...{ ...objProps }}>
        <meshBasicMaterial {...{ ...nodeMaterialProps }}
          transparent={false}
        >
          {/* <plane attach="clippingPlanes-0" normal={[0, 0, 1]} constant={0} /> */}
        </meshBasicMaterial>
      </Sphere>
    }
  </group>;
});