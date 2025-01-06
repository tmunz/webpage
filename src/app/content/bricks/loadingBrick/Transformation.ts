import { Point3 } from "./Point3";

export const translate = (
  point: Point3,
  translation: Point3,
): { x: number; y: number; z: number } => {
  const x = point.x + translation.x;
  const y = point.y + translation.y;
  const z = point.z + translation.z;

  return { x, y, z };
};

export const scale = (
  point: Point3,
  center: Point3,
  factor: number,
): { x: number; y: number; z: number } => {
  const translatedX = point.x - center.x;
  const translatedY = point.y - center.y;
  const translatedZ = point.z - center.z;

  const scaledX = translatedX * factor;
  const scaledY = translatedY * factor;
  const scaledZ = translatedZ * factor;

  const newX = scaledX + center.x;
  const newY = scaledY + center.y;
  const newZ = scaledZ + center.z;

  return { x: newX, y: newY, z: newZ };
}

export const rotateX = (
  point: Point3,
  center: Point3,
  rad: number,
): { x: number; y: number; z: number } => {
  const translatedX = point.x - center.x;
  const translatedY = point.y - center.y;
  const translatedZ = point.z - center.z;

  const cosTheta = Math.cos(rad);
  const sinTheta = Math.sin(rad);

  const rotatedY = translatedY * cosTheta - translatedZ * sinTheta;
  const rotatedZ = translatedY * sinTheta + translatedZ * cosTheta;

  const newX = translatedX + center.x;
  const newY = rotatedY + center.y;
  const newZ = rotatedZ + center.z;

  return { x: newX, y: newY, z: newZ };
};

export const rotateY = (
  point: Point3,
  center: Point3,
  rad: number,
): { x: number; y: number; z: number } => {
  const translatedX = point.x - center.x;
  const translatedY = point.y - center.y;
  const translatedZ = point.z - center.z;

  const cosTheta = Math.cos(rad);
  const sinTheta = Math.sin(rad);

  const rotatedX = translatedX * cosTheta + translatedZ * sinTheta;
  const rotatedZ = -translatedX * sinTheta + translatedZ * cosTheta;

  const newX = rotatedX + center.x;
  const newY = translatedY + center.y;
  const newZ = rotatedZ + center.z;

  return { x: newX, y: newY, z: newZ };
}