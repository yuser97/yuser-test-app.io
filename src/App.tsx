import { Provider } from 'react-redux';
import { store } from './app/store';
import ProductsList from './features/products/ProductsList';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './features/products/ProductPage';
import CreateProductPage from './features/products/CreateProductPage';
import EditProductPage from './features/products/EditProductPage';

function App() {
  return (
    <Provider store={store}>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Тестовое задание 'Создать SPA со списком карточек'</h1>
        <Routes>
          <Route path="/" element={<ProductsList />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;