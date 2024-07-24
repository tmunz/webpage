import React, { useEffect, useState, useRef } from 'react';
import { Vector3, Matrix4, Color } from 'three';
import { NetworkLink as LayoutNetworkLink, NetworkNode as LayoutNetworkNode, NetworkNode3d, usePositions } from './NetworkGraphLayoutService';
import { useFrame } from '@react-three/fiber';
import { DragControls, Line, Sphere, Stats, Text, useMatcapTexture, MeshTransmissionMaterial } from '@react-three/drei';
import { NetworkGraphControls } from './NetworkGraphControls';

const nodeMaterialProps = {
  background: new Color('#839681'),
  backside: false,
  samples: 1,
  resolution: 1028,
  transmission: 1,
  roughness: 0,
  thickness: 3.5,
  ior: 1.5,
  chromaticAberration: 0.06,
  anisotropy: 0.1,
  distortion: 0.1,
  distortionScale: 0.3,
  temporalDistortion: 0.5,
  clearcoat: 1,
  attenuationDistance: 0.5,
  attenuationColor: '#ffffff',
  color: 0x0077ff,
  opacity: 0.2,
};

const NODE_MATERIAL = <MeshTransmissionMaterial {...nodeMaterialProps} />;
const NODE_MATERIAL_TOUCHED = <MeshTransmissionMaterial {... { ...nodeMaterialProps, color: 0xff0000 }} />
const NODE_MATERIAL_FOCUS = <MeshTransmissionMaterial {... { ...nodeMaterialProps, color: 0x00ff00 }} />

export interface NetworkLink extends LayoutNetworkLink { };
export interface NetworkNode extends LayoutNetworkNode { };

export interface Props {
  data: { nodes: NetworkNode[], links: NetworkLink[] };
}

export function NetworkGraph(props: Props) {

  let { current: requestAnimation } = useRef<boolean>(false);

  const [objectInFocus, setObjectInFocus] = useState<string | null>(null);
  const [dragNode, setDragNode] = useState<{ node: NetworkNode3d, origin: Vector3 } | null>(null);
  const dataRef = useRef({ ...props.data });
  const [time, setTime] = useState({ elapsed: 0, delta: 0 });
  const textMatcap = useMatcapTexture("C7C7D7_4C4E5A_818393_6C6C74");
  const objectOrientationRef = useRef<any>();

  const nodeObjectMap = useRef(new Map<string, any>());

  let renderData = usePositions(dataRef.current, time.delta);

  useEffect(() => {
    dataRef.current = { nodes: props.data.nodes, links: props.data.links };
  }, [props.data]);

  useFrame((state, delta) => {
    const groupQuaternion = objectOrientationRef.current.quaternion.clone().invert();
    const cameraQuaterion = state.camera.quaternion;
    nodeObjectMap.current?.forEach((v, k) => v.quaternion.multiplyQuaternions(groupQuaternion, cameraQuaterion));

    if (requestAnimation || !renderData.animationCompleted) { // TODO handel !renderData.animationCompleted differently
      requestAnimation = false;
      setTime({ elapsed: state.clock.getElapsedTime(), delta });
    }
  });

  const setNodeTouched = (node: NetworkNode3d) => {
    node.userData.touched = true;
  };

  return (
    <>
      <NetworkGraphControls
        ref={objectOrientationRef}
        enabled={dragNode === null}
      >
        {renderData.nodes.map(node => (
          <DragControls
            key={node.id}
            autoTransform={false}
            onDrag={(localMatrix, deltaLocalMatrix, worldMatrix, deltaWorldMatrix: Matrix4) => {
              node.x = (dragNode?.origin.x ?? 0) + deltaWorldMatrix.elements[12];
              node.y = (dragNode?.origin.y ?? 0) + deltaWorldMatrix.elements[13];
              node.z = (dragNode?.origin.z ?? 0) + deltaWorldMatrix.elements[14];
              requestAnimation = true;
            }}
            onDragEnd={() => {
              setDragNode(null);
              requestAnimation = true;
            }}
          >
            <group
              ref={e => e && nodeObjectMap.current.set(node.id, e)}
              position={[node.x, node.y, node.z]}
            >
              <Text
                fontSize={10 / node.userData.name.length}
                anchorX="center"
                anchorY="middle"
              >
                {node.userData.name}
                <meshMatcapMaterial color="white" matcap={textMatcap[0]} />
              </Text>
              <Sphere
                scale={node.id === objectInFocus ? [1.2, 1.2, 1.2] : [1, 1, 1]}
                args={[10, 3, 3]}
                userData={node}
                onPointerDown={(e) => {
                  setNodeTouched(node);
                  setDragNode({ node, origin: new Vector3(node.x, node.y, node.z) });
                }}
                onPointerOver={() => setObjectInFocus(node.id)}
                onPointerLeave={() => node.id === objectInFocus && setObjectInFocus(null)}
              >
                {node.userData.touched ? NODE_MATERIAL_TOUCHED : node.id === objectInFocus ? NODE_MATERIAL_FOCUS : NODE_MATERIAL}
              </Sphere>
            </group>
          </DragControls>
        ))}
        {renderData.links.map(link => {
          return (
            <Line
              key={`${link.source.id}-${link.target.id}`}
              lineWidth={1}
              points={[new Vector3(link.source.x, link.source.y, link.source.z), new Vector3(link.target.x, link.target.y, link.target.z)]}
              color={0x000000}
            />
          );
        })}
        <axesHelper args={[10]} />
      </NetworkGraphControls >
      <Stats />
    </>
  );
}
