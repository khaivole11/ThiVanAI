import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
  noFooter?: boolean
}

export default function Layout({ children, noFooter }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  )
}
