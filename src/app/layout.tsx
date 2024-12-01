import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import BreadcrumbNav from '@/components/BreadCrumbNav'
import { TooltipProvider } from "@/components/ui/tooltip"
import { CartProvider } from '@/contexts/CartContext'
import { SearchProvider } from '@/contexts/SearchContext'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Quantum Store',
  description: 'Los mejores productos para ti',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
      <TooltipProvider>
          <CartProvider>
          <SearchProvider>
              <Header />
              <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 pt-4">
                  <BreadcrumbNav />
                </div>
                {children}
              </main>
              <Toaster />
            </SearchProvider>
          </CartProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
