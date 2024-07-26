import React, { useRef, forwardRef } from 'react';
import { Color, Vector3 } from "three";
import { NetworkNode3d } from "./NetworkGraphLayoutService";
import { Sphere, Text, useMatcapTexture, MeshTransmissionMaterial, Detailed, Plane } from '@react-three/drei';



export const NetworkGraphNode = forwardRef(function NetworkGraphNode(
  { node, objectInFocus, setDragNode, setObjectInFocus }:
    { node: NetworkNode3d, objectInFocus: string | null, setDragNode: (n: NetworkNode3d) => void, setObjectInFocus: (id: string | null) => void },
  ref: any
) {

  const { current: textMatcap } = useRef(useMatcapTexture("C7C7D7_4C4E5A_818393_6C6C74"));
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
    {node.userData.name && <Detailed distances={[0, 50, 100]}>
      <Text
        fontSize={20 / node.userData.name.length}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0.1]}
      >
        {node.userData.name}
        <meshMatcapMaterial color="white" matcap={textMatcap[0]} />
      </Text>
      <Plane
        args={[8, 1]}
      >
        <meshMatcapMaterial color="white" matcap={textMatcap[0]} />
      </Plane>
      <Plane args={[0, 0]} visible={false} />
    </Detailed>}
    <Detailed distances={[0, 50, 100]}>
      <Sphere args={[10, 5, 5]} {...{ ...objProps }}>
        <MeshTransmissionMaterial {...{ ...nodeMaterialProps }}
          background={new Color('#839681')}
          backside={false}
          samples={1}
          resolution={1028}
          transmission={1}
          roughness={0}
          thickness={3.5}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.5}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
          opacity={0.2}
        />
      </Sphere>
      <Sphere args={[10, 4, 4]} {...{ ...objProps }}>
        <meshPhysicalMaterial {...{ ...nodeMaterialProps }}
          transparent
          opacity={0.8}
        />
      </Sphere>
      <Sphere args={[10, 3, 3]} {...{ ...objProps }}>
        <meshBasicMaterial {...{ ...nodeMaterialProps }}
          transparent={false}
        />
      </Sphere>
    </Detailed>
  </group>;
});