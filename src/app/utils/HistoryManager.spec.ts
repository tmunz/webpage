import { HistoryManager } from "./HistoryManager";

describe('HistoryManager', () => {
  it('should initialize with the given initial state', () => {
    const initialState = [1, 2, 3];
    const size = 5;
    const history = HistoryManager<number>(size, initialState);

    expect(history.getCurrent()).toBe(3);
  });

  it('should correctly push new states and respect the size limit', () => {
    const size = 3;
    const history = HistoryManager<number>(size);

    history.push(1);
    history.push(2);
    history.push(3);
    history.push(4);

    expect(history.getCurrent()).toBe(4);
    expect(history.canUndo()).toBe(true);
    expect(history.canRedo()).toBe(false);
    expect(history.undo()).toBe(3);
    expect(history.getCurrent()).toBe(3);
  });

  it('should undo and redo correctly', () => {
    const size = 5;
    const history = HistoryManager<number>(size);

    history.push(1);
    history.push(2);
    history.push(3);
    history.push(4);
    history.push(5);

    history.undo();
    history.undo();

    expect(history.getCurrent()).toBe(3);

    history.redo();
    expect(history.getCurrent()).toBe(4);

    history.redo();
    expect(history.getCurrent()).toBe(5);

    history.redo();
    expect(history.getCurrent()).toBe(5);
  });

  it('should correctly handle clearing history', () => {
    const size = 4;
    const history = HistoryManager<number>(size);

    history.push(1);
    history.push(2);
    history.push(3);

    expect(history.getCurrent()).toBe(3);

    history.clearHistory();

    expect(history.getCurrent()).toBeUndefined();
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
  });

  it('should correctly handle undo/redo with initial state', () => {
    const size = 5;
    const initialState = [1, 2, 3];
    const history = HistoryManager<number>(size, initialState);

    expect(history.getCurrent()).toBe(3);

    history.push(4);
    history.push(5);

    expect(history.getCurrent()).toBe(5);

    history.undo();
    history.undo();

    expect(history.getCurrent()).toBe(3);

    history.redo();
    expect(history.getCurrent()).toBe(4);

    history.redo();
    expect(history.getCurrent()).toBe(5);
  });
});
