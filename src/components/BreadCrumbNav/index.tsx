'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { categories } from '@/lib/data'
import { getProduct } from '@/lib/actions'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbSegment {
  label: string
  href: string
  isCurrentPage: boolean
}

export default function BreadcrumbNav() {
  const pathname = usePathname()
  
  const getBreadcrumbs = (): BreadcrumbSegment[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbSegment[] = []
    
    // Add home
    breadcrumbs.push({
      label: 'Inicio',
      href: '/',
      isCurrentPage: segments.length === 0,
    })

    let path = ''
    segments.forEach((segment, index) => {
      path += `/${segment}`
      
      let label = ''
      if (segment === 'categories' && index === 0) {
        label = 'Categorías'
      } else if (index === 1) {
        const category = categories.find(cat => cat.id === segment)
        label = category?.name || segment
      } else if (index === 2) {
        const categoryId = segments[1]
        const product = getProduct(categoryId, segment)
        label = product?.name || segment
      } else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1)
      }

      breadcrumbs.push({
        label,
        href: path,
        isCurrentPage: index === segments.length - 1,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  if (pathname === '/') return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItem key={breadcrumb.href}>
            {!breadcrumb.isCurrentPage ? (
              <>
                <Link href={breadcrumb.href} passHref legacyBehavior>
                  <BreadcrumbLink>
                    {breadcrumb.label}
                  </BreadcrumbLink>
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </>
            ) : (
              <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}