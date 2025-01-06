import { Point2 } from "./Point2";
import { Point3 } from "./Point3";

export const projectPoint = (point: Point3): Point2 => {
  return new Point2(point.x, point.y);
};
