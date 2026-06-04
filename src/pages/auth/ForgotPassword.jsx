import { useState } from 'react'
import { Link } from 'react-router-dom'
import authBg from '../../assets/auth-bg.jpeg'
import axios from '../../utils/axios'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post('/auth/forgot-password', { email })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-10"
        style={{ backgroundImage: `url(${authBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <span className="text-primary font-black text-lg">T</span>
            </div>
            <span className="text-white font-black text-xl tracking-wide">TRENDORA</span>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Forgot your<br />
            <span className="text-purple-200">password?</span>
          </h2>
          <p className="text-purple-100 text-sm leading-relaxed max-w-xs">
            No worries! Enter your email and we will send you a new password instantly.
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full bg-white ${i === 0 ? 'w-6' : 'w-1.5'} opacity-60`} />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-purple-50">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-black text-base">T</span>
            </div>
            <span className="text-primary font-black text-xl">TRENDORA</span>
          </div>

          <div className="bg-white rounded-3xl shadow-purple p-8 md:p-10">

            {success ? (
              /* Success State */
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📧</span>
                </div>
                <h1 className="text-2xl font-black text-secondary mb-2">Check Your Email!</h1>
                <p className="text-sm text-muted mb-2">We sent a new password to:</p>
                <p className="text-sm font-bold text-primary mb-6">{email}</p>

                <div className="bg-primary-light rounded-xl p-4 mb-6 text-left">
                  <p className="text-xs font-bold text-primary mb-3">Next Steps:</p>
                  <div className="space-y-2">
                    {[
                      'Login with the new password from email',
                      'Go to Profile Settings',
                      'Change to your own password immediately',
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-xs text-muted">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/login"
                  className="block w-full text-center py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors text-sm"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              /* Form State */
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔐</span>
                  </div>
                  <h1 className="text-2xl font-black text-secondary mb-1">Forgot Password</h1>
                  <p className="text-sm text-muted">
                    Enter your email and we will send you a new password.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">✉️</span>
                      <input
                        type="email" required
                        placeholder="Enter your registered email"
                        value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                      />
                    </div>
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-purple text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send New Password'}
                  </button>

                  <p className="text-center text-sm text-muted">
                    Remember your password?{' '}
                    <Link to="/login" className="text-primary font-bold hover:text-primary-dark">
                      Back to Login
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}