'use client'

import React, { useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Star } from 'lucide-react';
import { FeaturedFilterButton } from '@/components/ui/featuredFilterButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Product } from '@/lib/types';

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

interface ProductFiltersProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

const ProductFilters = ({ products, onFilterChange }: ProductFiltersProps) => {
  const [currentSort, setCurrentSort] = useState<SortOption>('name-asc');
  const [showFeatured, setShowFeatured] = useState(false);

  const applyFilters = (sortOption: SortOption, featured: boolean) => {
    let filteredProducts = [...products];
    
    if (featured) {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }

    switch (sortOption) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'es'));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name, 'es'));
        break;
    }

    onFilterChange(filteredProducts);
  };

  const handleSortChange = (option: SortOption) => {
    setCurrentSort(option);
    applyFilters(option, showFeatured);
  };

  const toggleFeatured = () => {
    const newShowFeatured = !showFeatured;
    setShowFeatured(newShowFeatured);
    applyFilters(currentSort, newShowFeatured);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</span>
      <div className="w-[240px]">
        <Select defaultValue={currentSort} onValueChange={(value: SortOption) => handleSortChange(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ordenar por..." />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={5}>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
            <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <FeaturedFilterButton 
              variant="ghost" 
              size="icon" 
              onClick={toggleFeatured}
              className={`ml-2 transition-colors ${showFeatured ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <Star className={`h-5 w-5 ${showFeatured ? 'fill-yellow-400' : 'fill-none'}`} />
            </FeaturedFilterButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>{showFeatured ? 'Mostrar todos los productos' : 'Mostrar solo destacados'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ProductFilters;