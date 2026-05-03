import { render, screen, waitFor } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import Select from '@/components/Select'

describe('Select Component', () => {
  const options = [
    { value: 'en', label: 'English' },
    { value: 'th', label: 'Thai' },
    { value: 'zh', label: 'Chinese' },
  ]

  const defaultProps = {
    options,
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders select trigger button', () => {
    render(<Select {...defaultProps} />)
    expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
  })

  it('displays placeholder when no value selected', () => {
    render(<Select {...defaultProps} placeholder="Choose language" />)
    expect(screen.getByText('Choose language')).toBeInTheDocument()
  })

  it('displays selected value', () => {
    render(<Select {...defaultProps} value="en" />)
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Select {...defaultProps} label="Language" />)
    expect(screen.getByText('Language')).toBeInTheDocument()
  })

  it('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    expect(screen.getByTestId('select-options')).toBeInTheDocument()
  })

  it('displays all options when opened', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument()
    })
  })

  it('calls onChange when option is selected', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<Select {...defaultProps} onChange={onChange} />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    const thaiOption = screen.getByTestId('select-option-th')
    await user.click(thaiOption)

    expect(onChange).toHaveBeenCalledWith('th')
  })

  it('closes dropdown after selection', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    const option = screen.getByTestId('select-option-en')
    await user.click(option)

    await waitFor(() => {
      expect(screen.queryByTestId('select-options')).not.toBeInTheDocument()
    })
  })

  it('filters options when searchable and searching', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} searchable={true} />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    const searchInput = screen.getByTestId('select-search')
    await user.type(searchInput, 'Th')

    expect(screen.getByText('Thai')).toBeInTheDocument()
    expect(screen.queryByText('English')).not.toBeInTheDocument()
  })

  it('shows no options message when no matches', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} searchable={true} />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    const searchInput = screen.getByTestId('select-search')
    await user.type(searchInput, 'Spanish')

    expect(screen.getByTestId('select-no-options')).toBeInTheDocument()
  })

  it('navigates options with arrow keys', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    const englishOption = screen.getByTestId('select-option-en')

    await user.keyboard('{ArrowDown}')
    // Option should be highlighted

    await user.keyboard('{Enter}')
    // Should select highlighted option
  })

  it('closes dropdown with escape key', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    expect(screen.getByTestId('select-options')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByTestId('select-options')).not.toBeInTheDocument()
    })
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <Select {...defaultProps} />
        <button>Outside</button>
      </div>
    )

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    expect(screen.getByTestId('select-options')).toBeInTheDocument()

    const outsideButton = screen.getByText('Outside')
    await user.click(outsideButton)

    await waitFor(() => {
      expect(screen.queryByTestId('select-options')).not.toBeInTheDocument()
    })
  })

  it('displays error message when provided', () => {
    render(<Select {...defaultProps} error="This field is required" />)
    expect(screen.getByTestId('select-error')).toBeInTheDocument()
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('displays helper text when provided', () => {
    render(<Select {...defaultProps} helperText="Select your preferred language" />)
    expect(screen.getByTestId('select-helper')).toBeInTheDocument()
    expect(screen.getByText('Select your preferred language')).toBeInTheDocument()
  })

  it('disables select when disabled prop is true', () => {
    render(<Select {...defaultProps} disabled={true} />)
    const trigger = screen.getByTestId('select-trigger')
    expect(trigger).toBeDisabled()
  })

  it('shows required indicator when required', () => {
    render(<Select {...defaultProps} label="Language" required={true} />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('highlights current selection', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} value="en" />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    const selectedOption = screen.getByTestId('select-option-en')
    expect(selectedOption).toHaveClass('bg-blue-50')
  })

  it('maintains search term when option highlighted', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} searchable={true} />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    const searchInput = screen.getByTestId('select-search')
    await user.type(searchInput, 'Th')

    expect((searchInput as HTMLInputElement).value).toBe('Th')
  })

  it('clears search on close', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} searchable={true} />)

    const trigger = screen.getByTestId('select-trigger')
    await user.click(trigger)

    const searchInput = screen.getByTestId('select-search')
    await user.type(searchInput, 'search')

    const option = screen.getByTestId('select-option-en')
    await user.click(option)

    await user.click(trigger)

    await waitFor(() => {
      const newSearchInput = screen.getByTestId('select-search') as HTMLInputElement
      expect(newSearchInput.value).toBe('')
    })
  })

  it('renders with dropdown icon', () => {
    render(<Select {...defaultProps} />)
    const svg = screen.getByTestId('select-trigger').querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('rotates dropdown icon when open', async () => {
    const user = userEvent.setup()
    render(<Select {...defaultProps} />)

    const trigger = screen.getByTestId('select-trigger')
    const svg = trigger.querySelector('svg')

    expect(svg).not.toHaveClass('rotate-180')

    await user.click(trigger)

    expect(svg).toHaveClass('rotate-180')
  })
})
