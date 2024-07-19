import React, { useEffect, useRef, useState } from 'react';
import { NetworkGraph, NetworkLink, NetworkNode } from '../../visualization/NetworkGraph';
import { StipplingService } from '../../visualization/StipplingService';
import { linkData, nodeData } from './KnowledgeData';

enum ActivationState { INACTIVE, LOADING, ACTIVE }

export function Knowledge() {

  const elementRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [activationState, setActivationState] = useState<ActivationState>(ActivationState.INACTIVE);

  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [links, setLinks] = useState<NetworkLink[]>([]);

  useEffect(() => {
    StipplingService.get().generate({ imgPath: require('./vita_bw.png'), width: size.width, height: size.height, samples: nodeData.length, threshold: 0.5 }).then((points) => {
      const positionedNodes = points.map((point, i) => ({ ...nodeData[i], x: point.x, y: point.y }));
      setNodes(positionedNodes);
      setLinks(linkData);
    });
  }, [size]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
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

  const setActive = () => {
    // TODO add loading
    setActivationState(ActivationState.ACTIVE);
  }

  return <div className="knowledge" ref={elementRef}>
    {activationState == ActivationState.INACTIVE && <button onClick={() => setActive()}>
      Show Knowledge Graph
    </button>}

    {activationState == ActivationState.ACTIVE && <NetworkGraph
      width={size.width}
      height={size.height}
      nodes={nodes}
      links={links}
      timeOffset={1000}
    />}

  </div >
}
