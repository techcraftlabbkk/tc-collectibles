import { render, screen, waitFor } from '@/lib/test-utils'
import { useToast } from '@/lib/hooks/useToast'

// Test component that uses the hook
function TestComponent() {
  const { toast, dismiss } = useToast()

  return (
    <div>
      <button onClick={() => toast.success('Success!')}>Add Success Toast</button>
      <button onClick={() => toast.error('Error!')}>Add Error Toast</button>
      <button onClick={() => toast.warning('Warning!')}>Add Warning Toast</button>
      <button onClick={() => toast.info('Info!')}>Add Info Toast</button>
      <button onClick={() => dismiss('test-id')}>Dismiss Toast</button>
    </div>
  )
}

describe('useToast', () => {
  it('calling toast.success adds a toast to the DOM', async () => {
    render(<TestComponent />)
    const button = screen.getByRole('button', { name: /Add Success Toast/i })
    button.click()

    await waitFor(() => {
      expect(screen.getByTestId(/toast-/)).toBeInTheDocument()
      expect(screen.getByText('Success!')).toBeInTheDocument()
    })
  })

  it('toasts auto-dismiss after the duration', async () => {
    render(<TestComponent />)
    const button = screen.getByRole('button', { name: /Add Success Toast/i })
    button.click()

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument()
    })

    // Default duration is 3000ms, wait for it to dismiss
    await waitFor(
      () => {
        expect(screen.queryByText('Success!')).not.toBeInTheDocument()
      },
      { timeout: 4000 }
    )
  })

  it('dismiss(id) removes a specific toast', async () => {
    // Test component that exposes toast ID
    function TestComponentWithId() {
      const { toast, dismiss } = useToast()
      const [toastId, setToastId] = React.useState<string>('')

      return (
        <div>
          <button
            onClick={() => {
              const id = toast.success('Test Toast', { duration: 10000 })
              setToastId(id)
            }}
          >
            Add Toast
          </button>
          <button onClick={() => dismiss(toastId)}>Dismiss By ID</button>
        </div>
      )
    }

    const React = await import('react')
    render(<TestComponentWithId />)

    const addButton = screen.getByRole('button', { name: /Add Toast/i })
    addButton.click()

    await waitFor(() => {
      expect(screen.getByText('Test Toast')).toBeInTheDocument()
    })

    const dismissButton = screen.getByRole('button', { name: /Dismiss By ID/i })
    dismissButton.click()

    await waitFor(() => {
      expect(screen.queryByText('Test Toast')).not.toBeInTheDocument()
    })
  })

  it('multiple toasts stack', async () => {
    render(<TestComponent />)

    const successButton = screen.getByRole('button', { name: /Add Success Toast/i })
    const errorButton = screen.getByRole('button', { name: /Add Error Toast/i })
    const warningButton = screen.getByRole('button', { name: /Add Warning Toast/i })

    successButton.click()
    errorButton.click()
    warningButton.click()

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument()
      expect(screen.getByText('Error!')).toBeInTheDocument()
      expect(screen.getByText('Warning!')).toBeInTheDocument()
    })
  })
})
