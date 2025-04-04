import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from './types';

interface ProductCardProps {
  product: Product;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onToggleFavorite, 
  onRemove 
}) => {
  const navigate = useNavigate();
  const { id, title, image, price, description, isFavorite } = product;

  const handleCardClick = () => {
    navigate(`/products/${encodeURIComponent(id)}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(id);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(id);
  };

  return (
    <div 
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
      }}
      onClick={handleCardClick}
      >
      <div style={{
        padding:'18px',
        margin: '8px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom:'15px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}/edit`);
            }}
            style={{
              alignItems: 'rigth',
              width: '30%',
              background: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer',
              zIndex: 1
            }}
          >
            Изменить
          </button>
        </div>
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'contain',
            marginBottom: '16px',
          }}
        />
        <h3 style={{ margin: '0 0 8px 0' }}>{title}</h3>
        <p style={{ color: '#666', flexGrow: 1 }}>
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>${price}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={handleFavoriteClick}
            style={{
              fontSize: 'large',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isFavorite ? 'red' : 'LightGray'
            }}
          >
            {isFavorite ? '❤️' : '🖤'}
          </button>
          <button
            onClick={handleRemoveClick}
            style={{
              fontSize: 'large',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'LightGray'
            }}
          >
            🗑️
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ProductCard;