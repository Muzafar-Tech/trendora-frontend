import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { creatorLinks } from './CreatorDashboard'
import { useAuth } from '../../../context/AuthContext'
import axios from '../../../utils/axios'

export default function CreatorProfile() {
  const { user, login } = useAuth()

  const [myReviews, setMyReviews] = useState({ reviews: [], avgRating: 0, total: 0 })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/reviews/my')
      setMyReviews(res.data)
    } catch {}
  }

  const [form, setForm] = useState({
    fullName:          user?.fullName || '',
    email:             user?.email || '',
    socialPlatform:    user?.socialPlatform || '',
    socialProfileUrl:  user?.socialProfileUrl || '',
    address:           user?.address || '',
    jazzCashNumber:    user?.jazzCashNumber || '',
    easypaisaNumber:   user?.easypaisaNumber || '',
    bankName:          user?.bankName || '',
    bankAccountNumber: user?.bankAccountNumber || '',
    bankAccountTitle:  user?.bankAccountTitle || '',
  })

  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })

  const [loading, setLoading]         = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [toast, setToast]             = useState('')
  const [toastType, setToastType]     = useState('success')

  const update     = (field, val) => setForm(prev => ({ ...prev, [field]: val }))
  const updatePass = (field, val) => setPassForm(prev => ({ ...prev, [field]: val }))

  const showToast = (msg, type = 'success') => {
    setToast(msg)
    setToastType(type)
    setTimeout(() => setToast(''), 3000)
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put('/auth/profile', form)
      showToast('✅ Profile updated successfully!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirmPassword) {
      return showToast('Passwords do not match', 'error')
    }
    if (passForm.newPassword.length < 6) {
      return showToast('Password must be at least 6 characters', 'error')
    }
    setPassLoading(true)
    try {
      await axios.put('/auth/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword:     passForm.newPassword,
      })
      showToast('✅ Password changed successfully!')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error')
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <DashboardLayout links={creatorLinks}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 text-white text-sm font-semibold rounded-xl shadow-purple ${
          toastType === 'error' ? 'bg-red-500' : 'bg-primary'
        }`}>
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Profile Settings</h1>
        <p className="text-muted text-sm mt-1">Update your personal and payment information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-3xl mx-auto mb-4">
              {user?.fullName?.[0] || 'C'}
            </div>
            <h3 className="font-bold text-secondary text-lg">{user?.fullName}</h3>
            <p className="text-sm text-muted mt-1">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full capitalize">
              {user?.role}
            </span>

            <div className="mt-5 pt-5 border-t border-border space-y-2 text-left">
              {user?.socialPlatform && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>👤</span>
                  <span>{user.socialPlatform}</span>
                </div>
              )}
              {user?.socialProfileUrl && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>🔗</span>
                  <a href={user.socialProfileUrl} target="_blank" rel="noreferrer"
                    className="text-primary hover:underline truncate">
                    Profile Link
                  </a>
                </div>
              )}
              {user?.address && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span>📍</span>
                  <span>{user.address}</span>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="mt-4 pt-4 border-t border-border text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-lg ${s <= Math.round(myReviews.avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm font-bold text-secondary">
                {myReviews.avgRating} / 5
              </p>
              <p className="text-xs text-muted">{myReviews.total} reviews</p>
            </div>

            {/* Reviews List */}
            {myReviews.reviews.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-bold text-secondary mb-3">Recent Reviews</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {myReviews.reviews.map(r => (
                    <div key={r._id} className="bg-surface rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-secondary">
                          {r.brandId?.brandName || r.brandId?.fullName}
                        </p>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-sm ${s <= r.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted">{r.review}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Forms — col-span-2 */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Personal Info + Payment ── */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <h2 className="font-bold text-secondary mb-5">Personal Information</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">Full Name</label>
                  <input type="text" value={form.fullName}
                    onChange={e => update('fullName', e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">Email</label>
                  <input type="email" value={form.email} disabled
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-surface text-muted cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">Social Account</label>
                  <input type="text" placeholder="@username"
                    value={form.socialPlatform} onChange={e => update('socialPlatform', e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">Profile URL</label>
                  <input type="text" placeholder="instagram.com/username"
                    value={form.socialProfileUrl} onChange={e => update('socialProfileUrl', e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">Address</label>
                <input type="text" placeholder="Your address"
                  value={form.address} onChange={e => update('address', e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              {/* Payment Info */}
              <div className="pt-4 border-t border-border">
                <h3 className="font-bold text-secondary mb-1 text-sm">
                  💰 Payment Information
                </h3>
                <p className="text-xs text-muted mb-4">
                  Admin will use these details to send your payment after work approval.
                </p>

                <div className="space-y-4">
                  {/* JazzCash / Easypaisa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1.5">
                        JazzCash Number
                      </label>
                      <input
                        type="text" placeholder="03XX-XXXXXXX"
                        value={form.jazzCashNumber}
                        onChange={e => update('jazzCashNumber', e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1.5">
                        Easypaisa Number
                      </label>
                      <input
                        type="text" placeholder="03XX-XXXXXXX"
                        value={form.easypaisaNumber}
                        onChange={e => update('easypaisaNumber', e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                  </div>

                  {/* Bank */}
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-1.5">
                      Bank Name (Optional)
                    </label>
                    <input
                      type="text" placeholder="e.g. HBL, UBL, Meezan"
                      value={form.bankName}
                      onChange={e => update('bankName', e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1.5">
                        Account Number
                      </label>
                      <input
                        type="text" placeholder="Bank account number"
                        value={form.bankAccountNumber}
                        onChange={e => update('bankAccountNumber', e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-secondary mb-1.5">
                        Account Title
                      </label>
                      <input
                        type="text" placeholder="Account holder name"
                        value={form.bankAccountTitle}
                        onChange={e => update('bankAccountTitle', e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Profile Button */}
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-60">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>

            </form>
          </div>

          {/* ── Change Password ── */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <h2 className="font-bold text-secondary mb-5">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">Current Password</label>
                <input type="password" placeholder="Enter current password"
                  value={passForm.currentPassword} onChange={e => updatePass('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">New Password</label>
                  <input type="password" placeholder="New password"
                    value={passForm.newPassword} onChange={e => updatePass('newPassword', e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">Confirm Password</label>
                  <input type="password" placeholder="Confirm new password"
                    value={passForm.confirmPassword} onChange={e => updatePass('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                  />
                </div>
              </div>
              <button type="submit" disabled={passLoading}
                className="w-full py-3 bg-secondary hover:bg-gray-800 text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-60">
                {passLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>

        </div>{/* end lg:col-span-2 */}
      </div>{/* end grid */}
    </DashboardLayout>
  )
}