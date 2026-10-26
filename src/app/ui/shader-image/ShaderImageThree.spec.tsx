import React from 'react';
import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import { IUniform, ShaderMaterial, Texture, TextureLoader } from 'three';
import { ShaderImageThreePlane } from './ShaderImageThree';
import { ShaderImage } from './ShaderImage';

const mockInvalidate = jest.fn();
let mockFrameloop: 'never' | 'demand' = 'demand';

jest.mock('@react-three/fiber', () => {
  const size = { width: 800, height: 600 };
  return {
    Canvas: ({ frameloop }: { frameloop: string }) => <div data-testid="canvas" data-frameloop={frameloop} />,
    useThree: () => ({ size, invalidate: mockInvalidate, frameloop: mockFrameloop }),
  };
});
jest.mock('@react-three/drei', () => ({ OrthographicCamera: () => null }));

const imageUrls = { image: 'test.jpg' };
const getMaterial = (plane: React.ReactElement): ShaderMaterial => plane.props.children[1].props.object;

beforeEach(() => {
  mockInvalidate.mockClear();
  mockFrameloop = 'demand';
  jest.spyOn(TextureLoader.prototype, 'load').mockImplementation(() => new Texture());
});
afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

test('reuses the material for value changes and disposes it when uniform keys change', () => {
  const initialUniforms: Record<string, IUniform> = { position: { value: [0, 0] } };
  const { result, rerender } = renderHook(({ uniforms }) => ShaderImageThreePlane({ imageUrls, uniforms }), {
    initialProps: { uniforms: initialUniforms },
  });
  const material = getMaterial(result.current);
  const uniformMap = material.uniforms;
  const version = material.version;
  const dispose = jest.spyOn(material, 'dispose');
  rerender({ uniforms: { position: { value: [0.5, -0.5] } } });
  expect(getMaterial(result.current)).toBe(material);
  expect(material.uniforms.position.value).toEqual([0.5, -0.5]);
  expect(material.uniforms).toBe(uniformMap);
  expect(material.version).toBe(version);
  expect(dispose).not.toHaveBeenCalled();

  rerender({ uniforms: {} });
  const replacement = getMaterial(result.current);
  expect(replacement).not.toBe(material);
  expect(replacement.uniforms.position).toBeUndefined();
  expect(dispose).toHaveBeenCalledTimes(1);
});

test('loads image uniforms without replacing the material', () => {
  let finishLoading: ((texture: Texture) => void) | undefined;
  jest.mocked(TextureLoader.prototype.load).mockImplementation((_url, onLoad) => {
    finishLoading = onLoad;
    return new Texture();
  });
  const { result } = renderHook(() => ShaderImageThreePlane({ imageUrls }));
  const material = getMaterial(result.current);
  const uniformMap = material.uniforms;
  const version = material.version;
  expect(material.uniforms.image.value).toBeNull();
  const texture = new Texture();
  mockInvalidate.mockClear();
  act(() => { finishLoading!(texture); });
  expect(getMaterial(result.current)).toBe(material);
  expect(material.uniforms.image.value).toBe(texture);
  expect(material.uniforms).toBe(uniformMap);
  expect(material.version).toBe(version);
  expect(mockInvalidate).toHaveBeenCalled();
});

test('disposes replaced materials and the final material on unmount', () => {
  const { result, rerender, unmount } = renderHook(({ fragmentShader }) => ShaderImageThreePlane({ imageUrls, fragmentShader }), {
    initialProps: { fragmentShader: 'void main() { gl_FragColor = vec4(1.0); }' },
  });
  const original = getMaterial(result.current);
  const disposeOriginal = jest.spyOn(original, 'dispose');
  rerender({ fragmentShader: 'void main() { gl_FragColor = vec4(0.0); }' });
  const replacement = getMaterial(result.current);
  expect(replacement).not.toBe(original);
  expect(disposeOriginal).toHaveBeenCalledTimes(1);
  const disposeReplacement = jest.spyOn(replacement, 'dispose');
  unmount();
  expect(disposeOriginal).toHaveBeenCalledTimes(1);
  expect(disposeReplacement).toHaveBeenCalledTimes(1);
});

test('disables rendering while hidden and resumes on demand without remounting the canvas', () => {
  const { rerender } = render(<ShaderImage imageUrls={imageUrls} shaderDisabled />);
  const canvas = screen.getByTestId('canvas');
  expect(canvas.getAttribute('data-frameloop')).toBe('never');
  rerender(<ShaderImage imageUrls={imageUrls} />);
  expect(screen.getByTestId('canvas')).toBe(canvas);
  expect(canvas.getAttribute('data-frameloop')).toBe('demand');
  rerender(<ShaderImage imageUrls={imageUrls} shaderDisabled />);
  expect(canvas.getAttribute('data-frameloop')).toBe('never');
});

test('requests frames for uniform updates only when enabled, including on resume', () => {
  mockFrameloop = 'never';
  const { rerender } = renderHook(({ uniforms }) => ShaderImageThreePlane({ imageUrls, uniforms }), {
    initialProps: { uniforms: { position: { value: [0, 0] } } },
  });
  expect(mockInvalidate).not.toHaveBeenCalled();
  const uniforms = { position: { value: [0.5, -0.5] } };
  rerender({ uniforms });
  expect(mockInvalidate).not.toHaveBeenCalled();
  mockFrameloop = 'demand';
  rerender({ uniforms });
  expect(mockInvalidate).toHaveBeenCalled();
  mockInvalidate.mockClear();
  rerender({ uniforms: { position: { value: [1, 1] } } });
  expect(mockInvalidate).toHaveBeenCalled();
});
