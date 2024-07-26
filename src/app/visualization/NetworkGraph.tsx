import React, { useState, useRef, useEffect } from 'react';
import { Vector3, Matrix4, Quaternion } from 'three';
import { NetworkLink as LayoutNetworkLink, NetworkNode as LayoutNetworkNode, NetworkNode3d, convertTo3d, updateNodePositions } from './NetworkGraphLayoutService';
import { invalidate, useFrame } from '@react-three/fiber';
import { DragControls, Stats } from '@react-three/drei';
import { NetworkGraphControls, } from './NetworkGraphControls';
import { NetworkGraphNode } from './NetworkGraphNode';
import { NetworkGraphPath } from './NetworkGraphPath';
import { calculateTransformationMatrix } from './NetworkGraphCalculator';

export interface NetworkLink extends LayoutNetworkLink { };
export interface NetworkNode extends LayoutNetworkNode { };

export interface Props {
  data: { nodes: NetworkNode[], links: NetworkLink[] };
}

export function NetworkGraph(props: Props) {

  const { current: transformationVector } = useRef(new Vector3());

  const orientationRef = useRef<{ quaternion: Quaternion }>({ quaternion: new Quaternion() });

  const nodeObjectMap = useRef(new Map<string, any>());
  const linkObjectMap = useRef(new Map<string, any>());

  const dataRef = useRef(convertTo3d(props.data.nodes, props.data.links));

  const [objectInFocus, setObjectInFocus] = useState<string | null>(null);
  const [dragNode, setDragNode] = useState<NetworkNode3d | null>(null);

  useEffect(() => {
    dataRef.current = convertTo3d(props.data.nodes, props.data.links);
    invalidate();
  }, [props.data]);

  useFrame((state, delta) => {
    const groupQuaternion = orientationRef.current.quaternion.clone().invert();
    const cameraQuaterion = state.camera.quaternion;
    updateNodePositions(dataRef.current.nodes, dataRef.current.linkMap, delta);
    nodeObjectMap.current?.forEach((v, k) => {
      const updatedNodePositions = dataRef.current.nodeMap.get(k);
      if (updatedNodePositions) {
        v.quaternion.multiplyQuaternions(groupQuaternion, cameraQuaterion);
        v.position.set(updatedNodePositions.x, updatedNodePositions.y, updatedNodePositions.z);
      }
    });
    linkObjectMap.current?.forEach((v, k) => {
      const { sourceId, targetId } = v.userData;
      const source = dataRef.current.nodeMap.get(sourceId);
      const target = dataRef.current.nodeMap.get(targetId);
      if (source && target) {
        const matrix = calculateTransformationMatrix(new Vector3(source.x, source.y, source.z), new Vector3(target.x, target.y, target.z));
        // matrix.makeRotationFromQuaternion(groupQuaternion).makeRotationFromQuaternion(cameraQuaterion);
        v.matrix.copy(matrix);
        console.log(v.matrix, matrix);
      }
    });
  });

  return (
    <>
      <NetworkGraphControls ref={orientationRef} enabled={dragNode === null}>
        <DragControls
          autoTransform={false}
          onDrag={(_, deltaLocalMatrix: Matrix4) => {
            if (!dragNode) { return; }
            const m = deltaLocalMatrix.elements;
            const transformation = transformationVector.set(m[12], m[13], m[14]).applyQuaternion(orientationRef.current.quaternion.clone().invert());
            const speed = 0.02;
            dragNode.x += transformation.x * speed;
            dragNode.y += transformation.y * speed;
            dragNode.z += transformation.z * speed;
          }}
          onDragEnd={() => {
            setDragNode(null);
          }}
        >
          {dataRef.current.nodes.map(node =>
            <NetworkGraphNode
              key={node.id}
              node={node}
              objectInFocus={objectInFocus}
              setObjectInFocus={setObjectInFocus}
              setDragNode={setDragNode}
              ref={e => nodeObjectMap.current.set(node.id, e)}
            />
          )}
          {
            dataRef.current.links.map((link) => (
              <NetworkGraphPath
                key={`${link.source.id}---${link.target.id}`}
                points={[new Vector3(link.source.x, link.source.y, link.source.z), new Vector3(link.target.x, link.target.y, link.target.z)]}
                userData={{ sourceId: link.source.id, targetId: link.target.id }}
                ref={e => linkObjectMap.current.set(`${link.source.id}---${link.target.id}`, e)}
              />
            ))
          }
          < axesHelper args={[10]} />
        </DragControls>
      </NetworkGraphControls >
      <Stats />
    </>
  );
}
