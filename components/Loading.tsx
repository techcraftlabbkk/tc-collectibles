'use client'

import React from 'react'

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'progress'
  size?: 'sm' | 'md' | 'lg'
  progress?: number // 0-100 for progress bar
  message?: string
  fullScreen?: boolean
  skeletonLines?: number
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

const spinnerSizeClasses = {
  sm: 'border-2',
  md: 'border-4',
  lg: 'border-4',
}

export default function Loading({
  type = 'spinner',
  size = 'md',
  progress,
  message,
  fullScreen = false,
  skeletonLines = 3,
}: LoadingProps) {
  if (type === 'spinner') {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 ${
          fullScreen ? 'fixed inset-0 bg-white/80' : 'py-8'
        }`}
        data-testid="loading-spinner"
      >
        <div
          className={`${sizeClasses[size]} ${spinnerSizeClasses[size]} border-blue-300 border-t-blue-600 rounded-full animate-spin`}
          role="status"
          aria-label="Loading"
        />
        {message && (
          <p className="text-sm text-gray-600" data-testid="loading-message">
            {message}
          </p>
        )}
      </div>
    )
  }

  if (type === 'skeleton') {
    return (
      <div className="w-full space-y-3" data-testid="loading-skeleton">
        {Array.from({ length: skeletonLines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"
            data-testid={`skeleton-line-${i}`}
          />
        ))}
      </div>
    )
  }

  if (type === 'progress') {
    const percentage = Math.min(Math.max(progress || 0, 0), 100)

    return (
      <div className="w-full space-y-2" data-testid="loading-progress">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            data-testid="progress-bar"
          />
        </div>
        {message && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600" data-testid="progress-message">
              {message}
            </p>
            <p className="text-sm font-medium text-gray-900" data-testid="progress-percent">
              {percentage}%
            </p>
          </div>
        )}
      </div>
    )
  }

  return null
}

// Export skeleton component for table rows
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2" data-testid="skeleton-table">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="flex-1 h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"
              data-testid={`skeleton-cell-${rowIndex}-${colIndex}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Export skeleton component for cards
export function SkeletonCard({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="skeleton-cards">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg overflow-hidden border border-gray-200 animate-pulse"
          data-testid={`skeleton-card-${index}`}
        >
          {/* Image placeholder */}
          <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />

          {/* Content placeholder */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
