import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Frame } from './Frame';
import { IconName } from './ui/icon/IconName';

jest.mock('./effects/PerspectiveImage', () => ({
  PerspectiveImage: ({ perspectiveDisabled, position }: { perspectiveDisabled: boolean; position: { x: number; y: number } }) => (
    <div data-testid="perspective" data-disabled={perspectiveDisabled} data-position={JSON.stringify(position)} />
  ),
}));

const props = { id: 'art', title: 'Art', icon: IconName.PALETTE, content: null, imgSrc: 'frame.jpg', depthImgSrc: 'depth.jpg' };
const shaderDisabled = () => screen.getByTestId('perspective').getAttribute('data-disabled');

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  cleanup();
  jest.useRealTimers();
});

test('opening a category cancels the pending shader activation', () => {
  const { rerender } = render(<Frame {...props} activeId={null} />);
  act(() => { jest.advanceTimersByTime(100); });
  rerender(<Frame {...props} activeId="art" />);
  act(() => { jest.advanceTimersByTime(1000); });
  expect(shaderDisabled()).toBe('true');
  expect(jest.getTimerCount()).toBe(0);
});

test('returning to the overview starts a fresh 800ms delay', () => {
  const { rerender } = render(<Frame {...props} activeId={null} />);
  act(() => { jest.advanceTimersByTime(100); });
  rerender(<Frame {...props} activeId="art" />);
  rerender(<Frame {...props} activeId={null} />);
  act(() => { jest.advanceTimersByTime(799); });
  expect(shaderDisabled()).toBe('true');
  act(() => { jest.advanceTimersByTime(1); });
  expect(shaderDisabled()).toBe('false');
});

test('unmounting cancels the pending shader timer', () => {
  const { unmount } = render(<Frame {...props} activeId={null} />);
  expect(jest.getTimerCount()).toBe(1);
  unmount();
  expect(jest.getTimerCount()).toBe(0);
});

test('holds pointer-driven parallax updates until closing has finished', () => {
  const { container, rerender } = render(<Frame {...props} activeId="art" />);
  const frame = container.querySelector('.frame')!;
  const background = container.querySelector('.background-image')!;
  jest.spyOn(background, 'getBoundingClientRect').mockReturnValue({
    x: 0, y: 0, left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100,
    toJSON: () => ({}),
  });
  rerender(<Frame {...props} activeId={null} />);
  fireEvent.mouseMove(frame, { clientX: 75, clientY: 25 });
  act(() => { jest.advanceTimersByTime(799); });
  expect(screen.getByTestId('perspective').getAttribute('data-position')).toBe('{"x":0,"y":0}');
  act(() => { jest.advanceTimersByTime(1); });
  fireEvent.mouseMove(frame, { clientX: 75, clientY: 25 });
  act(() => { jest.advanceTimersByTime(20); });
  expect(screen.getByTestId('perspective').getAttribute('data-position')).toBe('{"x":0.25,"y":-0.25}');
});

test('keeps its category hint inside the frame and removes it when no longer needed', () => {
  const { container, rerender } = render(
    <Frame {...props} hint={<button>Category shortcut</button>} />,
  );
  const hint = screen.getByRole('button', { name: 'Category shortcut' });
  expect(hint.parentElement).toBe(container.querySelector('.frame'));
  rerender(<Frame {...props} />);
  expect(screen.queryByRole('button', { name: 'Category shortcut' })).toBeNull();
});
