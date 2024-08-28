import { Transformation, Transformations, useTransformationAnimator } from './TransformationAnimator';


describe('useTransformationAnimator', () => {

  it('should return default transformation when no time is provided', () => {
    const transformations: Transformations = new Map();
    const animator = useTransformationAnimator(transformations);

    const defaultTransformation: Transformation = {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
    };

    expect(animator.get()).toEqual(defaultTransformation);
  });

  it('should correctly interpolate between transformations', () => {
    const transformations: Transformations = new Map([
      [0, { rotateX: 0, scaleX: 1, positionX: 0 }],
      [10, { rotateX: 90, scaleX: 2, positionX: 10 }],
    ]);

    const animator = useTransformationAnimator(transformations);

    const expectedTransformation = {
      rotateX: 45, // (90 - 0) * 0.5 + 0
      scaleX: 1.5, // (2 - 1) * 0.5 + 1
      positionX: 5, // (10 - 0) * 0.5 + 0
      rotateY: 0,
      rotateZ: 0,
      scaleY: 1,
      scaleZ: 1,
      positionY: 0,
      positionZ: 0,
    };

    expect(animator.get(5)).toEqual(expectedTransformation);
  });

  it('should return the last transformation if time exceeds the range', () => {
    const transformations: Transformations = new Map([
      [0, { rotateX: 0, scaleX: 1, positionX: 0 }],
      [10, { rotateX: 90, scaleX: 2, positionX: 10 }],
    ]);

    const animator = useTransformationAnimator(transformations);

    expect(animator.get(15)).toEqual({ rotateX: 90, scaleX: 2, positionX: 10, rotateY: 0, rotateZ: 0, scaleY: 1, scaleZ: 1, positionY: 0, positionZ: 0 });
  });

  it('should handle transformations with full data correctly', () => {
    const transformations: Transformations = new Map([
      [0, { rotateX: 10, scaleY: 2, positionZ: 5 }],
      [20, { rotateX: 30, scaleY: 3, positionZ: 15 }],
    ]);

    const animator = useTransformationAnimator(transformations);

    const expectedTransformation = {
      rotateX: 20, // (30 - 10) * 0.5 + 10
      rotateY: 0,
      rotateZ: 0,
      scaleX: 1,
      scaleY: 2.5, // (3 - 2) * 0.5 + 2
      scaleZ: 1,
      positionX: 0,
      positionY: 0,
      positionZ: 10, // (15 - 5) * 0.5 + 5
    };

    expect(animator.get(10)).toEqual(expectedTransformation);
  });
});
