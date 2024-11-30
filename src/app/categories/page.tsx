// app/categories/page.tsx
import Link from 'next/link'
import { categories } from '@/lib/data'

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Todas las Categorías</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <Link 
            key={category.id} 
            href={`/categories/${category.id}`}
            className="block p-6 rounded-lg border hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold">{category.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}