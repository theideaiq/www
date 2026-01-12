
export const PRODUCT_CATEGORIES = ['Gaming', 'Laptops', 'Phones'];

export interface ProductInput {
  title: string;
  price: string;
  category: string;
}

export const validateProduct = (product: ProductInput): string | null => {
  if (!product.title.trim()) {
    return 'Title is required';
  }
  if (product.title.length > 100) {
    return 'Title is too long (max 100 characters)';
  }

  // Strict number check
  if (!/^\d+(\.\d+)?$/.test(product.price)) {
      return 'Price must be a valid number';
  }

  const price = Number(product.price);
  if (Number.isNaN(price) || price <= 0) {
    return 'Price must be a positive number';
  }

  if (!PRODUCT_CATEGORIES.includes(product.category)) {
    return 'Invalid category';
  }

  return null;
};
