import { render, screen, fireEvent } from '@testing-library/react';
import { Drawer } from './Drawer';
import { vi } from 'vitest';

// Mock scrollTo since jsdom doesn't implement it
Object.defineProperty(global.window, 'scrollTo', { value: vi.fn() });

// Mock createPortal to render children directly for testing
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('Drawer Component', () => {
  const onCloseMock = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: onCloseMock,
    title: 'Test Drawer',
    children: <div>Drawer Content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<Drawer {...defaultProps} />);

    expect(screen.getByText('Test Drawer')).toBeInTheDocument();
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Drawer {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Test Drawer')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<Drawer {...defaultProps} />);

    // This will fail initially because we haven't added aria-label yet,
    // but we can find it by looking for the button inside the header or by icon.
    // Ideally we want to query by aria-label.
    // For now, let's try to find the button.
    const closeButtons = screen.getAllByRole('button');
    // The drawer has a close button.
    const closeButton = closeButtons.find(btn => btn.querySelector('svg'));
    if (closeButton) {
        fireEvent.click(closeButton);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    } else {
        throw new Error('Close button not found');
    }
  });

  it('calls onClose when backdrop is clicked', () => {
    const { container } = render(<Drawer {...defaultProps} />);

    // The backdrop is the element with aria-hidden="true" and fixed/inset-0 classes
    // But identifying it by class is brittle.
    // Since we added aria-hidden="true" to the backdrop, we can find it that way,
    // although generic queries for aria-hidden are tricky.
    // Let's find the first div that is a direct child of the portal (which is body here)
    // Actually, render() renders into a container. Since we mocked createPortal to return children,
    // they are inside the container.

    // The backdrop is likely the first child div.
    // Or we can find it by its onclick behavior if we could trigger it on everything? No.

    // Let's rely on the class presence for this test as it's a styled component.
    // Or add a test id if necessary. But we want to avoid modifying code just for tests if possible.
    // However, aria-hidden="true" is now present.

    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
        fireEvent.click(backdrop);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    }
  });

  // Accessibility Tests - These should fail initially

  it('has correct accessibility attributes', () => {
    render(<Drawer {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Check aria-labelledby
    const title = screen.getByText('Test Drawer');
    const titleId = title.getAttribute('id');
    expect(titleId).toBeTruthy();
    expect(dialog).toHaveAttribute('aria-labelledby', titleId);

    // Check close button aria-label
    const closeButton = screen.getByLabelText('Close drawer');
    expect(closeButton).toBeInTheDocument();
  });

  it('closes on Escape key press', () => {
    render(<Drawer {...defaultProps} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
