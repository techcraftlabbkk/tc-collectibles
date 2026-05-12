'use client'

import React, { useState, useRef, useEffect } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  helperText?: string
  searchable?: boolean
  required?: boolean
  name?: string
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  helperText,
  searchable = true,
  required = false,
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const selectedOption = options.find((opt) => opt.value === value)

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev === null ? 0 : Math.min(prev + 1, filteredOptions.length - 1)
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev === null ? filteredOptions.length - 1 : Math.max(prev - 1, 0)
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex !== null) {
          handleSelect(filteredOptions[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchTerm('')
        break
      default:
        break
    }
  }

  const handleSelect = (option: SelectOption) => {
    onChange(option.value)
    setIsOpen(false)
    setSearchTerm('')
    setHighlightedIndex(null)
  }

  return (
    <div ref={containerRef} className="w-full" data-testid="select-container">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input/Trigger Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-2 text-left border rounded-lg transition-colors flex items-center justify-between ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } ${
            disabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-white hover:border-gray-400 focus:outline-none focus:ring-2'
          }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          data-testid="select-trigger"
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div
            ref={optionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
            role="listbox"
            data-testid="select-options"
          >
            {searchable && (
              <div className="sticky top-0 p-2 bg-white border-b">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setHighlightedIndex(0)
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-testid="select-search"
                  autoFocus
                />
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    highlightedIndex === index
                      ? 'bg-blue-100 text-blue-900'
                      : value === option.value
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50'
                  }`}
                  role="option"
                  aria-selected={value === option.value}
                  data-testid={`select-option-${option.value}`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500 text-center" data-testid="select-no-options">
                No options found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-1" data-testid="select-error">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-gray-500 text-sm mt-1" data-testid="select-helper">
          {helperText}
        </p>
      )}

      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value || ''} />}
    </div>
  )
}
