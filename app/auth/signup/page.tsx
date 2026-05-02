'use client'

import { signUp } from '@/lib/auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: authError } = await signUp(email, password, fullName)

    if (authError) {
      setError(authError instanceof Error ? authError.message : 'Sign up failed')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="card max-w-md w-full text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold mb-2">Account Created</h2>
          <p className="text-gray-400">
            Check your email to confirm your account, then sign in.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="card max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900 text-red-200 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
