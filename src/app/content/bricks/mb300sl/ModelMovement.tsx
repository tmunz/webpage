import { Line } from "@react-three/drei";
import { invalidate, useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";
import { useEffect, useMemo } from "react";
import { CatmullRomCurve3, Group, Object3D, Vector3 } from "three";
import { clamp } from "three/src/math/MathUtils";

export function ModelMovement({ model, animate, showPath = false }: { model: Object3D | null, animate?: boolean, showPath?: boolean }) {

  const { clock, invalidate } = useThree();

  const { current: track } = useRef(new CatmullRomCurve3([
    new Vector3(-30, 0, 30),
    new Vector3(-15, 0, 20),
    new Vector3(0, 0, 10),
    new Vector3(0, 0, 0),
  ]));

  const wheels: Group[] = useMemo(() => {
    const arr: Group[] = [];
    model?.traverse((child) => {
      if (child.name.startsWith('wheel')) {
        arr.push(child as Group);
      }
    });
    return arr;
  }, [model]);

  useEffect(() => {
    if (model) {
      drive(0);
      model.visible = true;
      invalidate();
    }
  }, [model]);

  useEffect(() => {
    if (animate) {
      clock.start();
      clock.elapsedTime = 0;
      invalidate();
    }
  }, [animate]);

  useFrame((state) => {
    if (animate) {
      const t = state.clock.getElapsedTime();
      const f = clamp(0, t * 0.3, 1);
      if (model && 0 <= f && f <= 1) {
        drive(easeOut(f));
        invalidate();
      }
    }
  });

  const drive = (f: number) => {
    if (model) {
      const p = track.getPointAt(f);
      model.position.copy(p);
      model.lookAt(p.clone().add(track.getTangentAt(f).normalize().negate()));
      wheels.forEach((wheel) => {
        wheel.rotation.x -= f/10;
      });
    }
  }

  const easeOut = (x: number) => {
    return 1 - (1 - x) * (1 - x);
  }

  return <Line points={track.getPoints(50)} color="red" lineWidth={2} visible={showPath} />;

}