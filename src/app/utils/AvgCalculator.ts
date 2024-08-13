export function AvgCalculator(maxSize: number, defaultValue: number) {
  const values: number[] = [];

  function push(value: number): void {
    if (values.length >= maxSize) {
      values.shift();
    }
    values.push(value);
  }

  function avg(): number {
    const currentValuesCount = values.length;

    if (currentValuesCount === 0) {
      return defaultValue;
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    const supplementedSum = sum + defaultValue * (maxSize - currentValuesCount);
    return supplementedSum / maxSize;
  }

  function reset(): void {
    values.length = 0;
  }

  return { push, avg, reset };
}