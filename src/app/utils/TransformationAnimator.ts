import { Object3D } from "three";

export interface Transformation {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export type Transformations = Map<number, Partial<Transformation>>;
export type TransformationMap = Map<number, Transformation>;

export function useTransformationAnimator(transformations: Transformations | TransformationMap) {

  const convertToTransformationMap = (raw: Transformations): TransformationMap => {
    const fullTransformation = (
      curr: Partial<Transformation>,
      prev?: Partial<Transformation>
    ): Transformation => {
      const transformation: Transformation = {
        rotateX: 0, rotateY: 0, rotateZ: 0,
        scaleX: 1, scaleY: 1, scaleZ: 1,
        positionX: 0, positionY: 0, positionZ: 0
      };
      return (Object.keys(transformation) as Array<keyof Transformation>).reduce((acc, key) => {
        acc[key] = curr[key] ?? prev?.[key] ?? acc[key];
        return acc;
      }, { ...transformation });
    };

    return Array.from(raw.entries())
      .sort(([keyA], [keyB]) => keyA - keyB)
      .reduce<Map<number, Transformation>>((acc, [key, value]) => {
        const prevState = acc.size > 0 ? acc.get([...acc.keys()].pop()!) : undefined;
        const fullState = fullTransformation(value, prevState);
        acc.set(key, fullState);
        return acc;
      }, new Map<number, Transformation>());
  };

  const get = (t?: number): Transformation => {
    const neutralTransformation: Transformation = {
      rotateX: 0, rotateY: 0, rotateZ: 0,
      scaleX: 1, scaleY: 1, scaleZ: 1,
      positionX: 0, positionY: 0, positionZ: 0
    };

    const keys = [...transformationsMap.keys()];

    if (t === undefined) {
      return neutralTransformation;
    } else if (t < keys[0]) {
      return transformationsMap.get(keys[0]) ?? neutralTransformation;
    } else if (keys[keys.length - 1] < t) {
      return transformationsMap.get(keys[keys.length - 1]) ?? neutralTransformation;
    }

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    for (let i = 0; i < keys.length - 1; i++) {
      const startKey = keys[i];
      const endKey = keys[i + 1];
      if (startKey <= t && t <= endKey) {
        const startState = transformationsMap.get(startKey)!;
        const endState = transformationsMap.get(endKey)!;
        const factor = (t - startKey) / (endKey - startKey);
        return (Object.keys(neutralTransformation) as Array<keyof Transformation>).reduce((acc, key) => {
          acc[key] = lerp(startState[key], endState[key], factor);
          return acc;
        }, { ...neutralTransformation });
      }
    }

    return transformationsMap.get(keys[keys.length - 1])!;
  }

  const transformationsMap: TransformationMap = convertToTransformationMap(transformations);

  return {
    get: (t: number) => get(t),
    getTransformationsMap: () => transformationsMap,
    apply: (obj: Object3D, t: number) => {
      const state = get(t);
      obj.rotation.set(state.rotateX, state.rotateY, state.rotateZ);
      obj.scale.set(state.scaleX, state.scaleY, state.scaleZ);
      obj.position.set(state.positionX, state.positionY, state.positionZ);
    }
  };
}
