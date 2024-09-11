import React, { useEffect, useRef, useState } from 'react';
import { NetworkGraph, NetworkLink, NetworkNode } from '../../three/network-graph/NetworkGraph';
import { StipplingService } from '../../visualization/StipplingService';
import { linkData, nodeData } from './KnowledgeData';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { sRGBEncoding } from '@react-three/drei/helpers/deprecated';
import { Bloom, EffectComposer } from '@react-three/postprocessing';


export function Knowledge() {
  const elementRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<{ nodes: NetworkNode[], links: NetworkLink[] }>({ nodes: [{ id: 'root', name: 'me' }], links: [] });


  useEffect(() => {
    StipplingService.get().generate({ imgPath: require('./vita_bw.png'), samples: nodeData.length, threshold: 0.5 }).then((stippling) => {
      const center = { x: stippling.width / 2, y: stippling.height / 2 };
      const positionedNodes = stippling.points.map((point, i) => {
        const node: NetworkNode = {
          ...nodeData[i],
          x: (point.x - center.x) / stippling.width * 400,
          y: (point.y - center.y) / -stippling.height * 400,
        };
        if (node.id === 'root') {
          node.fx = 0;
          node.fy = 0;
          node.fz = 0;
        }
        return node;
      });
      setData({ nodes: positionedNodes, links: linkData });
    });
  }, [linkData, nodeData]);

  return (
    <Canvas
      gl={{ localClippingEnabled: true }}
      className="knowledge"
      ref={elementRef}
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 500], near: 0.1, far: 2000, fov: 40, up: [0, 1, 0] }}
    // frameloop="demand"
    >
      <Environment
        files={require('./vita_title.hdr')}
        encoding={sRGBEncoding}
        blur={1}
        background={false}
        backgroundRotation={[0, Math.PI / 2, 0]}
      />
      <NetworkGraph data={data} />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.5}
          mipmapBlur={true}
          luminanceSmoothing={0.5}
          opacity={0.1}
          intensity={3}
        />
      </EffectComposer>
    </Canvas>
  );
}
