import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { CartProvider } from '@/contexts/CartContext'
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
      <CartProvider>
          <Header />
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
