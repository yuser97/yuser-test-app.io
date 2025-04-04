import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../../app/store';
import type { Product } from './types';
import { createProduct } from '../../api/productsApi';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: 'all' | 'favorites';
  brandFilter: string | null;
  currentPage: number;
  itemsPerPage: number;
}

interface DummyJsonProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  brand?: string;
  rating: number;
}

interface FilteredProductsResult {
  items: Product[];
  totalItems: number;
  totalPages: number;
}

const loadStateFromLocalStorage = (): ProductsState => {
  const savedState = localStorage.getItem('productsState');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      return {
        ...parsedState,
        currentPage: parsedState.currentPage || 1,
        itemsPerPage: parsedState.itemsPerPage || 6,
      };
    } catch (e) {
      console.error('Проверка на ошибку', e);
    }
  }
  return {
    items: [],
    status: 'idle',
    error: null,
    filter: 'all',
    brandFilter: null,
    currentPage: 1,
    itemsPerPage: 6,
  };
};

const initialState: ProductsState = loadStateFromLocalStorage();

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const product = state.items.find(p => p.id === action.payload);
      if (product) {
        product.isFavorite = !product.isFavorite;
        localStorage.setItem('productsState', JSON.stringify(state));
      }
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.items = state.items.filter(p => p.id !== action.payload);
      state.currentPage = 1;
      localStorage.setItem('productsState', JSON.stringify(state));
    },
    setFilter(state, action: PayloadAction<'all' | 'favorites'>) {
      state.filter = action.payload;
      state.currentPage = 1;
    },
    setBrandFilter(state, action: PayloadAction<string | null>) {
      state.brandFilter = action.payload;
      state.currentPage = 1;
    },
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
      state.status = 'succeeded';
      state.currentPage = 1;
      localStorage.setItem('productsState', JSON.stringify(state));
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
      state.error = null;
      state.currentPage = 1;
      localStorage.setItem('productsState', JSON.stringify(state));
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'failed';
    },
    setLoading(state) {
      state.status = 'loading';
    },
    resetProducts(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
      state.brandFilter = null;
      state.currentPage = 1;
      localStorage.removeItem('productsState');
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        localStorage.setItem('productsState', JSON.stringify(state));
      }
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setItemsPerPage(state, action: PayloadAction<number>) {
      state.itemsPerPage = action.payload;
      state.currentPage = 6;
    },
  },
});

export const {
  toggleFavorite,
  removeProduct,
  setFilter,
  setBrandFilter,
  setProducts,
  addProduct,
  setError,
  setLoading,
  resetProducts,
  updateProduct,
  setCurrentPage,
  setItemsPerPage,
} = productsSlice.actions;

export const fetchProducts = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    const response = await fetch('https://dummyjson.com/products/category/smartphones');
    if (!response.ok) throw new Error('Проверка на ошибку');
    
    const data = await response.json();
    const products: Product[] = data.products.map((product: DummyJsonProduct) => ({
      id: String(product.id),
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.thumbnail,
      isFavorite: false,
      brand: product.brand || 'Без бренда',
      rating: product.rating,
    }));

    const existingProducts = loadStateFromLocalStorage().items;
    const mergedProducts = products.map((apiProduct: Product) => {
      const existing = existingProducts.find((p: Product) => p.id === apiProduct.id);
      return existing ? { ...apiProduct, isFavorite: existing.isFavorite } : apiProduct;
    });

    const manualProducts = existingProducts.filter(
      (p: Product) => !products.some((apiP: Product) => apiP.id === p.id)
    );

    dispatch(setProducts([...mergedProducts, ...manualProducts]));
  } catch (err) {
    const fallbackProducts: Product[] = [
      {
        id: '1',
        title: 'iPhone 12',
        price: 799,
        description: 'Нормальный телефон',
        category: 'smartphones',
        image: 'https://via.placeholder.com/150',
        isFavorite: false,
        brand: 'Apple',
        rating: 4.9,
      },
      {
        id: '2',
        title: 'Samsung Galaxy S21',
        price: 699,
        description: 'Хороший телефон',
        category: 'smartphones',
        image: 'https://via.placeholder.com/150',
        isFavorite: false,
        brand: 'Samsung',
        rating: 4.1,
      },
      {
        id: '3',
        title: 'Vivo X60 Pro',
        price: 599,
        description: 'Лучший телефон',
        category: 'smartphones',
        image: 'https://via.placeholder.com/150',
        isFavorite: false,
        brand: 'Vivo',
        rating: 3.2,
      },
    ];
    
    dispatch(setProducts(fallbackProducts));
    dispatch(setError('API не найден'));
  }
};

export const createNewProduct = (product: Omit<Product, 'id'>) => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    const newProduct = await createProduct(product);
    dispatch(addProduct(newProduct));
  } catch (err) {
    dispatch(setError('Ошибка с созданием'));
    dispatch(addProduct({
      ...product,
      id: `temp-${Date.now()}`,
      rating: 0,
    }));
  }
};

export const selectFilteredProducts = (state: RootState): FilteredProductsResult => {
  const { items, filter, brandFilter } = state.products;
  
  let filtered = items;
  
  if (filter === 'favorites') {
    filtered = filtered.filter(product => product.isFavorite);
  }
  
  if (brandFilter) {
    filtered = filtered.filter(product => 
      product.brand.toLowerCase() === brandFilter.toLowerCase()
    );
  }
  
  return {
    items: filtered, 
    totalItems: filtered.length,
    totalPages: Math.ceil(filtered.length / state.products.itemsPerPage),
  };
};

export const selectAvailableBrands = (state: RootState) => {
  const brands = new Set<string>();
  state.products.items.forEach(product => {
    if (product.brand) {
      brands.add(product.brand);
    }
  });
  return Array.from(brands);
};

export default productsSlice.reducer;