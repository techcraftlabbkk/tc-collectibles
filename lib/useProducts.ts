'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Product } from './types';

export interface ProductFilters {
  grade?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'newest' | 'price-low' | 'price-high';
}

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase.from('products').select('*').eq('available', true);

        // Apply filters
        if (filters.grade && filters.grade !== 'All Grades') {
          query = query.eq('grade', filters.grade);
        }

        if (filters.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice);
        }

        if (filters.maxPrice !== undefined) {
          query = query.lte('price', filters.maxPrice);
        }

        if (filters.search) {
          query = query.ilike('title', `%${filters.search}%`);
        }

        // Apply sorting
        if (filters.sortBy === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (filters.sortBy === 'price-high') {
          query = query.order('price', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.grade, filters.minPrice, filters.maxPrice, filters.search, filters.sortBy]);

  return { products, loading, error };
}
