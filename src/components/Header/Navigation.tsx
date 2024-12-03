import Link from 'next/link'

const sections = [
  { name: 'Cosmeticos', href: '/categories/cosmeticos/' },
  { name: 'Casa', href: '/categories//casa' },
  { name: 'Salud', href: '/categories//salud' },
]

interface NavigationProps {
  variant?: 'horizontal' | 'vertical'
  onNavigate?: () => void
}

export default function Navigation({ variant = 'horizontal', onNavigate }: NavigationProps) {
  if (variant === 'vertical') {
    return (
      <nav className="space-y-2">
        {sections.map((section, index) => (
          <Link
            key={index}
            href={section.href}
            className="block py-2 text-sm font-medium hover:text-primary transition-colors"
            onClick={onNavigate}
          >
            {section.name}
          </Link>
        ))}
      </nav>
    )
  }

  return (
    <nav className="border-t bg-muted overflow-x-auto hidden sm:block">
      <div className="container mx-auto px-4">
        <ul className="flex justify-center space-x-8 whitespace-nowrap">
          {sections.map((section, index) => (
            <li key={index}>
              <Link
                href={section.href}
                className="block py-2 text-sm font-medium hover:text-primary"
              >
                {section.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}