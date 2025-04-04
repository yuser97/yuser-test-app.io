import type { Product } from '../features/products/types';

const ALL_PRODUCTS_URL = 'https://dummyjson.com/products';

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await fetch(ALL_PRODUCTS_URL + '/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        thumbnail: product.image,
        brand: product.brand,
      })
    });
    
    if (!response.ok) throw new Error('Ошибка при создании товара');
    
    const data = await response.json();
    
    return {
      ...product,
      id: String(data.id),
      rating: '0',
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      ...product,
      id: `temp-${Date.now()}`,
      rating: '0',
    };
  }
};