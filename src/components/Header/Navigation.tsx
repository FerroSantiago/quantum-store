import Link from 'next/link'
import { categories } from '@/lib/constants'

interface NavigationProps {
  variant?: 'horizontal' | 'vertical'
  onNavigate?: () => void
}

export default function Navigation({ variant = 'horizontal', onNavigate }: NavigationProps) {
  if (variant === 'vertical') {
    return (
      <nav className="space-y-2">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.href}
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
            onClick={onNavigate}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    )
  }

  return (
    <nav className="border-t border-border bg-muted overflow-x-auto hidden sm:block">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 whitespace-nowrap">
          {categories.map((category, index) => (
            <li key={index}>
              <Link
                href={category.href}
                className="block py-2 text-sm font-medium hover:text-primary"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}