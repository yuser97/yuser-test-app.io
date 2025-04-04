export interface Product {
    id: string; 
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    isFavorite: boolean;
    brand: string;
    rating: string | number;
  }