import { act, fireEvent, renderHook } from '@testing-library/react';
import { usePagePointer } from './usePagePointer';

let mockFrame: (_: unknown, delta: number) => void;
jest.mock('@react-three/fiber', () => ({
  useFrame: (callback: typeof mockFrame) => { mockFrame = callback; },
}));

function move(x: number, y: number, time: number, pointerType = 'mouse') {
  const event = new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y });
  Object.defineProperties(event, { timeStamp: { value: time }, pointerType: { value: pointerType } });
  fireEvent(document.body, event);
}

test('tracks page movement outside the canvas and lets motion settle', () => {
  const { result } = renderHook(() => usePagePointer(false));
  move(window.innerWidth * 0.6, window.innerHeight * 0.5, 100);
  move(window.innerWidth * 0.8, window.innerHeight * 0.3, 150);
  act(() => mockFrame(null, 0.05));
  expect(result.current.interaction.current.x).toBeGreaterThan(0);
  expect(result.current.interaction.current.y).toBeGreaterThan(0);
  expect(result.current.motion.current.x).toBeGreaterThan(0);
  expect(result.current.motion.current.y).toBeGreaterThan(0);
  expect(result.current.motion.current.z).toBeGreaterThan(0);
  act(() => { for (let i = 0; i < 80; i++) mockFrame(null, 0.05); });
  expect(result.current.motion.current.z).toBeLessThan(0.001);
});

test('ignores touch and disables interaction for reduced motion', () => {
  const { result, rerender } = renderHook(({ reduced }) => usePagePointer(reduced), {
    initialProps: { reduced: false },
  });
  move(100, 100, 100, 'touch');
  act(() => mockFrame(null, 0.05));
  expect(result.current.interaction.current.z).toBe(0);
  move(200, 100, 150);
  act(() => mockFrame(null, 0.05));
  expect(result.current.interaction.current.z).toBeGreaterThan(0);
  rerender({ reduced: true });
  move(500, 200, 200);
  act(() => mockFrame(null, 0.05));
  expect(result.current.interaction.current.length()).toBe(0);
  expect(result.current.motion.current.length()).toBe(0);
});
