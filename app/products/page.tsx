'use client';

import { useState } from 'react';
import { useProducts, ProductFilters } from '@/lib/useProducts';
import { useCartStore } from '@/lib/cartStore';
import Image from 'next/image';

const GRADE_OPTIONS = ['All Grades', 'PSA 6', 'PSA 7', 'PSA 8', 'PSA 8.5', 'PSA 9', 'PSA 10'];

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    grade: 'All Grades',
    minPrice: undefined,
    maxPrice: undefined,
    search: '',
    sortBy: 'newest',
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const { products, loading, error } = useProducts(filters);
  const { addToCart } = useCartStore();
  const [addedProduct, setAddedProduct] = useState<string | null>(null);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setAddedProduct(product.id);
    setTimeout(() => setAddedProduct(null), 2000);
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      grade: 'All Grades',
      minPrice: undefined,
      maxPrice: undefined,
      search: '',
      sortBy: 'newest',
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="card h-fit">
          <h2 className="text-lg font-bold mb-4">Filters</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Grade</label>
            <select
              className="w-full"
              value={tempFilters.grade || 'All Grades'}
              onChange={(e) => handleFilterChange('grade', e.target.value)}
            >
              {GRADE_OPTIONS.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Price Range</label>
            <input
              type="number"
              placeholder="Min (฿)"
              className="w-full mb-2"
              value={tempFilters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
            <input
              type="number"
              placeholder="Max (฿)"
              className="w-full"
              value={tempFilters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Search</label>
            <input
              type="text"
              placeholder="Card name..."
              className="w-full"
              value={tempFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-full mb-2" onClick={handleApplyFilters}>
            Apply Filters
          </button>
          <button className="btn btn-secondary w-full" onClick={handleResetFilters}>
            Reset
          </button>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-400">
              {loading ? 'Loading...' : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
            </p>
            <select
              className="bg-dark-900 border border-dark-800 rounded px-3 py-2"
              value={tempFilters.sortBy || 'newest'}
              onChange={(e) => {
                handleFilterChange('sortBy', e.target.value as any);
                setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
              }}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-800 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-dark-800 h-64 rounded mb-3" />
                  <div className="h-4 bg-dark-800 rounded mb-2" />
                  <div className="h-4 bg-dark-800 rounded w-2/3 mb-4" />
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-dark-800 rounded w-1/3" />
                    <div className="h-9 bg-dark-800 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="card cursor-pointer hover:border-blue-500 transition-colors group">
                  {/* Product Image */}
                  <div className="bg-dark-800 h-64 rounded mb-3 overflow-hidden relative">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <h3 className="font-bold text-white mb-1 truncate">{product.title}</h3>
                  <p className="text-sm text-gray-400 mb-1">Grade: {product.grade}</p>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                  {/* Price and Action */}
                  <div className="flex justify-between items-center pt-3 border-t border-dark-800">
                    <span className="font-bold text-blue-400">฿{product.price.toLocaleString()}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`btn text-sm transition-colors ${
                        addedProduct === product.id
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'btn-primary'
                      }`}
                    >
                      {addedProduct === product.id ? '✓ Added' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
