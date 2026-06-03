import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'GeoMineral | Base de Conocimiento Mineralógica',
  description: 'Base de datos interactiva para estudiar propiedades, composición química, óptica mineral y ambientes geológicos. Herramienta educativa para estudiantes y profesionales de geología.',
  keywords: ['mineralogía', 'geología', 'minerales', 'óptica mineral', 'petrografía', 'cristalografía'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
