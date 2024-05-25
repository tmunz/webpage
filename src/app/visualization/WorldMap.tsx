import React, { useEffect, useRef } from "react";
import * as d3 from 'd3';
import * as geodata from './world.geo.json';

export interface WorldMapData {
  name?: string;
  lat: number;
  lng: number;
}

export function WorldMap({ data, width = 100, height = 100 }: { data: WorldMapData, width?: number, height?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Initial projection and path generator
    const projection = d3.geoOrthographic()
      .scale(Math.min(width, height) / 2)
      .translate([width / 2, height / 2])
      .center([0, 0])
      .rotate([-data.lng, -data.lat])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    // Create a gradient for the globe
    const gradient = svg.append('defs')
      .append('radialGradient')
      .attr('id', 'globeGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '50%')
      .attr('fy', '50%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#222');
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#000');

    svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', Math.min(width, height) / 2)
      .style('fill', 'url(#globeGradient)');

    const mapGroup = svg.append('g');

    mapGroup.selectAll('path')
      .data(geodata.features)
      .enter().append('path')
      .attr('d', path as any)
      .attr('fill', '#555');

    const coordinates = projection([data.lng, data.lat]);
    if (coordinates) {
      mapGroup.append('circle')
        .attr('cx', coordinates[0])
        .attr('cy', coordinates[1])
        .attr('r', Math.min(5, Math.min(width, height) / 25))
        .attr('fill', 'rgba(255,0,0,0.7)');
    }

    const graticule = d3.geoGraticule();
    mapGroup.append('path')
      .datum(graticule())
      .attr('class', 'graticule')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(128,128,128,0.3)')
      .attr('stroke-width', 0.5);

  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};
