import React, { forwardRef } from 'react';
import { Quaternion, Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { a, useSpring } from '@react-spring/three';
import { useGesture, FullGestureState } from '@use-gesture/react'; // Import FullGestureState

export type NetworkGraphControlProps = {
  cursor?: boolean;
  speed?: number;
  rotation?: [number, number, number];
  config?: any;
  enabled?: boolean;
  children?: React.ReactNode;
  domElement?: HTMLElement;
}

export const NetworkGraphControls = forwardRef(
  function NetworkGraphControls({ enabled = true, domElement, children,
    speed = 1, rotation = [0, 0, 0], config = { mass: 1, tension: 170, friction: 26 } }: NetworkGraphControlProps,
    ref: any) {

    const { camera, gl, events } = useThree();
    const explDomElement = domElement || events.connected || gl.domElement;

    const [spring, api] = useSpring(() => ({ scale: 1, rotation, config }));
    // TODO spring



    const rotationHandler = (event: Omit<FullGestureState<"drag">, "event"> & { event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent }) => {
      if (!enabled || !ref.current) { return; }

      const { movement: [movementX, movementY], memo } = event;

      if (!memo) {
        const initialQuaternion = ref.current.quaternion.clone();
        return { initialQuaternion, startX: movementX, startY: movementY };
      }

      const { initialQuaternion, startX, startY } = memo;
      const deltaX = movementX - startX;
      const deltaY = movementY - startY;

      const cameraRight = camera.getWorldDirection(new Vector3()).cross(camera.up).normalize();

      const rotationQuaternionX = new Quaternion().setFromAxisAngle(cameraRight, deltaY * speed / 100);
      const rotationQuaternionY = new Quaternion().setFromAxisAngle(camera.up, deltaX * speed / 100);
      const rotationQuaternion = new Quaternion().multiplyQuaternions(rotationQuaternionY, rotationQuaternionX);
      ref.current.quaternion.copy(rotationQuaternion.multiply(initialQuaternion));

      return memo;
    }

    const zoomHandler = (event: Omit<FullGestureState<"pinch">, "event"> | Omit<FullGestureState<"scroll">, "event">) => {
      if (!enabled || !ref.current) { return; }
      const { delta: [deltaX, deltaY] } = event;
      const cameraDirection = camera.getWorldDirection(new Vector3());
      ref.current.position.add(cameraDirection.multiplyScalar(deltaY * speed));
    }

    const gesture = useGesture({
      onDrag: rotationHandler,
      onPinch: zoomHandler,
      onScroll: zoomHandler,
      onWheel: zoomHandler,
    }, { target: explDomElement });

    return (
      <a.group {...gesture?.()} {...(spring as any)} ref={ref}>
        {children}
      </a.group>
    );
  }
);
