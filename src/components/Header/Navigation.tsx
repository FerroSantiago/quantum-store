import Link from 'next/link'

const sections = [
  { name: 'Cosmeticos', href: '/categories/cosmeticos/' },
  { name: 'Casa', href: '/categories//casa' },
  { name: 'Salud', href: '/categories//salud' },
]

export default function Navigation() {
  return (
    <nav className="border-t bg-muted overflow-x-auto">
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
