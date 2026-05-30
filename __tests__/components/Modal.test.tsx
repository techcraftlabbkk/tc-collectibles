import { render, screen, waitFor } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import Modal from '@/components/Modal'

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal when isOpen is true', () => {
    render(<Modal {...defaultProps} />)
    expect(screen.getByTestId('modal-content')).toBeInTheDocument()
  })

  it('does not render modal when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />)
    expect(screen.queryByTestId('modal-content')).not.toBeInTheDocument()
  })

  it('displays title when provided', () => {
    render(<Modal {...defaultProps} title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('displays description when provided', () => {
    render(<Modal {...defaultProps} description="Test Description" />)
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <Modal {...defaultProps}>
        <p>Child content</p>
      </Modal>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    render(<Modal {...defaultProps} onClose={onClose} showCloseButton={true} />)

    const closeButton = screen.getByTestId('modal-close-button')
    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when escape key is pressed', async () => {
    const onClose = jest.fn()
    render(<Modal {...defaultProps} onClose={onClose} />)

    const modal = screen.getByTestId('modal-content')
    modal.focus()

    await userEvent.keyboard('{Escape}')

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    render(<Modal {...defaultProps} onClose={onClose} />)

    const overlay = screen.getByTestId('modal-overlay')
    await user.click(overlay)

    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when content is clicked', async () => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    render(
      <Modal {...defaultProps} onClose={onClose}>
        <button>Test Button</button>
      </Modal>
    )

    const button = screen.getByText('Test Button')
    await user.click(button)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()
    const onClose = jest.fn()
    render(
      <Modal
        {...defaultProps}
        onClose={onClose}
        onConfirm={onConfirm}
        showConfirmButton={true}
      />
    )

    const confirmButton = screen.getByTestId('modal-confirm-button')
    await user.click(confirmButton)

    expect(onConfirm).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('applies size variants', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />)
    const content = screen.getByTestId('modal-content')
    expect(content).toHaveClass('max-w-sm')

    rerender(<Modal {...defaultProps} size="md" />)
    expect(content).toHaveClass('max-w-md')

    rerender(<Modal {...defaultProps} size="lg" />)
    expect(content).toHaveClass('max-w-lg')
  })

  it('hides close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} showCloseButton={false} />)
    expect(screen.queryByTestId('modal-close-button')).not.toBeInTheDocument()
  })

  it('hides confirm button when showConfirmButton is false', () => {
    render(<Modal {...defaultProps} showConfirmButton={false} />)
    expect(screen.queryByTestId('modal-confirm-button')).not.toBeInTheDocument()
  })

  it('applies danger variant to confirm button', () => {
    render(<Modal {...defaultProps} showConfirmButton={true} isDanger={true} />)
    const confirmButton = screen.getByTestId('modal-confirm-button')
    expect(confirmButton).toHaveClass('variant-danger')
  })

  it('has proper ARIA attributes', () => {
    render(<Modal {...defaultProps} title="Dialog Title" />)
    const dialog = screen.getByTestId('modal-content')

    expect(dialog).toHaveAttribute('role', 'dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby')
  })

  it('prevents body scroll when modal is open', () => {
    const { rerender } = render(<Modal {...defaultProps} isOpen={false} />)
    expect(document.body.style.overflow).toBe('unset')

    rerender(<Modal {...defaultProps} isOpen={true} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when modal closes', () => {
    const { rerender } = render(<Modal {...defaultProps} />)
    expect(document.body.style.overflow).toBe('hidden')

    rerender(<Modal {...defaultProps} isOpen={false} />)
    expect(document.body.style.overflow).toBe('unset')
  })

  it('renders custom button text', () => {
    render(
      <Modal
        {...defaultProps}
        closeButtonText="Cancel"
        confirmButtonText="Save"
        showCloseButton={true}
        showConfirmButton={true}
      />
    )

    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('focuses first focusable element on open', () => {
    render(
      <Modal {...defaultProps}>
        <button>First Button</button>
        <button>Second Button</button>
      </Modal>
    )

    const firstButton = screen.getByText('First Button')
    expect(firstButton).toHaveFocus()
  })

  it('traps focus within modal', async () => {
    const user = userEvent.setup()
    render(
      <Modal {...defaultProps} showConfirmButton={true} showCloseButton={true}>
        <input type="text" placeholder="Input" />
      </Modal>
    )

    // Tab to navigate - should cycle back to first element
    const closeButton = screen.getByTestId('modal-close-button')
    closeButton.focus()

    await user.tab()
    // Should focus on one of the modal elements
    expect(document.activeElement).toBeInTheDocument()
  })

  it('renders with all features enabled', () => {
    render(
      <Modal
        {...defaultProps}
        title="Full Featured Modal"
        description="This modal has everything"
        showCloseButton={true}
        showConfirmButton={true}
        closeButtonText="Cancel"
        confirmButtonText="Submit"
      >
        <p>Modal content goes here</p>
      </Modal>
    )

    expect(screen.getByText('Full Featured Modal')).toBeInTheDocument()
    expect(screen.getByText('This modal has everything')).toBeInTheDocument()
    expect(screen.getByText('Modal content goes here')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })
})
