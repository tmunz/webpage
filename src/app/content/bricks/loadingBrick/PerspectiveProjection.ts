import { Point2 } from "./Point2";
import { Point3 } from "./Point3";

export const projectPoint = (point: Point3, vanishingPoint: Point3): Point2 => {
  const factor = 1 + point.z / vanishingPoint.z;
  const x = vanishingPoint.x + ((point.x - vanishingPoint.x) * factor);
  const y = vanishingPoint.y + ((point.y - vanishingPoint.y) * factor);
  return new Point2(x, y);
};
