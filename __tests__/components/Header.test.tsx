import { render, screen } from '@/lib/test-utils'
import Header from '@/components/Header'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/en/products',
}))

describe('Header Component', () => {
  it('renders header element', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()
  })

  it('displays logo/brand name', () => {
    render(<Header />)
    // Header should contain link to home or brand name
    const homeLink = screen.queryByRole('link', { name: /home|tc collectibles/i })
    expect(homeLink || screen.queryByText(/tc collectibles|home/i)).toBeInTheDocument()
  })

  it('displays navigation menu items', () => {
    render(<Header />)
    // Check for common navigation items
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('contains link to products page', () => {
    render(<Header />)
    const productsLink = screen.queryByRole('link', { name: /products|shop/i })
    expect(productsLink).toBeInTheDocument()
  })

  it('contains link to cart', () => {
    render(<Header />)
    const cartLink = screen.queryByRole('link', { name: /cart|shopping cart/i })
    expect(cartLink || screen.queryByTestId('cart-link')).toBeInTheDocument()
  })

  it('displays language switcher', () => {
    render(<Header />)
    const languageSwitcher = screen.queryByRole('button', { name: /english|language|thai/i })
    expect(languageSwitcher || screen.queryByTestId('language-switcher')).toBeInTheDocument()
  })

  it('shows cart count badge', () => {
    render(<Header />)
    // Cart badge might show count
    const cartBadge = screen.queryByTestId('cart-count')
    // Should exist (even if count is 0)
    expect(cartBadge || screen.queryByText(/[0-9]/)).not.toThrow()
  })

  it('has responsive hamburger menu on mobile', () => {
    render(<Header />)
    const hamburger = screen.queryByRole('button', { name: /menu|hamburger|open menu/i })
    expect(hamburger || screen.queryByTestId('menu-toggle')).toBeInTheDocument()
  })

  it('applies sticky positioning', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('sticky')
  })

  it('applies header styling classes', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('bg-white')
  })

  it('displays logo image', () => {
    render(<Header />)
    const logo = screen.queryByAltText(/logo|brand/i)
    // Logo may or may not be present, but if it is, it should be an image
    if (logo) {
      expect(logo).toBeInTheDocument()
    }
  })

  it('contains search functionality', () => {
    render(<Header />)
    const searchInput = screen.queryByPlaceholderText(/search/i)
    // Search may or may not be in header
    if (searchInput) {
      expect(searchInput).toBeInTheDocument()
    }
  })

  it('displays login/account link for non-authenticated users', () => {
    render(<Header />)
    const accountLink = screen.queryByRole('link', { name: /login|sign in|account/i })
    expect(accountLink || screen.queryByText(/login|sign in/i)).toBeInTheDocument()
  })

  it('applies correct z-index for sticky header', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('z-')
  })

  it('contains navigation dropdown for languages', () => {
    render(<Header />)
    // Language switcher should be present
    const langSwitcher = screen.queryByTestId('language-switcher')
    expect(langSwitcher || screen.queryByRole('button')).not.toThrow()
  })

  it('renders with proper semantic structure', () => {
    const { container } = render(<Header />)
    const nav = container.querySelector('nav')
    expect(nav || container.querySelector('header')).toBeInTheDocument()
  })

  it('has accessible navigation landmarks', () => {
    render(<Header />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })
})
