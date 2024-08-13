import { AvgCalculator } from "./AvgCalculator";

describe('AvgCalculator', () => {
  it('should return the default value when no values are pushed', () => {
    const maxSize = 5;
    const defaultValue = 10;
    const calculator = AvgCalculator(maxSize, defaultValue);

    expect(calculator.avg()).toBe(defaultValue);
  });

  it('should correctly calculate the average when fewer values are pushed than maxSize', () => {
    const maxSize = 5;
    const defaultValue = 10;
    const calculator = AvgCalculator(maxSize, defaultValue);

    calculator.push(5);
    calculator.push(10);

    expect(calculator.avg()).toBe(9);
  });

  it('should correctly calculate the average when exactly maxSize values are pushed', () => {
    const maxSize = 3;
    const defaultValue = 10;
    const calculator = AvgCalculator(maxSize, defaultValue);

    calculator.push(5);
    calculator.push(10);
    calculator.push(15);

    expect(calculator.avg()).toBe(10);
  });

  it('should drop the oldest value when more than maxSize values are pushed', () => {
    const maxSize = 3;
    const defaultValue = 10;
    const calculator = AvgCalculator(maxSize, defaultValue);

    calculator.push(5);
    calculator.push(10);
    calculator.push(15);
    calculator.push(20);

    expect(calculator.avg()).toBe(15);
  });

  it('should reset the calculator correctly', () => {
    const maxSize = 3;
    const defaultValue = 10;
    const calculator = AvgCalculator(maxSize, defaultValue);

    calculator.push(5);
    calculator.push(10);
    calculator.reset();

    expect(calculator.avg()).toBe(defaultValue);
  });
});
