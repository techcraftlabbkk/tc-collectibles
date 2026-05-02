import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TC Collectibles - Premium PSA Pokémon Cards',
  description: 'Buy and sell graded PSA Pokémon cards. Premium marketplace for collectors.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-950 text-white min-h-screen flex flex-col">
        <header className="border-b border-dark-800 bg-dark-900 sticky top-0 z-40">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-500">
                TC Collectibles
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="hover:text-gray-300">
                Browse
              </a>
              <a href="/cart" className="hover:text-gray-300">
                Cart
              </a>
              <a href="/orders" className="hover:text-gray-300">
                Orders
              </a>
              <a href="/auth/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
                Sign In
              </a>
            </div>
          </nav>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-dark-800 bg-dark-900 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">About</h3>
                <p className="text-sm text-gray-400">
                  Premium marketplace for graded Pokémon cards. Final sale, no returns.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
                  <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 uppercase mb-4">Contact</h3>
                <p className="text-sm text-gray-400">
                  Email: support@tccollectibles.com
                </p>
              </div>
            </div>
            <div className="border-t border-dark-800 mt-8 pt-8 text-sm text-gray-400 text-center">
              © 2026 TC Collectibles. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
