'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { categories } from '@/lib/constants'
import { getProduct } from '@/lib/actions'
import { useEffect, useState } from 'react'
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
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([])
  
  useEffect(() => {
    const generateBreadcrumbs = async () => {
      const segments = pathname.split('/').filter(Boolean)
      const newBreadcrumbs: BreadcrumbSegment[] = []
      
      // Add home
      newBreadcrumbs.push({
        label: 'Inicio',
        href: '/',
        isCurrentPage: segments.length === 0,
      })

      let path = ''
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i]
        path += `/${segment}`
        
        let label = ''
        if (segment === 'categories' && i === 0) {
          label = 'Categorías'
        } else if (i === 1) {
          // Esto es una categoría
          const category = categories.find(cat => cat.id === segment)
          label = category?.name || segment
        } else if (i === 2) {
          // Esto es un producto
          const categoryId = segments[1]
          const product = await getProduct(categoryId, segment)
          label = product?.name || segment
        } else {
          label = segment.charAt(0).toUpperCase() + segment.slice(1)
        }

        newBreadcrumbs.push({
          label,
          href: path,
          isCurrentPage: i === segments.length - 1,
        })
      }

      setBreadcrumbs(newBreadcrumbs)
    }

    generateBreadcrumbs()
  }, [pathname])

  // Don't show breadcrumb on home page
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