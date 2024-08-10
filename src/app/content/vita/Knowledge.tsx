import React, { useEffect, useRef, useState } from 'react';
import { NetworkGraph, NetworkLink, NetworkNode } from '../../visualization/NetworkGraph';
import { StipplingService } from '../../visualization/StipplingService';
import { linkData, nodeData } from './KnowledgeData';
import { Canvas } from '@react-three/fiber';
import { AccumulativeShadows, RandomizedLight, Environment } from '@react-three/drei';
import { sRGBEncoding } from '@react-three/drei/helpers/deprecated';


export function Knowledge() {
  const elementRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<{ nodes: NetworkNode[], links: NetworkLink[] }>({ nodes: [{ id: 'root', name: 'me' }], links: [] });

  useEffect(() => {
    StipplingService.get().generate({ imgPath: require('./vita_bw.png'), samples: nodeData.length, threshold: 0.5 }).then((stippling) => {
      const center = { x: stippling.width / 2, y: stippling.height / 2 };
      const positionedNodes = stippling.points.map((point, i) => ({
        ...nodeData[i],
        x: (point.x - center.x) / stippling.width * 400,
        y: (point.y - center.y) / -stippling.height * 400,
      }));
      setData({ nodes: positionedNodes, links: linkData });
    });
  }, [linkData, nodeData]);

  return (
    <Canvas
      className="knowledge"
      ref={elementRef}
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 200], near: 0.1, far: 1000, fov: 100, up: [0, 1, 0] }}
    // frameloop="demand"
    >
      <AccumulativeShadows
        temporal
        frames={100}
        alphaTest={0.9}
        color="#3ead5d"
        colorBlend={1}
        opacity={0.8}
        scale={20}
      >
        <RandomizedLight radius={10} ambient={0.5} intensity={1} position={[2.5, 8, -2.5]} bias={0.001} />
      </AccumulativeShadows>
      <Environment
        files={require('./assets/dunes.hdr')}
        encoding={sRGBEncoding}
        blur={1}
        background={false}
        backgroundRotation={[0, Math.PI / 2, 0]}
      />
      <NetworkGraph data={data} />
    </Canvas>
  );
}
