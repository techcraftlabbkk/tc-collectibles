import { render, screen } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import Input from '@/components/Input'

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders placeholder text', () => {
    render(<Input placeholder="Enter email" />)
    const input = screen.getByPlaceholderText('Enter email')
    expect(input).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('displays helper text', () => {
    render(<Input helperText="We recommend a strong password" />)
    expect(screen.getByText('We recommend a strong password')).toBeInTheDocument()
  })

  it('handles user input', async () => {
    const user = userEvent.setup()
    render(<Input defaultValue="" />)
    const input = screen.getByRole('textbox') as HTMLInputElement

    await user.type(input, 'test@example.com')
    expect(input.value).toBe('test@example.com')
  })

  it('applies correct type', () => {
    render(<Input type="email" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.type).toBe('email')
  })

  it('handles disabled state', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:bg-gray-100')
  })

  it('handles required attribute', () => {
    render(<Input required />)
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('calls onChange handler', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')

    await user.type(input, 'a')
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies error styling when error exists', () => {
    render(<Input error="Error message" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
  })
})
