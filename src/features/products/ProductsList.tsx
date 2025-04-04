import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { 
  fetchProducts, 
  selectFilteredProducts, 
  selectAvailableBrands,
  toggleFavorite, 
  removeProduct, 
  setFilter,
  setBrandFilter,
  resetProducts,
  setCurrentPage,
  setItemsPerPage
} from './productsSlice';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import type { Product } from './types';

const ProductsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: products, totalItems, totalPages } = useAppSelector(selectFilteredProducts);
  const availableBrands = useAppSelector(selectAvailableBrands);
  const status = useAppSelector(state => state.products.status);
  const filter = useAppSelector(state => state.products.filter);
  const brandFilter = useAppSelector(state => state.products.brandFilter);
  const currentPage = useAppSelector(state => state.products.currentPage);
  const itemsPerPage = useAppSelector(state => state.products.itemsPerPage);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);

  useEffect(() => {
    dispatch(setItemsPerPage(6));
  }, [dispatch]);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchedProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product => 
        product.title.toLowerCase().includes(query) || 
        (product.brand && product.brand.toLowerCase().includes(query))
      );
      setSearchedProducts(filtered);
    }
    dispatch(setCurrentPage(1));
  }, [searchQuery, products, dispatch]);

  const handleResetData = () => {
    if (window.confirm('Вы уверены?')) {
      dispatch(resetProducts());
      dispatch(fetchProducts());
    }
  };

  const handleClearFilters = () => {
    dispatch(setFilter('all'));
    dispatch(setBrandFilter(null));
    dispatch(setCurrentPage(1));
    setSearchQuery(''); 
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = searchQuery
    ? searchedProducts.slice(startIndex, endIndex)
    : products.slice(startIndex, endIndex);
  const displayTotalItems = searchQuery ? searchedProducts.length : totalItems;
  const totalDisplayPages = Math.ceil(displayTotalItems / itemsPerPage);

  if (status === 'loading' && products.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        fontSize: '1.2rem'
      }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Поисковая строка */}
      <div style={{ 
        marginBottom: '20px',
        position: 'relative'
      }}>
        <input
          type="text"
          placeholder="Поиск только по названию(Буквы и числа) или бренду..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '12px 20px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: '#999'
            }}
          >
            ×
          </button>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '20px',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleClearFilters}
              style={{
                padding: '8px 16px',
                background: filter === 'all' && !brandFilter ? 'blue' : 'LightGray',
                color: filter === 'all' && !brandFilter ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Все товары
            </button>

            <button
              onClick={() => {
                dispatch(setFilter('favorites'));
                dispatch(setBrandFilter(null));
                dispatch(setCurrentPage(1));
                setSearchQuery('');
              }}
              style={{
                padding: '8px 16px',
                background: filter === 'favorites' ? 'blue' : 'LightGray',
                color: filter === 'favorites' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Избранное
            </button>
          </div>
          
          <button
            onClick={() => navigate('/create-product')}
            style={{
              padding: '8px 16px',
              background: 'green',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Добавить товар
          </button>
        </div>

        {/* Кнопка сброса, сделал для удобства */}
        {process.env.NODE_ENV === 'development' && (
          <div>
            <button
              onClick={handleResetData}
              style={{
                padding: '8px 16px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Очистить localstorage 
            </button>
          </div>
        )}

        {/* Фильтр по брендам (т.к. все равно одни телефоны) */}
        {filter === 'all' && !searchQuery && (
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 'bold' }}>Бренд:</span>
            {availableBrands.map(brand => (
              <button
                key={brand}
                onClick={() => {
                  dispatch(setBrandFilter(brand));
                  dispatch(setCurrentPage(1));
                }}
                style={{
                  padding: '6px 12px',
                  background: brandFilter === brand ? 'aqua' : 'LightGray',
                  color: brandFilter === brand ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {brand}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Сообщение, если товаров нет */}
      {displayedProducts.length === 0 && status === 'succeeded' ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          border: '1px dashed #ddd',
          borderRadius: '8px'
        }}>
          <h3>Товары не найдены</h3>
          {filter === 'favorites' ? (
            <p>У вас пока нет избранных товаров</p>
          ) : searchQuery && (
            <p>По запросу "{searchQuery}" ничего не найдено</p>
          )}
          <button
            onClick={handleClearFilters}
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
            {brandFilter || searchQuery ? 'Очистить поиск' : 'Показать все товары'}
          </button>
        </div>
      ) : (
        <>
          {/* Список продуктов */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {displayedProducts.map((product) => (
              <div key={product.id} style={{ position: 'relative' }}>
                <ProductCard
                  product={product}
                  onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
                  onRemove={(id) => {
                    if (window.confirm(`Вы уверены, что хотите удалить ${product.title}?`)) {
                      dispatch(removeProduct(id));
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {/* Страницы */}
          {totalDisplayPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '40px',
              gap: '5px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  background: 'LightGray',
                  color: currentPage === 1 ? '#ccc' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                &lt;
              </button>

              {Array.from({ length: Math.min(5, totalDisplayPages) }, (_, i) => {
                let pageNum: number;
                if (totalDisplayPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalDisplayPages - 2) {
                  pageNum = totalDisplayPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      padding: '8px 12px',
                      background: currentPage === pageNum ? 'blue' : 'LightGray',
                      color: currentPage === pageNum ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(Math.min(totalDisplayPages, currentPage + 1))}
                disabled={currentPage === totalDisplayPages}
                style={{
                  padding: '8px 12px',
                  background: 'LightGray',
                  color: currentPage === totalDisplayPages ? '#ccc' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === totalDisplayPages ? 'not-allowed' : 'pointer'
                }}
              >
                &gt;
              </button>
            </div>
          )}

          <div style={{ 
            textAlign: 'center', 
            marginTop: '10px',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            {searchQuery ? (
              <>Найдено {displayTotalItems} товаров по запросу "{searchQuery}" (Страница {currentPage} из {totalDisplayPages})</>
            ) : (
              <>Показано {displayedProducts.length} из {displayTotalItems} товаров (Страница {currentPage} из {totalDisplayPages})</>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsList;