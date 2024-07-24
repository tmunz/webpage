import React, { useEffect, useRef, useState } from 'react';
import { NetworkGraph, NetworkLink, NetworkNode } from '../../visualization/NetworkGraph';
import { StipplingService } from '../../visualization/StipplingService';
import { linkData, nodeData } from './KnowledgeData';
// @ts-ignore
import { Canvas, useFrame, useThree, useLoader, Group, invalidate } from '@react-three/fiber';
import { AccumulativeShadows, RandomizedLight, Environment } from '@react-three/drei';
import { sRGBEncoding } from '@react-three/drei/helpers/deprecated';


export function Knowledge() {
  const elementRef = useRef<HTMLCanvasElement>(null);
  const [clientRect, setClientRect] = useState<DOMRect>({ x: 0, y: 0, width: 0, height: 0 } as unknown as DOMRect);
  const [data, setData] = useState<{ nodes: NetworkNode[], links: NetworkLink[] }>({ nodes: [{ id: 'root' }], links: [] });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target instanceof HTMLCanvasElement) {
          setClientRect(entry.target.getBoundingClientRect());
        }
      }
    });

    if (elementRef.current) {
      resizeObserver.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    StipplingService.get().generate({ imgPath: require('./vita_bw.png'), width: clientRect.width, height: clientRect.height, samples: nodeData.length, threshold: 0.5 }).then((points) => {
      const positionedNodes = points.map((point, i) => ({ ...nodeData[i], x: point.x, y: point.y }));
      setData({ nodes: positionedNodes, links: linkData });
    });
  }, [clientRect, linkData, nodeData]);

  return (
    <Canvas
      className="knowledge"
      ref={elementRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, right: 0 }}
      camera={{ position: [-200, 0, 0], near: 0.1, far: 1000, fov: 100 }}
      frameloop="demand"
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
      />
      <NetworkGraph
        data={data}
      />
    </Canvas>
  );
}
