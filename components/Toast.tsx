'use client'

import React, { useEffect } from 'react'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
  onClose: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

const typeConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: (
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    text: 'text-green-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: (
      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
    text: 'text-red-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: (
      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    text: 'text-yellow-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    text: 'text-blue-800',
  },
}

export default function Toast({
  id,
  type,
  message,
  description,
  duration = 5000,
  onClose,
  action,
}: ToastProps) {
  const config = typeConfig[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  return (
    <div
      className={`${config.bg} ${config.border} border rounded-lg p-4 mb-3 shadow-md animate-in slide-in-from-top-5 fade-in`}
      role="alert"
      data-testid={`toast-${id}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">{config.icon}</div>

        {/* Content */}
        <div className="flex-1">
          <p className={`font-medium ${config.text}`} data-testid="toast-message">
            {message}
          </p>
          {description && (
            <p className={`text-sm mt-1 ${config.text}`} data-testid="toast-description">
              {description}
            </p>
          )}
        </div>

        {/* Action Button or Close Button */}
        <div className="flex-shrink-0 flex gap-2">
          {action && (
            <button
              onClick={action.onClick}
              className={`text-sm font-medium ${config.text} hover:opacity-75 transition-opacity`}
              data-testid="toast-action"
            >
              {action.label}
            </button>
          )}
          <button
            onClick={() => onClose(id)}
            className={`text-sm ${config.text} hover:opacity-75 transition-opacity`}
            aria-label="Close notification"
            data-testid="toast-close"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
