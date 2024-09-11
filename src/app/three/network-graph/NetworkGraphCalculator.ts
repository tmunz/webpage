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

export const noiseGlsl = `
  float fade(float t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  float grad(int hash, float x) {
    int h = hash & 15;
    float grad = 1.0 + float(h & 7);
    if ((h & 8) != 0) grad = -grad; 
    return grad * x;
  }

  float lerp(float t, float a, float b) {
    return a + t * (b - a);
  }

  float noise(float x, float s) {
    int xi = int(floor(x + s * 255.0)) & 255;
    float xf = x - floor(x);
    float u = fade(xf);
    
    int aa = xi;
    int ab = xi + 1;

    float res = lerp(u, grad(aa, xf), grad(ab, xf - 1.0));
    return res;
  }

  float seamlessNoise(float x, float s, float period) {
    float loopedX = mod(x, period);
    float periodFraction = loopedX / period;

    float noiseValue1 = noise(loopedX, s);
    float noiseValue2 = noise(loopedX + 1.0, s);

    float blendFactor = fade(periodFraction);
    float res = lerp(blendFactor, noiseValue1, noiseValue2);

    return res;
  }
`;