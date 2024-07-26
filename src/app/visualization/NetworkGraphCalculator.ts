import { Matrix4, Quaternion, Vector3 } from "three";

export function calculateTransformationMatrix(start: Vector3, end: Vector3): Matrix4 {
  const direction = new Vector3().subVectors(end, start);
  const distance = direction.length();
  direction.normalize();

  const up = new Vector3(0, 1, 0);
  const quaternion = new Quaternion().setFromUnitVectors(up, direction);
  return new Matrix4().compose(
    new Vector3().addVectors(start, end).multiplyScalar(0.5),
    quaternion,
    new Vector3(1, distance, 1)
  );
}