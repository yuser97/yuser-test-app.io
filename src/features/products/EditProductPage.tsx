import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { updateProduct } from './productsSlice';
import type { Product } from './types';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const product = useAppSelector(state => 
    state.products.items.find(p => p.id === id)
  );

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    title: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    isFavorite: false,
    brand: '',
    rating: 0,
  });

  const [errors, setErrors] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        isFavorite: product.isFavorite,
        brand: product.brand,
        rating: typeof product.rating === 'string' ? parseFloat(product.rating) : product.rating,
      });
    }
  }, [product]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'title':
        return value.trim() ? '' : 'Требуется название';
      case 'price':
        return !isNaN(Number(value)) && Number(value) > 0 ? '' : 'Укажите цену';
      case 'description':
        return value.length >= 10 ? '' : 'Описание должно быть не менее 10 символов.';
      case 'category':
        return value.trim() ? '' : 'Укажите категорию товара';
      case 'image':
        return value.match(/https?:\/\/.+/i) ? '' : 'Требуется действительный URL';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? Number(value) : value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      title: validateField('title', formData.title),
      price: validateField('price', formData.price.toString()),
      description: validateField('description', formData.description),
      category: validateField('category', formData.category),
      image: validateField('image', formData.image),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    if (product) {
      const updatedProduct: Product = {
        ...product,
        ...formData,
      };
      dispatch(updateProduct(updatedProduct));
      navigate(`/products`);
    }
  };

  if (!product) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>НЕ найдено</h2>
        <button 
          onClick={() => navigate('/products')}
          style={{
            padding: '8px 16px',
            background: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          Обратно к товарам
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate(`/products`)}
        style={{
          padding: '8px 16px',
          background: 'LightGray',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        ← Обратно к товарам
      </button>
      
      <h2 style={{ marginBottom: '20px' }}>Изменить: {product.title}</h2>
      
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Основная информация */}
          <div>
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Основная информация</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Название*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: errors.title ? '1px solid #ff4444' : '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              {errors.title && <span style={{ color: '#ff4444', fontSize: '0.8rem' }}>{errors.title}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Цена*</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: errors.price ? '1px solid #ff4444' : '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              {errors.price && <span style={{ color: '#ff4444', fontSize: '0.8rem' }}>{errors.price}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Основная иформация*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: errors.description ? '1px solid #ff4444' : '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              {errors.description && <span style={{ color: '#ff4444', fontSize: '0.8rem' }}>{errors.description}</span>}
            </div>
          </div>

          {/* Дополнительная информация */}
          <div>
            <h3 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Дополнительная информация</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Категория*</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: errors.category ? '1px solid #ff4444' : '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              {errors.category && <span style={{ color: '#ff4444', fontSize: '0.8rem' }}>{errors.category}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Image URL*</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: errors.image ? '1px solid #ff4444' : '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              {errors.image && <span style={{ color: '#ff4444', fontSize: '0.8rem' }}>{errors.image}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Бренд</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Рейтинг</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.01"
                style={{ 
                  width: '100%', 
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button 
            type="button" 
            onClick={() => navigate(`/products`)}
            style={{
              padding: '10px 20px',
              background: 'LightGray',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Отменить
          </button>
          <button 
            type="submit" 
            style={{
              padding: '10px 20px',
              background: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;