
import { describe, it, expect } from 'vitest';
import { validateProduct } from './validators';

describe('validateProduct', () => {
  it('should return null for valid product', () => {
    const validProduct = {
      title: 'Valid Product',
      price: '100',
      category: 'Gaming',
    };
    expect(validateProduct(validProduct)).toBeNull();
  });

  it('should return null for valid decimal price', () => {
      const validProduct = {
        title: 'Valid Product',
        price: '10.99',
        category: 'Gaming',
      };
      expect(validateProduct(validProduct)).toBeNull();
  });

  it('should return error if title is empty', () => {
    const product = {
      title: '',
      price: '100',
      category: 'Gaming',
    };
    expect(validateProduct(product)).toBe('Title is required');
  });

  it('should return error if title is just whitespace', () => {
    const product = {
      title: '   ',
      price: '100',
      category: 'Gaming',
    };
    expect(validateProduct(product)).toBe('Title is required');
  });

  it('should return error if title is too long', () => {
    const product = {
      title: 'a'.repeat(101),
      price: '100',
      category: 'Gaming',
    };
    expect(validateProduct(product)).toBe('Title is too long (max 100 characters)');
  });

  it('should return error if price is not a number', () => {
    const product = {
      title: 'Valid Product',
      price: 'abc',
      category: 'Gaming',
    };
    expect(validateProduct(product)).toBe('Price must be a valid number');
  });

  it('should return error if price is partial number string', () => {
      const product = {
        title: 'Valid Product',
        price: '10abc',
        category: 'Gaming',
      };
      expect(validateProduct(product)).toBe('Price must be a valid number');
  });


  it('should return error if price is zero or negative', () => {
    const product = {
      title: 'Valid Product',
      price: '0',
      category: 'Gaming',
    };
    expect(validateProduct(product)).toBe('Price must be a positive number');
  });

  it('should return error if category is invalid', () => {
    const product = {
      title: 'Valid Product',
      price: '100',
      category: 'Invalid',
    };
    expect(validateProduct(product)).toBe('Invalid category');
  });
});
