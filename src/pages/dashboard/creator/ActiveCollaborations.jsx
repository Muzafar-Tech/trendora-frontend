import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import { creatorLinks } from './CreatorDashboard'
import axios from '../../../utils/axios'

const statusColors = {
  active:    'bg-blue-50 text-blue-700',
  submitted: 'bg-yellow-50 text-yellow-700',
  completed: 'bg-green-50 text-green-700',
  revision:  'bg-orange-50 text-orange-700',
  cancelled: 'bg-red-50 text-red-600',
  disputed:  'bg-red-50 text-red-600',
}

export default function ActiveCollaborations() {
  const [collaborations, setCollaborations] = useState([])
  const [loading, setLoading]               = useState(true)
  const [selected, setSelected]             = useState(null)
  const [messages, setMessages]             = useState([])
  const [newMsg, setNewMsg]                 = useState('')
  const [submitModal, setSubmitModal]       = useState(null)
  const [workLink, setWorkLink]             = useState('')
  const [toast, setToast]                   = useState('')

  useEffect(() => { fetchCollaborations() }, [])
  useEffect(() => { if (selected) fetchMessages(selected._id) }, [selected])

  const fetchCollaborations = async () => {
    try {
      const res = await axios.get('/collaborations/creator')
      setCollaborations(res.data)
    } catch {
      setCollaborations([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (id) => {
    try {
      const res = await axios.get(`/messages/${id}`)
      setMessages(res.data)
    } catch {
      setMessages([])
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSendMsg = async (e) => {
    e.preventDefault()
    if (!newMsg.trim()) return
    try {
      const res = await axios.post(`/messages/${selected._id}`, { message: newMsg })
      setMessages(prev => [...prev, res.data])
      setNewMsg('')
    } catch {
      showToast('Failed to send message')
    }
  }

  const handleSubmitWork = async () => {
    if (!workLink.trim()) return
    try {
      const res = await axios.put(`/collaborations/${submitModal._id}/submit`, {
        submittedWork: workLink
      })
      setCollaborations(prev => prev.map(c =>
        c._id === submitModal._id ? { ...c, status: 'submitted' } : c
      ))
      if (selected?._id === submitModal._id) {
        setSelected(prev => ({ ...prev, status: 'submitted' }))
      }
      showToast('✅ Work submitted successfully!')
      setSubmitModal(null)
      setWorkLink('')
    } catch {
      showToast('Failed to submit work')
    }
  }

  return (
    <DashboardLayout links={creatorLinks}>

      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* Submit Work Modal */}
      {submitModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
            <h3 className="font-bold text-secondary text-lg mb-1">Submit Work</h3>
            <p className="text-sm text-muted mb-5">for: {submitModal.opportunityId?.title}</p>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-secondary mb-1.5">
                Work Link / Description
              </label>
              <textarea
                rows={4}
                placeholder="Paste your work link (Google Drive, YouTube, etc.) or describe the work done..."
                value={workLink} onChange={e => setWorkLink(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSubmitModal(null)}
                className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmitWork}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
                Submit Work
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Active Collaborations</h1>
        <p className="text-muted text-sm mt-1">Manage your ongoing projects and chat with brands.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-card rounded-2xl border border-border animate-pulse" />
          ))}
        </div>
      ) : collaborations.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
          <div className="text-5xl mb-3">🤝</div>
          <p className="font-medium text-secondary">No collaborations yet</p>
          <p className="text-muted text-sm mt-1">Apply to opportunities to start collaborating.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* List */}
          <div className="space-y-4">
            {collaborations.map(c => (
              <div
                key={c._id}
                onClick={() => setSelected(c)}
                className={`bg-card rounded-2xl border shadow-card p-5 cursor-pointer transition-all hover:shadow-purple ${
                  selected?._id === c._id ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-secondary text-sm line-clamp-1">
                      {c.opportunityId?.title}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      {c.brandId?.brandName || c.brandId?.fullName}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusColors[c.status]}`}>
                    {c.status === 'active' ? 'In Progress'
                      : c.status === 'submitted' ? 'Under Review'
                      : c.status === 'revision' ? 'Revision'
                      : c.status === 'completed' ? 'Completed'
                      : c.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted mb-3">
                  <span>💰 PKR {c.agreedAmount?.toLocaleString()}</span>
                  <span>⏰ {c.deadline} days</span>
                  <span>📱 {c.opportunityId?.platform}</span>
                </div>

                {/* Revision Note */}
                {c.status === 'revision' && c.revisionNote && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-3">
                    <p className="text-xs font-bold text-orange-700">Revision Note:</p>
                    <p className="text-xs text-orange-600 mt-0.5">{c.revisionNote}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(c) }}
                    className="flex-1 py-2 bg-primary-light text-primary text-xs font-bold rounded-xl hover:bg-primary hover:text-white transition-colors"
                  >
                    💬 Chat
                  </button>
                  {(c.status === 'active' || c.status === 'revision') && (
                    <button
                      onClick={e => { e.stopPropagation(); setSubmitModal(c) }}
                      className="flex-1 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
                    >
                      📦 Submit Work
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Panel */}
          {selected ? (
            <div className="bg-card rounded-2xl border border-border shadow-card flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold">
                  {selected.brandId?.brandName?.[0] || selected.brandId?.fullName?.[0] || 'B'}
                </div>
                <div>
                  <p className="font-bold text-secondary text-sm">
                    {selected.brandId?.brandName || selected.brandId?.fullName}
                  </p>
                  <p className="text-xs text-muted line-clamp-1">{selected.opportunityId?.title}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-sm">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId?.role === 'creator'
                    return (
                      <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-primary text-white rounded-br-sm'
                            : 'bg-surface text-secondary rounded-bl-sm'
                        }`}>
                          <p>{msg.message}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-purple-200' : 'text-muted'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMsg} className="p-4 border-t border-border flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMsg} onChange={e => setNewMsg(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
                <button type="submit"
                  className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors">
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border shadow-card flex items-center justify-center h-[600px]">
              <div className="text-center text-muted">
                <div className="text-5xl mb-3">💬</div>
                <p className="font-medium">Select a collaboration</p>
                <p className="text-sm mt-1">to open the chat</p>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}