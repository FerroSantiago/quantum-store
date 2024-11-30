import { Product } from './types'
import { products } from './data'

export function getProducts(): Product[] {
  return products
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category)
}

export function getProduct(category: string, id: string): Product | undefined {
  return products.find(
    product => product.category === category && product.id === id
  )
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured)
}