import { Product, Category } from './types'

export const categories: Category[] = [
  { id: 'cosmeticos', name: 'Cosméticos' },
  { id: 'salud', name: 'Salud' },
  { id: 'casa', name: 'Casa' }
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Perfume Floral',
    price: 99.99,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In elementum ante et lectus aliquet lacinia.',
    image: 'https://placehold.co/300x300',
    category: 'cosmeticos',
    categoryName: 'Cosméticos',
    featured: true
  },
  {
    id: '2',
    name: 'Cepillo de Dientes Eléctrico',
    price: 149.99,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In elementum ante et lectus aliquet lacinia.',
    image: 'https://placehold.co/300x300',
    category: 'salud',
    categoryName: 'Salud',
    featured: true
  },
  {
    id: '3',
    name: 'Escoba Multiusos',
    price: 199.99,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In elementum ante et lectus aliquet lacinia.',
    image: 'https://placehold.co/300x300',
    category: 'casa',
    categoryName: 'Casa',
    featured: true
  },
  {
    id: '4',
    name: 'Crema Hidratante',
    price: 45.99,
    description: 'Hidratación profunda para todo tipo de piel.',
    image: 'https://placehold.co/300x300',
    category: 'cosmeticos',
    categoryName: 'Cosméticos',
    featured: false
  },
  {
    id: '5',
    name: 'Vitamina C',
    price: 24.99,
    description: 'Suplemento de vitamina C para reforzar el sistema inmune.',
    image: 'https://placehold.co/300x300',
    category: 'salud',
    categoryName: 'Salud',
    featured: false
  },
  {
    id: '6',
    name: 'Trapeador Premium',
    price: 39.99,
    description: 'Trapeador con sistema de auto-escurrido.',
    image: 'https://placehold.co/300x300',
    category: 'casa',
    categoryName: 'Casa',
    featured: false
  },
  {
    id: '7',
    name: 'Máscara de Pestañas',
    price: 19.99,
    description: 'Máscara de pestañas a prueba de agua.',
    image: 'https://placehold.co/300x300',
    category: 'cosmeticos',
    categoryName: 'Cosméticos',
    featured: false
  },
  {
    id: '8',
    name: 'Tensiómetro Digital',
    price: 89.99,
    description: 'Monitor de presión arterial de alta precisión.',
    image: 'https://placehold.co/300x300',
    category: 'salud',
    categoryName: 'Salud',
    featured: false
  },
  {
    id: '9',
    name: 'Set de Limpieza',
    price: 49.99,
    description: 'Kit completo de limpieza para el hogar.',
    image: 'https://placehold.co/300x300',
    category: 'casa',
    categoryName: 'Casa',
    featured: false
  },
  {
    id: '10',
    name: 'Serum Facial',
    price: 59.99,
    description: 'Serum antiarrugas con ácido hialurónico.',
    image: 'https://placehold.co/300x300',
    category: 'cosmeticos',
    categoryName: 'Cosméticos',
    featured: false
  }
]