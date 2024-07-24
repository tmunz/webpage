import { useMemo } from "react";


export interface NetworkNode {
  id: string;
  name?: string;
  x?: number;
  y?: number;
  z?: number;
}

export interface NetworkNode3d {
  id: string;
  userData: Record<string, any>;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export interface NetworkLink {
  source: string;
  target: string;
}

export interface NetworkLink3d {
  source: NetworkNode3d;
  target: NetworkNode3d;
}

const DESIRED_LINK_LENGTH = 10;
const REPULSION_FORCE = 1000;
const ATTRACTION_FORCE = 0.1;
const ANIMATION_THRESHOLD = 0.001;

export const usePositions = ({ nodes, links }: { nodes: NetworkNode[], links: NetworkLink[] }, deltaTime: number, speed = 1): { nodes: NetworkNode3d[], links: NetworkLink3d[], animationCompleted: boolean } => {

  const { nodes3d, nodeMap }: { nodes3d: NetworkNode3d[], nodeMap: Map<string, NetworkNode3d> } = useMemo(() => {
    return nodes.reduce((result, node) => {
      const node3d = {
        id: node.id,
        userData: { name: node.name },
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        z: Math.random() * 100 - 50,
        // x: node.x !== undefined ? node.x : Math.random() * 100 - 50,
        // y: node.y !== undefined ? node.y : Math.random() * 100 - 50,
        // z: node.z !== undefined ? node.z : Math.random() * 100 - 50,
        vx: 0,
        vy: 0,
        vz: 0,
      };
      result.nodes3d.push(node3d);
      result.nodeMap.set(node3d.id, node3d);
      return result;
    }, { nodes3d: [] as NetworkNode3d[], nodeMap: new Map<string, NetworkNode3d>() });
  }, [nodes]);

  const { links3d, linkMap }: { links3d: NetworkLink3d[], linkMap: Map<string, NetworkNode3d[]> } = useMemo(() => {
    return links.reduce((result, link) => {
      const source = nodes3d.find(n => n.id === link.source);
      const target = nodes3d.find(n => n.id === link.target);
      if (source && target) {
        result.links3d.push({ source, target });

        if (!result.linkMap.has(source.id)) { result.linkMap.set(source.id, []); }
        result.linkMap.get(source.id)?.push(target);

        if (!result.linkMap.has(target.id)) { result.linkMap.set(target.id, []); }
        result.linkMap.get(target.id)?.push(source);
      }
      return result;
    }, { links3d: [] as NetworkLink3d[], linkMap: new Map<string, NetworkNode3d[]>() });
  }, [nodes3d, links]);

  let graphActivity = 0;

  for (let node of nodes3d) {
    let vx = node.vx;
    let vy = node.vy;
    let vz = node.vz;
    for (let otherNode of nodes3d) {
      if (node !== otherNode) {
        const dx = node.x - otherNode.x;
        const dy = node.y - otherNode.y;
        const dz = node.z - otherNode.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
        const force = Math.max(0.01, REPULSION_FORCE / (distance * distance));
        vx += force * dx / distance;
        vy += force * dy / distance;
        vz += force * dz / distance;
      }
    }

    for (let otherNode of linkMap.get(node.id) || []) {
      const dx = otherNode.x - node.x;
      const dy = otherNode.y - node.y;
      const dz = otherNode.z - node.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
      const force = Math.max(0.01, ATTRACTION_FORCE * (distance - DESIRED_LINK_LENGTH));
      vx += force * dx / distance;
      vy += force * dy / distance;
      vz += force * dz / distance;
    }

    const timeMultiplier = 1; // deltaTime * speed * 60;

    const adjustedByTimeX = vx * timeMultiplier;
    const adjustedByTimeY = vy * timeMultiplier;
    const adjustedByTimeZ = vz * timeMultiplier;

    node.x += adjustedByTimeX;
    node.y += adjustedByTimeY;
    node.z += adjustedByTimeZ;
    node.vx = vx - adjustedByTimeX;
    node.vy = vy - adjustedByTimeY;
    node.vz = vz - adjustedByTimeZ;

    graphActivity += Math.abs(vx) + Math.abs(vy) + Math.abs(vz);
  }

  const animationCompleted = nodes3d.length !== 0 ? graphActivity / nodes3d.length ** 2 < ANIMATION_THRESHOLD : true;
  return { nodes: nodes3d, links: links3d, animationCompleted };
};
