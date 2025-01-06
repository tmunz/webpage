import { Point2 } from "./Point2";

export class Point3 extends Point2 {
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    super(x, y);
    this.z = z;
  }
}
