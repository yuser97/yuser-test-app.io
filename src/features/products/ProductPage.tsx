import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/store';


const ProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useAppSelector(state => 
    state.products.items.find(p => p.id === id)
  );

  if (!product) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Такого товара не найдено</h2>
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate('/products')}
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
      
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '40px' }}>
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: '50%',
              maxWidth: '500px',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
          <div>
            <h1 style={{ marginTop: 0 }}>{product.title}</h1>
            <div style={{ 
              display: 'flex', 
              gap: '10px',
              marginBottom: '20px'
            }}>
              <span style={{
                padding: '4px 8px',
                border: '1px solid blue',
                borderRadius: '4px',
                color: 'blue'
              }}>
                {product.category}
              </span>
              <span>⭐ {product.rating}</span>
            </div>
            
            <h2 style={{ color: 'blue' }}>
              ${product.price.toLocaleString()}
            </h2>
            
            <hr style={{ margin: '20px 0' }} />
            
            <h3>О товаре</h3>
            <p>{product.description}</p>
            
            <h3 style={{ marginTop: '20px' }}>Дополнительная информация</h3>
            <ul>
              <li>Бренд: {product.brand}</li>
            </ul>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/products')}
            style={{
              padding: '12px 24px',
              background: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Обратно к товарам
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;