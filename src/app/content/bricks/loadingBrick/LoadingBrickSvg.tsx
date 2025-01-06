import React from "react";
import { Point3 } from "./Point3";
import { projectPoint } from "./PerspectiveProjection";
import { useLoadingBrickColor } from "./LoadingBrickColor";
import { rotateX, rotateY, scale, translate } from "./Transformation";
import { Point2 } from "./Point2";

export interface LoadingBrickSvgProps {
  width: number;
  height: number;
  xRotation: number;
  yRotation: number;
  light: Point3;
  minLightIntensity?: number;
  studs?: [number, number];
}

export const LoadingBrickSvg = ({ width, height, xRotation, yRotation, light, minLightIntensity = 0, studs = [4, 2] }: LoadingBrickSvgProps) => {

  const BEZIER_CIRCLE = 0.552284749831; // Approximation for Bézier circle: 4/3 * (Math.sqrt(2) - 1)
  const BRICK_HEIGHT = 1.2; // 6/5;
  const STUD_RADIUS = 0.3125; // 5/16
  const STUD_HEIGHT = 0.177;

  const center = new Point3(width / 2, height / 2, 0);
  const scaleFactor = Math.min(width, height) / 5;
  const vanishingPoint = new Point3(width / 2, height / 2, Math.max(width, height) * 2);
  const studsX = studs[0];
  const studsZ = studs[1];

  const transformation = (point: Point3) => {
    let p = point;
    p = translate(p, center);
    p = scale(p, center, scaleFactor);
    p = rotateY(p, center, yRotation);
    p = rotateX(p, center, xRotation);
    return p;
  }

  const vertices = [
    new Point3(-studsX / 2, -BRICK_HEIGHT / 2, +studsZ / 2),
    new Point3(-studsX / 2, -BRICK_HEIGHT / 2, -studsZ / 2),
    new Point3(+studsX / 2, -BRICK_HEIGHT / 2, -studsZ / 2),
    new Point3(+studsX / 2, -BRICK_HEIGHT / 2, +studsZ / 2),
    new Point3(+studsX / 2, +BRICK_HEIGHT / 2, +studsZ / 2),
    new Point3(+studsX / 2, +BRICK_HEIGHT / 2, -studsZ / 2),
    new Point3(-studsX / 2, +BRICK_HEIGHT / 2, -studsZ / 2),
    new Point3(-studsX / 2, +BRICK_HEIGHT / 2, +studsZ / 2),
  ].map(transformation);
  const faces = [
    // [vertices[0], vertices[1], vertices[2], vertices[3]], // bottom
    [vertices[3], vertices[2], vertices[5], vertices[4]],
    [vertices[7], vertices[0], vertices[3], vertices[4]],
    [vertices[7], vertices[6], vertices[1], vertices[0]],
    [vertices[1], vertices[6], vertices[5], vertices[2]],
    [vertices[4], vertices[5], vertices[6], vertices[7]], // top
  ];

  const studSides = [...Array(studsX * studsZ)].map((_, i) =>
    new Point3(
      0.5 - studsX / 2 + (Math.floor(i % studsX)),
      BRICK_HEIGHT / 2,
      0.5 - studsZ / 2 + (Math.floor(i / studsX)),
    )
  ).map((studCenter) => {
    const r = STUD_RADIUS;
    const cr = BEZIER_CIRCLE * r;
    return [
      new Point3(studCenter.x + r, studCenter.y, studCenter.z),
      new Point3(studCenter.x + r, studCenter.y, studCenter.z + cr),
      new Point3(studCenter.x + cr, studCenter.y, studCenter.z + r),
      new Point3(studCenter.x, studCenter.y, studCenter.z + r),
      new Point3(studCenter.x - cr, studCenter.y, studCenter.z + r),
      new Point3(studCenter.x - r, studCenter.y, studCenter.z + cr),
      new Point3(studCenter.x - r, studCenter.y, studCenter.z),
      new Point3(studCenter.x - r, studCenter.y + STUD_HEIGHT, studCenter.z),
      new Point3(studCenter.x - r, studCenter.y + STUD_HEIGHT, studCenter.z + cr),
      new Point3(studCenter.x - cr, studCenter.y + STUD_HEIGHT, studCenter.z + r),
      new Point3(studCenter.x, studCenter.y + STUD_HEIGHT, studCenter.z + r),
      new Point3(studCenter.x + cr, studCenter.y + STUD_HEIGHT, studCenter.z + r),
      new Point3(studCenter.x + r, studCenter.y + STUD_HEIGHT, studCenter.z + cr),
      new Point3(studCenter.x + r, studCenter.y + STUD_HEIGHT, studCenter.z),
    ].map(p => rotateY(p, studCenter, -yRotation)).map(transformation);
  });

  const studTops = [...Array(studsX * studsZ)].map((_, i) =>
    new Point3(
      0.5 - studsX / 2 + (Math.floor(i % studsX)),
      BRICK_HEIGHT / 2 + STUD_HEIGHT,
      0.5 - studsZ / 2 + (Math.floor(i / studsX)),
    )
  ).map((center) => {
    const r = STUD_RADIUS;
    const cr = BEZIER_CIRCLE * r;
    return [
      new Point3(center.x + r, center.y, center.z),
      new Point3(center.x + r, center.y, center.z - cr),
      new Point3(center.x + cr, center.y, center.z - r),
      new Point3(center.x, center.y, center.z - r),
      new Point3(center.x - cr, center.y, center.z - r),
      new Point3(center.x - r, center.y, center.z - cr),
      new Point3(center.x - r, center.y, center.z),
      new Point3(center.x - r, center.y, center.z + cr),
      new Point3(center.x - cr, center.y, center.z + r),
      new Point3(center.x, center.y, center.z + r),
      new Point3(center.x + cr, center.y, center.z + r),
      new Point3(center.x + r, center.y, center.z + cr),
      new Point3(center.x + r, center.y, center.z),
    ].map(transformation);
  });

  const p = (point: Point2) => `${point.x} ${point.y}`;

  return <svg width={width} height={height}>
    <defs>
      <linearGradient id="studSideGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'rgba(200, 0, 0, 1)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: `rgba(${minLightIntensity}, 0, 0, 1)`, stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {faces.map((face, i) => {
      const { points, z } = face.reduce((acc, v) => {
        const p = projectPoint(v, vanishingPoint);
        return { points: `${acc.points} ${p.x}, ${height - p.y}`, z: Math.max(acc.z, Math.round(v.z)) };
      }, { points: '', z: Number.MIN_SAFE_INTEGER });
      return { path: <polygon key={`face-${i}`} points={points} fill={useLoadingBrickColor(face, light, minLightIntensity)} />, z };
    }).sort((a, b) => a.z - b.z).map(({ path }) => path)}
    {[
      ...studSides.map((studSide, i) => {
        const { points, z } = studSide.reduce((acc, v) => {
          const p = projectPoint(v, vanishingPoint);
          return { points: [...acc.points, { x: p.x, y: height - p.y }], z: Math.max(acc.z, Math.round(v.z)) };
        }, { points: [] as Point2[], z: Number.MIN_SAFE_INTEGER });
        const bezierPath = `
        M ${p(points[0])}
        C ${p(points[1])}, ${p(points[2])}, ${p(points[3])}
        C ${p(points[4])}, ${p(points[5])}, ${p(points[6])}
        L ${p(points[7])}
        C ${p(points[8])}, ${p(points[9])}, ${p(points[10])}
        C ${p(points[11])}, ${p(points[12])}, ${p(points[13])}
        Z`;
        return { path: <path key={`side-stud-${i}`} d={bezierPath} fill='url(#studSideGradient)' />, z };
      }),
      ...studTops.map((studTop, i) => {
        const { points, z } = studTop.reduce((acc, v) => {
          const p = projectPoint(v, vanishingPoint);
          return { points: [...acc.points, { x: p.x, y: height - p.y }], z: Math.max(acc.z, Math.round(v.z)) };
        }, { points: [] as Point2[], z: Number.MIN_SAFE_INTEGER });
        const bezierPath = `
        M ${p(points[0])}
        C ${p(points[1])}, ${p(points[2])}, ${p(points[3])}
        C ${p(points[4])}, ${p(points[5])}, ${p(points[6])}
        C ${p(points[7])}, ${p(points[8])}, ${p(points[9])}
        C ${p(points[10])}, ${p(points[11])}, ${p(points[12])}
        Z`;
        return { path: <path key={`top-stud-${i}`} d={bezierPath} fill={useLoadingBrickColor(studTop, light, minLightIntensity)} />, z };
      })
    ].sort((a, b) => a.z - b.z).map(({ path }) => path)}
  </svg>
};