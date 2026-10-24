import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { Draw } from './Draw';

describe('drawing spray', () => {
  const imageDataDescriptor = Object.getOwnPropertyDescriptor(window, 'ImageData');
  const context = {
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    stroke: jest.fn(),
    arc: jest.fn<void, [number, number, number, number, number]>(),
    fill: jest.fn(),
    clearRect: jest.fn(),
    putImageData: jest.fn(),
    getImageData: jest.fn(() => new ImageData(1, 1)),
    fillStyle: '',
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    jest.spyOn(Math, 'random').mockReturnValue(0.75);
    // jsdom does not implement the canvas ImageData constructor.
    Object.defineProperty(window, 'ImageData', {
      configurable: true,
      value: jest.fn(() => ({})),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
    if (imageDataDescriptor) {
      Object.defineProperty(window, 'ImageData', imageDataDescriptor);
    } else {
      Reflect.deleteProperty(window, 'ImageData');
    }
  });

  test('paints filled, scattered dots in the selected color and stops on release', () => {
    const { container, unmount } = render(
      <Draw width={400} height={300} color={{ r: 12, g: 34, b: 56 }} />,
    );
    const canvas = container.querySelector('canvas')!;
    fireEvent.mouseDown(canvas, { button: 0, clientX: 100, clientY: 100 });
    act(() => { jest.advanceTimersByTime(17); });
    fireEvent.mouseMove(canvas, { clientX: 120, clientY: 110 });
    act(() => { jest.advanceTimersByTime(17); });

    expect(context.arc).toHaveBeenCalled();
    expect(context.fill).toHaveBeenCalledTimes(context.arc.mock.calls.length);
    expect(context.fillStyle).toBe('rgba(12, 34, 56, 0.675)');
    const [x, y, radius, start, end] = context.arc.mock.calls[0];
    expect(x).toBeGreaterThan(120);
    expect(y).toBeGreaterThan(110);
    expect(radius).toBeGreaterThan(0);
    expect(radius).toBeLessThanOrEqual(50);
    expect([start, end]).toEqual([0, Math.PI * 2]);

    fireEvent.mouseUp(canvas);
    const dotCount = context.fill.mock.calls.length;
    act(() => { jest.advanceTimersByTime(100); });
    expect(context.fill).toHaveBeenCalledTimes(dotCount);
    unmount();
  });

  test('disables spray when its maximum size is zero', () => {
    const { container, unmount } = render(
      <Draw width={400} height={300} maxSprankleSize={0} />,
    );
    fireEvent.mouseDown(container.querySelector('canvas')!, { button: 0 });
    act(() => { jest.advanceTimersByTime(34); });
    expect(context.stroke).toHaveBeenCalled();
    expect(context.fill).not.toHaveBeenCalled();
    unmount();
  });
});
