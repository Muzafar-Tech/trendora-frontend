import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🎯',
    title: 'Smart Matching',
    desc: 'Our system matches brands with the most relevant creators based on niche, audience size, and past performance.',
    tag: 'Core',
  },
  {
    icon: '💬',
    title: 'Private Chat',
    desc: 'Secure messaging unlocks only after a collaboration is confirmed — keeping communication focused and safe.',
    tag: 'Core',
  },
  {
    icon: '🔄',
    title: 'Counter Offer System',
    desc: 'Creators and brands can negotiate freely — accept, reject, or send counter offers until both parties agree.',
    tag: 'Negotiation',
  },
  {
    icon: '💰',
    title: 'Escrow Payments',
    desc: 'Brand payment is held securely until work is approved. Creator gets paid automatically after approval.',
    tag: 'Payments',
  },
  {
    icon: '📊',
    title: 'Dashboard Analytics',
    desc: 'Track earnings, active collaborations, pending applications, and campaign performance in real time.',
    tag: 'Analytics',
  },
  {
    icon: '🛡️',
    title: 'Verified Profiles',
    desc: 'All accounts go through verification to ensure authenticity of both creators and brands.',
    tag: 'Security',
  },
  {
    icon: '⚡',
    title: 'Fast Onboarding',
    desc: 'Sign up, complete your profile, and start posting or applying to opportunities within minutes.',
    tag: 'Core',
  },
  {
    icon: '🔔',
    title: 'Real-time Notifications',
    desc: 'Get instant alerts for new applications, counter offers, approvals, and payment releases.',
    tag: 'Core',
  },
  {
    icon: '👑',
    title: 'Admin Control',
    desc: 'Full admin dashboard to manage users, resolve disputes, track payments, and monitor platform activity.',
    tag: 'Admin',
  },
]

const tagColors = {
  Core:        'bg-primary-light text-primary',
  Negotiation: 'bg-yellow-50 text-yellow-700',
  Payments:    'bg-green-50 text-green-700',
  Analytics:   'bg-blue-50 text-blue-700',
  Security:    'bg-red-50 text-red-600',
  Admin:       'bg-gray-100 text-gray-700',
}

export default function Features() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-14 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Platform Features
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
            Everything You Need
          </h1>
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto">
            Trendora is built for creators and brands who want real results, not just connections.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-6 shadow-card border border-border hover:border-primary hover:shadow-purple transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{f.icon}</div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[f.tag]}`}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-bold text-secondary text-base mb-2 group-hover:text-primary transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-section">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Start Using These Features Today
          </h2>
          <p className="text-purple-200 mb-8">Free to join. No hidden charges.</p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-purple-50 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}