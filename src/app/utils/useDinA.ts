export const useDinA = (width: number, height: number) => {
  const DIN_RATIO = 1.414;
  const portrait = width < height;

  return {
    portrait,
    width: portrait ? (height / DIN_RATIO) : width,
    height: portrait ? height : (width / DIN_RATIO),
  };
}