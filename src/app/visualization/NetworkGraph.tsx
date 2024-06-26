import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

import './NetworkGraph.styl';


export interface NetworkNode extends SimulationNodeDatum {
  id: string;
  name?: string;
  group?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: NetworkNode[];
  links: NetworkLink[];
  width: number;
  height: number;
  timeOffset?: number;
}


export function NetworkGraph({ nodes, links, width, height, timeOffset = 0 }: GraphData) {

  const svgRef = useRef<SVGSVGElement>(null);
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const frameRef = useRef<number>(0);
  const [frame, setFrame] = useState<number>(frameRef.current);
  const simulationNodes = useRef<NetworkNode[]>(nodes.map((d) => ({ ...d, fx: d.x, fy: d.y })));
  const simulationLinks = useRef<SimulationLinkDatum<NetworkNode>[]>([...links]);
  let simulation = d3.forceSimulation<NetworkNode, NetworkLink>();

  useEffect(() => {
    simulation
      .nodes(simulationNodes.current)
      .force('charge', d3.forceManyBody())
      .force('link', d3.forceLink<NetworkNode, SimulationLinkDatum<NetworkNode>>(simulationLinks.current).id((d) => d.id))
      .alphaDecay(0.01) // Reduce the alpha decay to slow down the convergence
      .velocityDecay(0.9) // Increase the velocity decay to slow down the motion
      ;

    simulation.on('tick', () => {
      frameRef.current += 1;
      setFrame(frameRef.current);
    });

    simulation.alphaTarget(0.01).restart();

    setTimeout(() => {
      simulationNodes.current.forEach((d) => {
        d.fx = null;
        d.fy = null;
      });
      simulation.alphaTarget(0.3).restart();
    }, timeOffset);

    nodeRefs.current.map((nodeRef, i) => {
      d3.select(nodeRef)
        .data([simulationNodes.current[i]])
        .call(d3.drag()
          .on('start', (event, d: any) => { // NodeDatum
            if (!event.active) {
              simulation.alphaTarget(0.3).restart();
            }
            if ('x' in d && 'y' in d) {
              d.fx = d.x;
              d.fy = d.y;
            }
          })
          .on('drag', (event, d: any) => { // NodeDatum
            if ('x' in d && 'y' in d) {
              d.fx = event.x;
              d.fy = event.y;
            }
          })
          .on('end', (event, d: any) => { // NodeDatum
            if (!event.active) {
              simulation.alphaTarget(0);
            }
            if ('x' in d && 'y' in d) {
              d.fx = null;
              d.fy = null;
            }
          }) as any, {});
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height]);

  return <div className="network-graph">
    <svg ref={svgRef} width={width} height={height}>
      <g className="links">{simulationLinks.current.map((link, i) => (
        <line className="link" key={i}
          x1={(link.source as NetworkNode)?.x ?? 0} y1={(link.source as NetworkNode)?.y ?? 0}
          x2={(link.target as NetworkNode)?.x ?? 0} y2={(link.target as NetworkNode)?.y ?? 0}
        />
      ))}</g>
      <g className="nodes">{simulationNodes.current.map((node, i) => (
        <g className="node" key={node.id}>
          <circle
            ref={el => nodeRefs.current[i] = el}
            cx={node.x} cy={node.y} r={6} fill={color(node.group ?? 'default')} />
          <text x={node.x} y={node.y} dx="10" dy="4">{node.name ?? node.id}</text>
        </g>
      ))}
      </g>
    </svg>
  </div>;
};
