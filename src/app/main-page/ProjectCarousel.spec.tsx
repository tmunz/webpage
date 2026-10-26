import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ProjectCarousel } from './ProjectCarousel';

const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
const originalPointerEvent = Object.getOwnPropertyDescriptor(window, 'PointerEvent');

beforeEach(() => {
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: jest.fn(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() })),
  });
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
  if (originalMatchMedia) Object.defineProperty(window, 'matchMedia', originalMatchMedia);
  else Reflect.deleteProperty(window, 'matchMedia');
  if (originalPointerEvent) Object.defineProperty(window, 'PointerEvent', originalPointerEvent);
  else Reflect.deleteProperty(window, 'PointerEvent');
});

test('keeps project navigation and links working without WebGL', () => {
  render(<ProjectCarousel />);
  expect(screen.getByRole('heading', { name: 'tmusic' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Open tmusic live project' }).getAttribute('href'))
    .toBe('https://tmunz.github.io/tmusic/');
  fireEvent.click(screen.getByRole('button', { name: 'Next project' }));
  expect(screen.getByRole('heading', { name: 'GoldenSeeds' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Explore GoldenSeeds on GitHub' }).getAttribute('href'))
    .toBe('https://github.com/tmunz/GoldenSeeds');
  expect(screen.getByRole('link', { name: 'Open GoldenSeeds live project' }).getAttribute('href'))
    .toBe('https://tmunz.github.io/GoldenSeeds/?name=golden+seeds');
  fireEvent.click(screen.getByRole('button', { name: 'Show Mondrian' }));
  expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe('Mondrian');
  expect(screen.getByRole('link', { name: 'Open Mondrian live project' }).getAttribute('href'))
    .toBe('https://tmunz.github.io/Mondrian/');
  expect(screen.getByRole('button', { name: 'Show Mondrian' }).getAttribute('aria-pressed')).toBe('true');
  fireEvent.click(screen.getByRole('button', { name: 'Next project' }));
  expect(screen.getByRole('heading', { name: 'tmusic' })).toBeTruthy();
});

test('supports keyboard navigation, wrapping, and first/last shortcuts', () => {
  render(<ProjectCarousel />);
  const gallery = screen.getByRole('slider');
  fireEvent.keyDown(gallery, { key: 'ArrowLeft' });
  expect(gallery.getAttribute('aria-valuenow')).toBe('3');
  fireEvent.keyDown(gallery, { key: 'ArrowRight' });
  expect(gallery.getAttribute('aria-valuenow')).toBe('1');
  fireEvent.keyDown(gallery, { key: 'End' });
  expect(gallery.getAttribute('aria-valuenow')).toBe('3');
  fireEvent.keyDown(gallery, { key: 'Home' });
  expect(gallery.getAttribute('aria-valuenow')).toBe('1');
});

test('opens the displayed project from its artwork or the Enter key', () => {
  const open = jest.spyOn(window, 'open').mockImplementation(() => null);
  const { container } = render(<ProjectCarousel />);
  fireEvent.click(container.querySelector('.project-stage-fallback')!);
  expect(open).toHaveBeenLastCalledWith('https://tmunz.github.io/tmusic/', '_blank', 'noopener,noreferrer');
  fireEvent.click(screen.getByRole('button', { name: 'Next project' }));
  fireEvent.keyDown(screen.getByRole('slider'), { key: 'Enter' });
  expect(open).toHaveBeenLastCalledWith('https://tmunz.github.io/GoldenSeeds/?name=golden+seeds', '_blank', 'noopener,noreferrer');
});

test('horizontal swipes change projects while vertical scrolling and canceled gestures do not', () => {
  const open = jest.spyOn(window, 'open').mockImplementation(() => null);
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
  render(<ProjectCarousel />);
  const gallery = screen.getByRole('slider');
  gallery.setPointerCapture = jest.fn();
  const pointerDown = (x: number, y: number) => {
    const event = new MouseEvent('pointerdown', { bubbles: true, clientX: x, clientY: y, button: 0 });
    Object.defineProperty(event, 'isPrimary', { value: true });
    fireEvent(gallery, event);
  };
  pointerDown(150, 100);
  fireEvent.pointerUp(gallery, { clientX: 50, clientY: 105 });
  expect(gallery.getAttribute('aria-valuenow')).toBe('2');
  fireEvent.click(gallery);
  expect(open).not.toHaveBeenCalled();
  pointerDown(100, 100);
  fireEvent.pointerUp(gallery, { clientX: 150, clientY: 250 });
  expect(gallery.getAttribute('aria-valuenow')).toBe('2');
  pointerDown(150, 100);
  fireEvent.pointerCancel(gallery);
  fireEvent.pointerUp(gallery, { clientX: 50, clientY: 100 });
  expect(gallery.getAttribute('aria-valuenow')).toBe('2');
});
