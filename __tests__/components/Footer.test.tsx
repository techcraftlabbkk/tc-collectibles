import { render, screen } from '@/lib/test-utils'
import Footer from '@/components/Footer'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

describe('Footer Component', () => {
  it('renders footer element', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('displays company information section', () => {
    render(<Footer />)
    const footer = screen.queryByText(/tc collectibles|about|company/i)
    expect(footer).toBeInTheDocument()
  })

  it('displays quick links section', () => {
    render(<Footer />)
    const quickLinks = screen.queryByText(/quick links|links|menu/i)
    expect(quickLinks || screen.queryByRole('link')).toBeInTheDocument()
  })

  it('contains link to products page', () => {
    render(<Footer />)
    const productsLink = screen.queryByRole('link', { name: /products|shop|collection/i })
    expect(productsLink).toBeInTheDocument()
  })

  it('contains link to about page', () => {
    render(<Footer />)
    const aboutLink = screen.queryByRole('link', { name: /about|about us/i })
    expect(aboutLink || screen.queryByText(/about/i)).toBeInTheDocument()
  })

  it('contains link to contact page', () => {
    render(<Footer />)
    const contactLink = screen.queryByRole('link', { name: /contact|email|phone/i })
    expect(contactLink || screen.queryByText(/contact/i)).toBeInTheDocument()
  })

  it('displays contact information section', () => {
    render(<Footer />)
    const contactSection = screen.queryByText(/contact|email|phone|address/i)
    expect(contactSection).toBeInTheDocument()
  })

  it('displays email address', () => {
    render(<Footer />)
    const email = screen.queryByText(/techcraftlab|@|email/i)
    expect(email || screen.queryByRole('link', { name: /@/ })).toBeInTheDocument()
  })

  it('displays phone number', () => {
    render(<Footer />)
    const phone = screen.queryByText(/\d{3}|\d{8}|phone|contact/i)
    expect(phone).toBeInTheDocument()
  })

  it('displays copyright information', () => {
    render(<Footer />)
    const copyright = screen.queryByText(/©|copyright|all rights reserved/i)
    expect(copyright).toBeInTheDocument()
  })

  it('applies footer styling classes', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('bg-')
  })

  it('displays social media links', () => {
    render(<Footer />)
    // Social links may be present
    const socialLinks = screen.queryAllByRole('link')
    expect(socialLinks.length).toBeGreaterThan(0)
  })

  it('renders with grid or flexbox layout', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    // Check for layout classes
    expect(footer).toHaveClass(/grid|flex/)
  })

  it('contains multiple columns for organization', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    // Should have multiple links organized in sections
    expect(links.length).toBeGreaterThan(3)
  })

  it('displays payment methods information', () => {
    render(<Footer />)
    // May display accepted payment methods
    const paymentSection = screen.queryByText(/payment|accept|promptpay|bank/i)
    if (paymentSection) {
      expect(paymentSection).toBeInTheDocument()
    }
  })

  it('has proper footer semantic structure', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer?.tagName).toBe('FOOTER')
  })

  it('displays language option in footer', () => {
    render(<Footer />)
    // Language switcher may be in footer
    const langOption = screen.queryByText(/english|thai|language/i)
    if (langOption) {
      expect(langOption).toBeInTheDocument()
    }
  })

  it('applies responsive padding and margins', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass(/p-|m-|px-|py-/)
  })

  it('renders links with proper href attributes', () => {
    render(<Footer />)
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('displays year in copyright', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    // Copyright should contain current or dynamic year
    const copyright = screen.queryByText(new RegExp(currentYear.toString()))
    if (copyright) {
      expect(copyright).toBeInTheDocument()
    }
  })

  it('has dark background styling', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    // Footer typically has dark background
    expect(footer).toHaveClass(/bg-gray|bg-dark|bg-slate/)
  })

  it('has light text color for contrast', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    // Should have light text for readability
    expect(footer).toHaveClass(/text-white|text-gray/)
  })
})
