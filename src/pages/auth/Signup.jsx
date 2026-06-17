import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authBg from '../../assets/auth-bg.jpeg'
import axios from '../../utils/axios'
export default function Signup() {
  const [role, setRole]           = useState('creator')
  const [showPass, setShowPass]   = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed]       = useState(false)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    socialPlatform: '', socialProfileUrl: '', address: '',
    brandName: '', websiteUrl: '', brandAddress: '',
  })

  const { register } = useAuth()
  const navigate     = useNavigate()

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  if (form.password !== form.confirmPassword) {
    return setError('Passwords do not match')
  }
  if (form.password.length < 6) {
    return setError('Password must be at least 6 characters')
  }
  if (!agreed) {
    return setError('Please agree to Terms & Conditions')
  }

  setLoading(true)
  try {
    const res = await axios.post('/auth/register', { role, ...form })

    // ✅ Verification page par bhejo
    navigate('/verify-email', { state: { userId: res.data.userId } })

  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed.')
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE — Background Image */}
      <div
        className="hidden lg:flex w-2/5 relative flex-col justify-between p-10"
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
            Create.<br />Connect.<br />
            <span className="text-purple-200">Grow.</span>
          </h2>
          <p className="text-purple-100 text-sm leading-relaxed max-w-xs">
            The all-in-one platform to connect brands with top creators and grow together.
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full bg-white ${i === 0 ? 'w-6' : 'w-1.5'} opacity-60`} />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE — Signup Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center px-6 py-12 bg-purple-50 overflow-y-auto">
        <div className="w-full max-w-xl my-6">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-black text-base">T</span>
            </div>
            <span className="text-primary font-black text-xl">TRENDORA</span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-purple p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-secondary mb-1">Create Your Account</h1>
              <p className="text-sm text-muted">Sign up to get started with Trendora</p>
            </div>

            {/* Role Toggle */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-secondary mb-3">I am signing up as</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    role === 'creator'
                      ? 'bg-primary text-white border-primary shadow-purple'
                      : 'bg-surface text-muted border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  👤 Creator
                </button>
                <button
                  type="button"
                  onClick={() => setRole('brand')}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    role === 'brand'
                      ? 'bg-primary text-white border-primary shadow-purple'
                      : 'bg-surface text-muted border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  🏢 Brand
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">👤</span>
                    <input
                      type="text" required placeholder="Enter your full name"
                      value={form.fullName} onChange={e => update('fullName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">✉️</span>
                    <input
                      type="email" required placeholder="Enter your email address"
                      value={form.email} onChange={e => update('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                    />
                  </div>
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">🔒</span>
                    <input
                      type={showPass ? 'text' : 'password'} required placeholder="Create a password"
                      value={form.password} onChange={e => update('password', e.target.value)}
                      className="w-full pl-10 pr-10 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary text-sm">
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">🔒</span>
                    <input
                      type={showConfirm ? 'text' : 'password'} required placeholder="Confirm your password"
                      value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                      className="w-full pl-10 pr-10 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary text-sm">
                      {showConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Creator Fields */}
              {role === 'creator' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1.5">
                      Most Followed Social Media Account
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">👤</span>
                      <input
                        type="text" placeholder="e.g. @username"
                        value={form.socialPlatform} onChange={e => update('socialPlatform', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Social Profile URL</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">🔗</span>
                      <input
                        type="text" placeholder="e.g. instagram.com/username"
                        value={form.socialProfileUrl} onChange={e => update('socialProfileUrl', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Address</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">📍</span>
                      <input
                        type="text" placeholder="Enter your address"
                        value={form.address} onChange={e => update('address', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Brand Fields */}
              {role === 'brand' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Brand Name</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">🏢</span>
                      <input
                        type="text" placeholder="Enter your brand name"
                        value={form.brandName} onChange={e => update('brandName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Website URL</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">🌐</span>
                      <input
                        type="text" placeholder="Enter your website URL"
                        value={form.websiteUrl} onChange={e => update('websiteUrl', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1.5">Brand Address</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">📍</span>
                      <input
                        type="text" placeholder="Enter your brand address"
                        value={form.brandAddress} onChange={e => update('brandAddress', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-surface"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox" checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-primary"
                />
                <span className="text-sm text-muted">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary font-semibold hover:underline">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy-policy" className="text-primary font-semibold hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-purple text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:text-primary-dark">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}