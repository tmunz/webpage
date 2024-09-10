import '@testing-library/jest-dom';
import React from 'react';
import { Frame, FrameProps } from './Frame';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock the FrameCloseButton with a button element
jest.mock('./ui/FrameCloseButton', () => ({ onClick, active }: { onClick: () => void, active: boolean }) => (
  <button onClick={onClick} data-testid="frame-close-button">{active ? 'Close' : 'Open'}</button>
));

// Mock the PerspectiveImage component with a canvas element
jest.mock('./effects/PerspectiveImage', () => () => <canvas data-testid="perspective-image-canvas" />);

describe('Frame Component', () => {
  const defaultProps: FrameProps = {
    id: 'test-frame',
    title: 'Test Title',
    content: <div data-testid="test-frame-content">Test Content</div>,
    imgSrc: 'test-image.jpg',
    onClick: jest.fn(),
    activeId: 'test-frame',
  };

  it('renders Frame component with given props', () => {
    render(<Frame {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(screen.getByTestId('test-frame-content')).toBeInTheDocument();
  });

  it('should call onClick handler when CloseButton is clicked', () => {
    render(<Frame {...defaultProps} />);
    fireEvent.click(screen.getByTestId('frame-close-button'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should display content when activeId matches frame id', () => {
    render(<Frame {...defaultProps} />);
    expect(screen.getByTestId('test-frame-content')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
});
