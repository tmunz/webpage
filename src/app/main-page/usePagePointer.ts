import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';

export function usePagePointer(reducedMotion: boolean) {
  const interaction = useRef(new Vector3());
  const motion = useRef(new Vector3());
  const positionTarget = useRef(new Vector3());
  const motionTarget = useRef(new Vector3());

  useEffect(() => {
    let previous: { x: number; y: number; time: number } | null = null;
    const reset = () => {
      previous = null;
      positionTarget.current.z = 0;
      motionTarget.current.set(0, 0, 0);
    };
    reset();
    if (reducedMotion) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      positionTarget.current.set(MathUtils.clamp(event.clientX / width - 0.5, -0.5, 0.5),
        MathUtils.clamp(0.5 - event.clientY / height, -0.5, 0.5), 1);
      const elapsed = previous ? (event.timeStamp - previous.time) / 1000 : 0;
      if (previous && elapsed > 0 && elapsed < 0.2) {
        const vx = (event.clientX - previous.x) / width / Math.max(elapsed, 1 / 240) * 3;
        const vy = (previous.y - event.clientY) / height / Math.max(elapsed, 1 / 240) * 3;
        const speed = Math.hypot(vx, vy);
        motionTarget.current.set(vx, vy, speed).multiplyScalar(1 / (1 + speed));
      }
      previous = { x: event.clientX, y: event.clientY, time: event.timeStamp };
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) reset(); };
    window.addEventListener('pointermove', move, { passive: true, capture: true });
    window.addEventListener('pointerout', leave);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('blur', reset);
    };
  }, [reducedMotion]);

  useFrame((_, delta) => {
    const t = Math.min(delta, 0.05);
    if (reducedMotion) {
      interaction.current.set(0, 0, 0);
      motion.current.set(0, 0, 0);
      return;
    }
    interaction.current.lerp(positionTarget.current, 1 - Math.exp(-7 * t));
    motion.current.lerp(motionTarget.current, 1 - Math.exp(-12 * t));
    motionTarget.current.multiplyScalar(Math.exp(-5 * t));
  }, -1.5);

  return { interaction, motion };
}
