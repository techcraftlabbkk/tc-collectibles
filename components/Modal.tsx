'use client'

import React, { useEffect, useRef } from 'react'
import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeButtonText?: string
  confirmButtonText?: string
  onConfirm?: () => void
  showConfirmButton?: boolean
  showCloseButton?: boolean
  isDanger?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
  onConfirm,
  showConfirmButton = true,
  showCloseButton = true,
  isDanger = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'

      // Focus management: focus first focusable element
      const focusableElements = contentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements && focusableElements.length > 0) {
        ;(focusableElements[0] as HTMLElement).focus()
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle focus trap
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !isOpen || !contentRef.current) return

      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleTabKey)
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity"
      onClick={(e) => {
        if (e.target === modalRef.current) {
          onClose()
        }
      }}
      data-testid="modal-overlay"
      role="presentation"
    >
      <div
        ref={contentRef}
        className={`${sizeClasses[size]} w-full mx-4 bg-white rounded-lg shadow-lg p-6 transition-all animate-in fade-in zoom-in-95`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        data-testid="modal-content"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-bold text-gray-900"
                data-testid="modal-title"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
                data-testid="modal-close-button"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p
            id="modal-description"
            className="text-gray-600 mb-4"
            data-testid="modal-description"
          >
            {description}
          </p>
        )}

        {/* Content */}
        <div
          className="mb-6 text-gray-700"
          data-testid="modal-body"
        >
          {children}
        </div>

        {/* Footer - Buttons */}
        {(showConfirmButton || showCloseButton) && (
          <div className="flex gap-3 justify-end">
            {showCloseButton && (
              <Button
                variant="outline"
                onClick={onClose}
                data-testid="modal-cancel-button"
              >
                {closeButtonText}
              </Button>
            )}
            {showConfirmButton && (
              <Button
                variant={isDanger ? 'danger' : 'primary'}
                onClick={() => {
                  onConfirm?.()
                  onClose()
                }}
                data-testid="modal-confirm-button"
              >
                {confirmButtonText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
