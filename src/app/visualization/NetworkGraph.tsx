import React, { useEffect, useRef } from 'react';
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
}

export function NetworkGraph({ nodes, links, width, height }: GraphData) {
  const svgRef = useRef<SVGSVGElement>(null);
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulationNodes = nodes.map((d) => ({ ...d, fx: d.x, fy: d.y }));

    const simulation = d3.forceSimulation<NetworkNode, NetworkLink>(simulationNodes)
      .force('charge', d3.forceManyBody())
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(links).id((d) => d.id))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .alphaDecay(0.01)
      .velocityDecay(0.9)
      .tick(600)

    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1);

    const node = svg
      .append('g')
      .selectAll<SVGCircleElement, Node>('circle')
      .data(simulationNodes)
      .enter()
      .append('circle')
      .attr('r', 6)
      .attr('fill', d => color(d.group ?? 'default'))
      .call(d3.drag()
        .on('start', (event, d: any /*NodeDatum*/) => {
          if (!event.active) {
            simulation.alphaTarget(0.3).restart();
          }
          if ('x' in d && 'y' in d) {
            d.fx = d.x;
            d.fy = d.y;
          }
        })
        .on('drag', (event, d: any /*NodeDatum*/) => {
          if ('x' in d && 'y' in d) {
            d.fx = event.x;
            d.fy = event.y;
          }
        })
        .on('end', (event, d: any /*NodeDatum*/) => {
          if (!event.active) simulation.alphaTarget(0);
          if ('x' in d && 'y' in d) {
            d.fx = null;
            d.fy = null;
          }
        }) as any, {});

    const label = svg
      .append('g')
      .selectAll('text')
      .data(simulationNodes)
      .enter()
      .append('text')
      .text((d) => d.name || d.id)
      .attr('font-size', 12)
      .attr('dx', 10)
      .attr('dy', 4);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: SimulationLinkDatum<NetworkNode>) => (typeof d.source === 'object' && 'x' in d.source) ? d.source.x ?? 0 : 0)
        .attr('y1', (d: SimulationLinkDatum<NetworkNode>) => (typeof d.source === 'object' && 'y' in d.source) ? d.source.y ?? 0 : 0)
        .attr('x2', (d: SimulationLinkDatum<NetworkNode>) => (typeof d.target === 'object' && 'x' in d.target) ? d.target.x ?? 0 : 0)
        .attr('y2', (d: SimulationLinkDatum<NetworkNode>) => (typeof d.target === 'object' && 'y' in d.target) ? d.target.y ?? 0 : 0);
      node
        .attr('cx', (d: NetworkNode) => d.x || 0)
        .attr('cy', (d: NetworkNode) => d.y || 0);
      label
        .attr('x', (d: NetworkNode) => d.x || 0)
        .attr('y', (d: NetworkNode) => d.y || 0);
    });

    simulationNodes.forEach((d) => {
      d.fx = undefined;
      d.fy = undefined;
    });
    simulation.alphaTarget(0.3).restart();

    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};


/*

import React, { useEffect, useRef, useState, MouseEvent } from 'react';
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
}

export function NetworkGraph({ nodes, links, width, height }: GraphData) {

  const svgRef = useRef<SVGSVGElement>(null);
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const [frame, setFrame] = useState<number>(0);
  const [draggedNode, setDraggedNode] = useState<SimulationNodeDatum | null>(null);

  let simulationNodes = useRef<NetworkNode[]>([]);
  let simulationLinks = useRef<SimulationLinkDatum<NetworkNode>[]>([]);
  let simulation = useRef(d3.forceSimulation<NetworkNode, NetworkLink>());


  simulation.current.on('tick', () => {
    console.log('tick', frame);
    setFrame(frame + 1);
  });

  useEffect(() => {
    simulationNodes.current = nodes; // nodes.map((d) => ({ ...d, fx: d.x, fy: d.y }));
    simulationLinks.current = links; //[...links];
    simulation.current
      .nodes(simulationNodes.current)
      .force('charge', d3.forceManyBody()) // Adjust the charge strength
      .force('link', d3.forceLink<NetworkNode, SimulationLinkDatum<NetworkNode>>(simulationLinks.current).id((d) => d.id)) // Adjust the link strength
      // .force('center', d3.forceCenter(width / 2, height / 2))
      // .alphaDecay(0.01) // Reduce the alpha decay to slow down the convergence
      // .velocityDecay(0.7) // Increase the velocity decay to slow down the motion
      .tick(600);

    if (frame == 1) {
      simulationNodes.current.forEach((d) => {
        d.fx = null;
        d.fy = null;
      });
      simulation.current.alphaTarget(0.3).restart();
      setFrame(frame + 1);
    }
    return () => {
      simulation.current.stop();
    };
  }, [nodes, links, width, height]);

  const onNodeDragStart = (node: SimulationNodeDatum, e: MouseEvent<SVGGElement>) => {
    console.log('drag start', node, e);
    node.fx = node.x;
    node.fy = node.y;
    simulation.current.alphaTarget(0.3).restart();
    setDraggedNode(node);
    document.addEventListener('mousemove', onNodeDrag.current);
    document.addEventListener('mouseup', onNodeDragEnd.current);
  };

  const onNodeDrag = useRef((e: any) => {
    if (draggedNode) {
      draggedNode.fx = e.clientX;
      draggedNode.fy = e.clientY;
    }
  });

  const onNodeDragEnd = useRef((e: any) => {
    if (draggedNode) {
      draggedNode.fx = null;
      draggedNode.fy = null;
    }
    simulation.current.alphaTarget(0);
    console.log(draggedNode, simulationNodes);
    document.removeEventListener('mousemove', onNodeDrag.current);
    document.removeEventListener('mouseup', onNodeDragEnd.current);
    setDraggedNode(null);
  });

  console.log('render', frame, simulationNodes, simulationLinks);

  return <div>
    <svg ref={svgRef} width={width} height={height}>
      <g>{simulationLinks.current.map((link, i) => (
        <line key={i} stroke="#999" strokeOpacity="0.6" strokeWidth={1}
          x1={(link.source as NetworkNode)?.x ?? 0} y1={(link.source as NetworkNode)?.y ?? 0}
          x2={(link.target as NetworkNode)?.x ?? 0} y2={(link.target as NetworkNode)?.y ?? 0}
        />
      ))}</g>
      <g>{simulationNodes.current.map(node => (
        <g key={node.id} onMouseDown={e => onNodeDragStart(node, e)}>
          <circle
            cx={node.x} cy={node.y} r={6} fill={color(node.group ?? 'default')} />
          <text x={node.x} y={node.y} fontSize="12" dx="10" dy="4">{node.name ?? node.id}</text>
        </g>
      ))}
      </g>
    </svg>
    {'' + frame}
  </div>;
};
*/