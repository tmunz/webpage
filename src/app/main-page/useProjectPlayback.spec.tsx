import React from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { PROJECT_DURATION, useProjectPlayback } from './useProjectPlayback';

function Playback({ enabled, index = 0, onAdvance }: { enabled: boolean; index?: number; onAdvance: () => void }) {
  useProjectPlayback(index, enabled, onAdvance);
  return null;
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => { cleanup(); jest.useRealTimers(); });

test('pauses the shot during interaction and resumes for its remaining duration', () => {
  const advance = jest.fn();
  const { rerender } = render(<Playback enabled onAdvance={advance} />);
  act(() => { jest.advanceTimersByTime(3500); });
  rerender(<Playback enabled={false} onAdvance={advance} />);
  act(() => { jest.advanceTimersByTime(30000); });
  expect(advance).not.toHaveBeenCalled();
  rerender(<Playback enabled onAdvance={advance} />);
  act(() => { jest.advanceTimersByTime(PROJECT_DURATION - 3501); });
  expect(advance).not.toHaveBeenCalled();
  act(() => { jest.advanceTimersByTime(1); });
  expect(advance).toHaveBeenCalledTimes(1);
});

test('manually choosing a project gives the new shot its full duration', () => {
  const advance = jest.fn();
  const { rerender } = render(<Playback enabled index={0} onAdvance={advance} />);
  act(() => { jest.advanceTimersByTime(7000); });
  rerender(<Playback enabled index={1} onAdvance={advance} />);
  act(() => { jest.advanceTimersByTime(PROJECT_DURATION - 1); });
  expect(advance).not.toHaveBeenCalled();
  act(() => { jest.advanceTimersByTime(1); });
  expect(advance).toHaveBeenCalledTimes(1);
});

test('disabled playback and unmounting leave no automatic advance scheduled', () => {
  const advance = jest.fn();
  const { rerender, unmount } = render(<Playback enabled={false} onAdvance={advance} />);
  act(() => { jest.advanceTimersByTime(PROJECT_DURATION * 2); });
  expect(advance).not.toHaveBeenCalled();
  rerender(<Playback enabled onAdvance={advance} />);
  unmount();
  act(() => { jest.advanceTimersByTime(PROJECT_DURATION * 2); });
  expect(advance).not.toHaveBeenCalled();
  expect(jest.getTimerCount()).toBe(0);
});
