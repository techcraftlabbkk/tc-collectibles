import { render, screen, waitFor } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import Toast from '@/components/Toast'

describe('Toast Component', () => {
  const defaultProps = {
    id: 'toast-1',
    type: 'success' as const,
    message: 'Operation successful',
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders toast with message', () => {
    render(<Toast {...defaultProps} />)
    expect(screen.getByText('Operation successful')).toBeInTheDocument()
  })

  it('renders success toast with correct styling', () => {
    render(<Toast {...defaultProps} type="success" />)
    const toast = screen.getByTestId('toast-toast-1')
    expect(toast).toHaveClass('bg-green-50')
  })

  it('renders error toast with correct styling', () => {
    render(<Toast {...defaultProps} type="error" />)
    const toast = screen.getByTestId('toast-toast-1')
    expect(toast).toHaveClass('bg-red-50')
  })

  it('renders warning toast with correct styling', () => {
    render(<Toast {...defaultProps} type="warning" />)
    const toast = screen.getByTestId('toast-toast-1')
    expect(toast).toHaveClass('bg-yellow-50')
  })

  it('renders info toast with correct styling', () => {
    render(<Toast {...defaultProps} type="info" />)
    const toast = screen.getByTestId('toast-toast-1')
    expect(toast).toHaveClass('bg-blue-50')
  })

  it('displays description when provided', () => {
    render(<Toast {...defaultProps} description="Additional details" />)
    expect(screen.getByText('Additional details')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const onClose = jest.fn()
    render(<Toast {...defaultProps} onClose={onClose} />)

    const closeButton = screen.getByTestId('toast-close')
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledWith('toast-1')
  })

  it('auto-dismisses after duration', () => {
    const onClose = jest.fn()
    render(<Toast {...defaultProps} onClose={onClose} duration={3000} />)

    jest.advanceTimersByTime(3000)

    expect(onClose).toHaveBeenCalledWith('toast-1')
  })

  it('does not auto-dismiss when duration is 0', () => {
    const onClose = jest.fn()
    render(<Toast {...defaultProps} onClose={onClose} duration={0} />)

    jest.advanceTimersByTime(10000)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when action button is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const onClose = jest.fn()
    const actionClick = jest.fn()
    render(
      <Toast
        {...defaultProps}
        onClose={onClose}
        action={{ label: 'Undo', onClick: actionClick }}
      />
    )

    const actionButton = screen.getByTestId('toast-action')
    await user.click(actionButton)

    expect(actionClick).toHaveBeenCalled()
  })

  it('renders action button with custom label', () => {
    render(
      <Toast
        {...defaultProps}
        action={{ label: 'Retry', onClick: jest.fn() }}
      />
    )
    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('displays success icon for success toast', () => {
    render(<Toast {...defaultProps} type="success" />)
    const toast = screen.getByTestId('toast-toast-1')
    const icon = toast.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('displays error icon for error toast', () => {
    render(<Toast {...defaultProps} type="error" />)
    const toast = screen.getByTestId('toast-toast-toast-1')
    const icon = toast.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('has proper ARIA role', () => {
    render(<Toast {...defaultProps} />)
    const toast = screen.getByTestId('toast-toast-1')
    expect(toast).toHaveAttribute('role', 'alert')
  })

  it('renders with proper test IDs', () => {
    render(<Toast {...defaultProps} message="Test message" description="Test desc" />)
    expect(screen.getByTestId('toast-message')).toBeInTheDocument()
    expect(screen.getByTestId('toast-description')).toBeInTheDocument()
    expect(screen.getByTestId('toast-close')).toBeInTheDocument()
  })

  it('closes on button click after auto-dismiss timer', async () => {
    const user = userEvent.setup({ delay: null })
    const onClose = jest.fn()
    render(<Toast {...defaultProps} onClose={onClose} duration={3000} />)

    jest.advanceTimersByTime(1000)

    const closeButton = screen.getByTestId('toast-close')
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledWith('toast-1')
  })

  it('has custom duration', () => {
    const onClose = jest.fn()
    render(<Toast {...defaultProps} onClose={onClose} duration={5000} />)

    jest.advanceTimersByTime(4999)
    expect(onClose).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(onClose).toHaveBeenCalledWith('toast-1')
  })

  it('cleans up timer on unmount', () => {
    const onClose = jest.fn()
    const { unmount } = render(<Toast {...defaultProps} onClose={onClose} duration={3000} />)

    unmount()

    jest.advanceTimersByTime(3000)

    // onClose should not be called because component is unmounted
    expect(onClose).not.toHaveBeenCalled()
  })

  it('renders with all optional props', () => {
    render(
      <Toast
        {...defaultProps}
        description="Additional info"
        duration={4000}
        action={{ label: 'Action', onClick: jest.fn() }}
      />
    )

    expect(screen.getByText('Operation successful')).toBeInTheDocument()
    expect(screen.getByText('Additional info')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders different toast types correctly', () => {
    const types: Array<'success' | 'error' | 'warning' | 'info'> = [
      'success',
      'error',
      'warning',
      'info',
    ]

    types.forEach((type) => {
      const { unmount } = render(<Toast {...defaultProps} type={type} id={`toast-${type}`} />)
      const toast = screen.getByTestId(`toast-toast-${type}`)
      expect(toast).toBeInTheDocument()
      unmount()
    })
  })
})
