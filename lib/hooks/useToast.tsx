'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import Toast from '@/components/Toast'

interface ToastObject {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: ToastObject[]
  addToast: (toast: Omit<ToastObject, 'id'>) => string
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Generate UUID with fallback for older runtimes
const generateId = (): string => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID()
  }
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastObject[]>([])

  const addToast = useCallback((toast: Omit<ToastObject, 'id'>): string => {
    const id = generateId()
    const newToast: ToastObject = { ...toast, id }
    setToasts((prev) => [...prev, newToast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 sm:max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            description={toast.description}
            duration={toast.duration}
            action={toast.action}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

interface ToastMethods {
  success: (message: string, opts?: ToastOptions) => string
  error: (message: string, opts?: ToastOptions) => string
  warning: (message: string, opts?: ToastOptions) => string
  info: (message: string, opts?: ToastOptions) => string
}

interface ToastOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  const { addToast, removeToast } = context

  const toast: ToastMethods = {
    success: (message: string, opts?: ToastOptions) =>
      addToast({
        type: 'success',
        message,
        description: opts?.description,
        duration: opts?.duration ?? 3000,
        action: opts?.action,
      }),
    error: (message: string, opts?: ToastOptions) =>
      addToast({
        type: 'error',
        message,
        description: opts?.description,
        duration: opts?.duration ?? 3000,
        action: opts?.action,
      }),
    warning: (message: string, opts?: ToastOptions) =>
      addToast({
        type: 'warning',
        message,
        description: opts?.description,
        duration: opts?.duration ?? 3000,
        action: opts?.action,
      }),
    info: (message: string, opts?: ToastOptions) =>
      addToast({
        type: 'info',
        message,
        description: opts?.description,
        duration: opts?.duration ?? 3000,
        action: opts?.action,
      }),
  }

  return {
    toast,
    dismiss: removeToast,
  }
}
