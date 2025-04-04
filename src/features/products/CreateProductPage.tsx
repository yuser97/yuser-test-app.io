import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { addProduct } from './productsSlice';
import { v4 as uuidv4 } from 'uuid';
import type { Product } from './types';
import styles from '../../css/CreateProductPage.module.css'; 

const CreateProductPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    brand: '',
  });
  
  const [errors, setErrors] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });

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
      [name]: value
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
      price: validateField('price', formData.price),
      description: validateField('description', formData.description),
      category: validateField('category', formData.category),
      image: validateField('image', formData.image),
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    const newProduct: Product = {
      id: uuidv4(),
      title: formData.title,
      price: Number(formData.price),
      description: formData.description,
      category: formData.category,
      image: formData.image,
      isFavorite: false,
      brand: formData.brand || 'Неизвестно',
      rating: 0,
    };
    
    dispatch(addProduct(newProduct));
    setTimeout(() => navigate('/products'), 100);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Создать новый продукт</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.requiredField}`}>Название</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          />
          {errors.title && <span className={styles.errorText}>{errors.title}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.requiredField}`}>Цена</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
          />
          {errors.price && <span className={styles.errorText}>{errors.price}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.requiredField}`}>Описание товара</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          />
          {errors.description && <span className={styles.errorText}>{errors.description}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.requiredField}`}>Категория товара</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="smartphones"
            className={`${styles.input} ${errors.category ? styles.inputError : ''}`}
          />
          {errors.category && <span className={styles.errorText}>{errors.category}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={`${styles.label} ${styles.requiredField}`}>Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={`${styles.input} ${errors.image ? styles.inputError : ''}`}
          />
          {errors.image && <span className={styles.errorText}>{errors.image}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Бренд</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="submit"
            className={styles.submitButton}
          >
            Создать
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/products')}
            className={styles.cancelButton}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage; 