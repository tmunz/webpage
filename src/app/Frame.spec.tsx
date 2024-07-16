import React from 'react';
import Frame, { FrameProps } from './Frame';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';


jest.mock('./ui/CloseButton', () => ({ onClick, active }: { onClick: () => void, active: boolean }) => (
  <button onClick={onClick} data-testid="close-button">{active ? 'Close' : 'Open'}</button>
));

describe('Frame Component', () => {
  const defaultProps: FrameProps = {
    id: 'test-frame',
    title: 'Test Title',
    content: <div data-testid="test-frame">Test Content</div>,
    color: '#fff',
    imgSrc: 'test-image.jpg',
    onClick: jest.fn(),
    active: true,
  };

  it('renders Frame component with given props', () => {
    const { getByText, getByRole } = render(<Frame {...defaultProps} />);
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should call onClick handler when CloseButton is clicked', () => {
    render(<Frame {...defaultProps} active={true} />);

    fireEvent.click(screen.getByTestId('close-button'));

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should display content when active is true', () => {
    render(<Frame {...defaultProps} active={true} />);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('should handle mouse move for parallax effect', () => {
    const { container } = render(<Frame {...defaultProps} active={false} />);
    const imgElement: HTMLElement = container.querySelector('.background-image')!;
    fireEvent.mouseMove(container.firstChild!, { clientX: 100, clientY: 100 });
    expect(imgElement.style.transform).not.toBe('');
  });

  it('should reset position on mouse leave', () => {
    const { container } = render(<Frame {...defaultProps} active={false} />);
    const imgElement: HTMLElement = container.querySelector('.background-image')!;
    imgElement.style.transform = 'translate(10%, 10%)';
    fireEvent.mouseLeave(container.firstChild!);
    expect(imgElement.style.transform).toBe('');
  });
});
