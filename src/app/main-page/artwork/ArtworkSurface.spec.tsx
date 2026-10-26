import { act, renderHook } from '@testing-library/react';
import { Vector3 } from 'three';
import { useArtworkUniforms } from './ArtworkSurface';

let mockFrame: () => void;
jest.mock('@react-three/fiber', () => ({
  useFrame: (callback: typeof mockFrame) => { mockFrame = callback; },
}));

test('shader uniforms follow the current selection when input refs switch', () => {
  const livePosition = { current: new Vector3(0.2, 0.3, 1) };
  const liveMotion = { current: new Vector3(0.4, 0.1, 0.5) };
  const neutral = { current: new Vector3() };
  const time = { current: 2 };
  const { result, rerender } = renderHook(props => useArtworkUniforms(props), {
    initialProps: { time, interaction: livePosition, motion: liveMotion },
  });
  const materialUniforms = result.current;
  act(() => mockFrame());
  expect(materialUniforms.uMotion.value.equals(liveMotion.current)).toBe(true);

  rerender({ time, interaction: neutral, motion: neutral });
  act(() => mockFrame());
  expect(result.current).toBe(materialUniforms);
  expect(materialUniforms.uInteraction.value.length()).toBe(0);
  expect(materialUniforms.uMotion.value.length()).toBe(0);

  rerender({ time, interaction: livePosition, motion: liveMotion });
  liveMotion.current.set(0.6, 0.2, 0.8);
  act(() => mockFrame());
  expect(materialUniforms.uInteraction.value.equals(livePosition.current)).toBe(true);
  expect(materialUniforms.uMotion.value.equals(liveMotion.current)).toBe(true);
});
