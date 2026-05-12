import { render, screen } from '@/lib/test-utils'
import Card from '@/components/Card'

describe('Card Component', () => {
  it('renders card element', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders with children content', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('applies shadow styling by default', () => {
    const { container } = render(
      <Card>
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('shadow')
  })

  it('applies custom shadow level', () => {
    const { container } = render(
      <Card shadow="lg">
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('shadow-lg')
  })

  it('applies no shadow when shadow="none"', () => {
    const { container } = render(
      <Card shadow="none">
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('shadow-none')
  })

  it('applies hover effect by default', () => {
    const { container } = render(
      <Card>
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('hover:shadow-lg')
  })

  it('applies custom background color', () => {
    const { container } = render(
      <Card className="bg-blue-50">
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('bg-blue-50')
  })

  it('applies custom padding', () => {
    const { container } = render(
      <Card className="p-8">
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('p-8')
  })

  it('applies rounded corners', () => {
    const { container } = render(
      <Card>
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('rounded-lg')
  })

  it('accepts additional className props', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('custom-class')
  })

  it('renders with clickable variant', () => {
    const { container } = render(
      <Card className="cursor-pointer">
        <div>Clickable Card</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('cursor-pointer')
  })

  it('displays image with card content', () => {
    render(
      <Card>
        <img src="/test-image.jpg" alt="Test" />
        <h3>Title</h3>
      </Card>
    )
    const image = screen.getByAltText('Test')
    expect(image).toBeInTheDocument()
  })

  it('handles nested card structure', () => {
    render(
      <Card>
        <div>
          <Card>
            <p>Nested Card</p>
          </Card>
        </div>
      </Card>
    )
    expect(screen.getByText('Nested Card')).toBeInTheDocument()
  })

  it('applies transition effects', () => {
    const { container } = render(
      <Card>
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('transition')
  })

  it('renders with border styling when applied', () => {
    const { container } = render(
      <Card className="border border-gray-200">
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('border')
  })

  it('handles empty card', () => {
    const { container } = render(<Card></Card>)
    const cardElement = container.querySelector('div')
    expect(cardElement).toBeInTheDocument()
  })

  it('applies custom data attributes', () => {
    const { container } = render(
      <Card data-testid="custom-card">
        <div>Content</div>
      </Card>
    )
    const cardElement = screen.getByTestId('custom-card')
    expect(cardElement).toBeInTheDocument()
  })

  it('handles responsive padding', () => {
    const { container } = render(
      <Card className="p-4 md:p-6 lg:p-8">
        <div>Content</div>
      </Card>
    )
    const cardElement = container.querySelector('div')
    expect(cardElement).toHaveClass('p-4')
    expect(cardElement).toHaveClass('md:p-6')
  })
})
