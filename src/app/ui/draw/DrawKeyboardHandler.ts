export function useKeyboardHandler({ undo, redo, reset }: { undo: () => void, redo: () => void, reset: () => void }) {
  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.ctrlKey && e.key === "z") {
      undo();
    } else if (e.ctrlKey && e.key === "y") {
      redo();
    } else if (e.key === "Delete" || e.key === "Backspace") {
      reset();
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}
