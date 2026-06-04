import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const contactInfo = [
  { icon: '📧', label: 'Email', value: 'trendaoraofficial@gmail.com' },
  { icon: '📍', label: 'Location', value: 'Lahore, Pakistan' },
  { icon: '🕐', label: 'Support Hours', value: 'Mon - Fri, 9AM - 6PM PKT' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-14 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
            Contact Us
          </h1>
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto">
            Have a question or need help? We are here for you.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Info */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-secondary mb-6">Contact Information</h2>
              {contactInfo.map((c, i) => (
                <div key={i} className="flex items-start gap-4 bg-card rounded-2xl p-4 border border-border shadow-card">
                  <div className="text-2xl">{c.icon}</div>
                  <div>
                    <div className="text-xs text-muted font-medium">{c.label}</div>
                    <div className="text-sm font-semibold text-secondary mt-0.5">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-card rounded-2xl p-8 shadow-card border border-border">
              {sent ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-secondary mb-2">Message Sent!</h3>
                  <p className="text-muted text-sm">We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold text-secondary mb-6">Send a Message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Ali Hassan"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="ali@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}