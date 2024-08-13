export function HistoryManager<T>(size: number, initialState: T[] = []) {
  
  const stack: T[] = initialState;
  let index = stack.length - 1;

  return {
    push(newState: T) {
      if (index < stack.length - 1) {
        stack.splice(index + 1);
      }

      if (size <= stack.length) {
        stack.shift();
      } else {
        index++;
      }
      stack[index] = newState;
    },

    undo(): T | undefined {
      if (0 < index) {
        index--;
        return stack[index];
      }
      return undefined;
    },

    redo(): T | undefined {
      if (index < stack.length - 1) {
        index++;
        return stack[index];
      }
      return undefined;
    },

    getCurrent(): T | undefined {
      return stack[index];
    },

    clearHistory() {
      stack.length = 0;
      index = -1;
    },

    canUndo(): boolean {
      return 0 < index;
    },

    canRedo(): boolean {
      return index < stack.length - 1;
    }
  };
}