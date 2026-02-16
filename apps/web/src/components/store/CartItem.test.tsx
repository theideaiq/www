import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CartItem } from './CartItem';
import { CartItem as CartItemType } from '@/stores/cart-store';

// Mock dependencies
vi.mock('next/image', () => ({
  default: ({ fill, ...props }: any) => <img {...props} alt={props.alt} />,
}));

describe('CartItem', () => {
  const mockItem: CartItemType = {
    id: '123',
    productId: 'prod-1',
    title: 'Test Product',
    price: 1000,
    image: '/test.jpg',
    quantity: 2,
    attributes: { size: 'M', color: 'Red' },
  };

  const mockOnRemove = vi.fn();
  const mockOnUpdateQuantity = vi.fn();

  it('renders item details correctly', () => {
    render(
      <CartItem
        item={mockItem}
        onRemove={mockOnRemove}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    expect(screen.getByText('Test Product')).toBeDefined();
    expect(screen.getByText('M, Red')).toBeDefined(); // Attributes joined
    expect(screen.getByText('1,000 IQD')).toBeDefined(); // Formatted price
    expect(screen.getByText('2')).toBeDefined(); // Quantity
  });

  it('calls onRemove when remove button is clicked', () => {
    render(
      <CartItem
        item={mockItem}
        onRemove={mockOnRemove}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    const removeButton = screen.getByLabelText('Remove item');
    fireEvent.click(removeButton);
    expect(mockOnRemove).toHaveBeenCalledWith('123');
  });

  it('calls onUpdateQuantity when increment/decrement buttons are clicked', () => {
    render(
      <CartItem
        item={mockItem}
        onRemove={mockOnRemove}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    const decreaseButton = screen.getByLabelText('Decrease quantity');
    fireEvent.click(decreaseButton);
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('123', 1);

    const increaseButton = screen.getByLabelText('Increase quantity');
    fireEvent.click(increaseButton);
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('123', 3);
  });
});
