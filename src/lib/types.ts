export interface Product {
 id: string
 name: string
 price: number
 description: string
 image: string
 category: string
 categoryName: string
 featured?: boolean 
}

export interface Category {
 id: string
 name: string
}