import { Point3 } from "./Point3";

export const useLoadingBrickColor = (face: Point3[], lightDirection: { x: number; y: number; z: number }, minLight: number = 0) => {
  const getNormal = (face: Point3[]): Point3 | null => {
    if (face.length < 3) {
      return null;
    }

    const v1 = face[0];
    const v2 = face[1];
    const v3 = face[2];

    const edge1 = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
    const edge2 = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z };

    const normal = {
      x: edge1.y * edge2.z - edge1.z * edge2.y,
      y: edge1.z * edge2.x - edge1.x * edge2.z,
      z: edge1.x * edge2.y - edge1.y * edge2.x,
    };

    const magnitude = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);

    return {
      x: normal.x / magnitude,
      y: normal.y / magnitude,
      z: normal.z / magnitude,
    };
  };

  const normal = getNormal(face);
  if (normal && normal?.z >= 0) {
    const magnitude = Math.sqrt(
      lightDirection.x ** 2 + lightDirection.y ** 2 + lightDirection.z ** 2
    );
    const normalizedLight = {
      x: lightDirection.x / magnitude,
      y: lightDirection.y / magnitude,
      z: lightDirection.z / magnitude,
    };

    const intensity = normal ? Math.max(
      0,
      normal.x * normalizedLight.x +
      normal.y * normalizedLight.y +
      normal.z * normalizedLight.z
    ) : 0;

    const colorValue = minLight + Math.floor(intensity * (255 - minLight));

    return `rgb(${colorValue}, 0, 0)`;
  } else {
    return 'rgba(0, 0, 0, 0)';
  }
};
