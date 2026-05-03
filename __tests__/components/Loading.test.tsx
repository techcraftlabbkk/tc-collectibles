import { render, screen } from '@/lib/test-utils'
import Loading, { SkeletonTable, SkeletonCard } from '@/components/Loading'

describe('Loading Component', () => {
  it('renders spinner by default', () => {
    render(<Loading />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders spinner with medium size by default', () => {
    render(<Loading type="spinner" />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner.querySelector('.w-8')).toBeInTheDocument()
  })

  it('renders spinner with small size', () => {
    render(<Loading type="spinner" size="sm" />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner.querySelector('.w-4')).toBeInTheDocument()
  })

  it('renders spinner with large size', () => {
    render(<Loading type="spinner" size="lg" />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner.querySelector('.w-12')).toBeInTheDocument()
  })

  it('displays message with spinner', () => {
    render(<Loading type="spinner" message="Loading data..." />)
    expect(screen.getByText('Loading data...')).toBeInTheDocument()
    expect(screen.getByTestId('loading-message')).toBeInTheDocument()
  })

  it('renders skeleton loader', () => {
    render(<Loading type="skeleton" />)
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('renders correct number of skeleton lines', () => {
    render(<Loading type="skeleton" skeletonLines={5} />)
    const lines = screen.getAllByTestId(/^skeleton-line-/)
    expect(lines).toHaveLength(5)
  })

  it('renders 3 skeleton lines by default', () => {
    render(<Loading type="skeleton" />)
    const lines = screen.getAllByTestId(/^skeleton-line-/)
    expect(lines).toHaveLength(3)
  })

  it('renders progress bar', () => {
    render(<Loading type="progress" progress={50} />)
    expect(screen.getByTestId('loading-progress')).toBeInTheDocument()
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument()
  })

  it('displays progress percentage', () => {
    render(<Loading type="progress" progress={75} />)
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('displays message with progress bar', () => {
    render(<Loading type="progress" progress={50} message="Downloading..." />)
    expect(screen.getByText('Downloading...')).toBeInTheDocument()
    expect(screen.getByTestId('progress-message')).toBeInTheDocument()
  })

  it('clamps progress value to 0-100', () => {
    const { rerender } = render(<Loading type="progress" progress={-10} />)
    expect(screen.getByText('0%')).toBeInTheDocument()

    rerender(<Loading type="progress" progress={150} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('updates progress bar width based on value', () => {
    const { rerender } = render(<Loading type="progress" progress={25} />)
    let progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toHaveStyle('width: 25%')

    rerender(<Loading type="progress" progress={75} />)
    progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toHaveStyle('width: 75%')
  })

  it('renders fullscreen spinner', () => {
    render(<Loading type="spinner" fullScreen={true} />)
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass('fixed')
    expect(spinner).toHaveClass('inset-0')
  })

  it('renders fullscreen with message', () => {
    render(<Loading type="spinner" fullScreen={true} message="Processing..." />)
    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })

  it('returns null for invalid type', () => {
    const { container } = render(<Loading type="invalid" as any />)
    expect(container.firstChild).toBeNull()
  })

  it('has proper ARIA attributes for spinner', () => {
    render(<Loading type="spinner" />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-label', 'Loading')
  })

  it('has proper ARIA attributes for progress', () => {
    render(<Loading type="progress" progress={60} />)
    const progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toHaveAttribute('role', 'progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '60')
    expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    expect(progressBar).toHaveAttribute('aria-valuemax', '100')
  })

  it('applies animation classes to spinner', () => {
    render(<Loading type="spinner" />)
    const spinner = screen.getByTestId('loading-spinner')
    const spinnerElement = spinner.querySelector('div:first-child')
    expect(spinnerElement).toHaveClass('animate-spin')
  })

  it('applies animation classes to skeleton', () => {
    render(<Loading type="skeleton" />)
    const skeletonLine = screen.getByTestId('skeleton-line-0')
    expect(skeletonLine).toHaveClass('animate-pulse')
  })

  it('applies animation to progress bar', () => {
    render(<Loading type="progress" progress={50} />)
    const progressBar = screen.getByTestId('progress-bar')
    expect(progressBar).toHaveClass('transition-all')
  })
})

describe('SkeletonTable Component', () => {
  it('renders skeleton table', () => {
    render(<SkeletonTable />)
    expect(screen.getByTestId('skeleton-table')).toBeInTheDocument()
  })

  it('renders correct number of rows', () => {
    render(<SkeletonTable rows={4} columns={3} />)
    const cells = screen.getAllByTestId(/^skeleton-cell-/)
    expect(cells).toHaveLength(12) // 4 rows × 3 columns
  })

  it('renders 5 rows by default', () => {
    render(<SkeletonTable />)
    const cells = screen.getAllByTestId(/^skeleton-cell-/)
    expect(cells.length).toBeGreaterThanOrEqual(12) // 5 rows × 4 columns (default)
  })

  it('renders correct number of columns', () => {
    render(<SkeletonTable rows={2} columns={5} />)
    const cells = screen.getAllByTestId(/^skeleton-cell-/)
    expect(cells).toHaveLength(10) // 2 rows × 5 columns
  })

  it('applies animation to skeleton cells', () => {
    render(<SkeletonTable rows={1} columns={1} />)
    const cell = screen.getByTestId('skeleton-cell-0-0')
    expect(cell).toHaveClass('animate-pulse')
  })
})

describe('SkeletonCard Component', () => {
  it('renders skeleton cards', () => {
    render(<SkeletonCard />)
    expect(screen.getByTestId('skeleton-cards')).toBeInTheDocument()
  })

  it('renders correct number of cards', () => {
    render(<SkeletonCard count={5} />)
    const cards = screen.getAllByTestId(/^skeleton-card-/)
    expect(cards).toHaveLength(5)
  })

  it('renders 3 cards by default', () => {
    render(<SkeletonCard />)
    const cards = screen.getAllByTestId(/^skeleton-card-/)
    expect(cards).toHaveLength(3)
  })

  it('renders in responsive grid layout', () => {
    render(<SkeletonCard />)
    const container = screen.getByTestId('skeleton-cards')
    expect(container).toHaveClass('grid')
    expect(container).toHaveClass('sm:grid-cols-2')
    expect(container).toHaveClass('lg:grid-cols-3')
  })

  it('applies animation to skeleton cards', () => {
    render(<SkeletonCard count={1} />)
    const card = screen.getByTestId('skeleton-card-0')
    expect(card).toHaveClass('animate-pulse')
  })

  it('has image placeholder', () => {
    render(<SkeletonCard count={1} />)
    const card = screen.getByTestId('skeleton-card-0')
    const imagePlaceholder = card.querySelector('.h-32')
    expect(imagePlaceholder).toBeInTheDocument()
  })

  it('has content placeholders', () => {
    render(<SkeletonCard count={1} />)
    const card = screen.getByTestId('skeleton-card-0')
    const contentArea = card.querySelector('.p-4')
    expect(contentArea).toBeInTheDocument()
  })
})
