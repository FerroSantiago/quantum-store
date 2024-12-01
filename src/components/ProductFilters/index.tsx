'use client'

import React, { useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Product } from '@/lib/types';

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'featured';

interface ProductFiltersProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

const ProductFilters = ({ products, onFilterChange }: ProductFiltersProps) => {
  const [currentSort, setCurrentSort] = useState<SortOption>('name-asc');

  const sortProducts = (option: SortOption) => {
    let sortedProducts = [...products];
    
    if (option === 'featured') {
      sortedProducts = sortedProducts.filter(product => product.featured);
    } else {
      switch (option) {
        case 'price-asc':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name, 'es'));
          break;
        case 'name-desc':
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name, 'es'));
          break;
      }
    }

    setCurrentSort(option);
    onFilterChange(sortedProducts);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</span>
      <div className="w-[210px]"> {/* Contenedor con ancho fijo */}
        <Select defaultValue={currentSort} onValueChange={(value: SortOption) => sortProducts(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ordenar por..." />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5}>
            <SelectItem value="featured">Destacados</SelectItem>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
            <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProductFilters;