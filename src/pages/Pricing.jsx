import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Creator Free',
    price: '0',
    desc: 'Perfect for new creators just starting out.',
    features: [
      'Browse all opportunities',
      'Apply to up to 5 opportunities/month',
      'Basic profile page',
      'Standard support',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Creator Pro',
    price: '999',
    desc: 'For serious creators who want more reach.',
    features: [
      'Unlimited opportunity applications',
      'Featured profile badge',
      'Priority in brand searches',
      'Analytics dashboard',
      'Priority support',
    ],
    cta: 'Start Pro',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Brand',
    price: '1,999',
    desc: 'For brands ready to run powerful campaigns.',
    features: [
      'Post unlimited opportunities',
      'Access all creator profiles',
      'Campaign analytics',
      'Dedicated account manager',
      'Priority support',
    ],
    cta: 'Start as Brand',
    highlight: false,
  },
]

const commission = [
  { label: 'Platform Commission', value: '10%', desc: 'Deducted from each successful collaboration payment' },
  { label: 'Payment Method', value: 'JazzCash / Bank', desc: 'Secure manual transfer with admin verification' },
  { label: 'Payout Time', value: '24-48 hrs', desc: 'After brand approves the delivered work' },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-14 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Transparent Pricing
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
            Simple & Fair Pricing
          </h1>
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto">
            No hidden fees. Pay only when you grow.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`bg-card rounded-2xl p-7 border transition-all relative ${
                  plan.highlight
                    ? 'border-primary shadow-purple scale-105'
                    : 'border-border shadow-card hover:border-primary hover:shadow-purple'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary text-white text-xs font-bold rounded-full shadow">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3 className="font-bold text-secondary text-lg mb-1">{plan.name}</h3>
                <p className="text-sm text-muted mb-5">{plan.desc}</p>

                <div className="flex items-end gap-1 mb-6">
                  <span className="text-xs text-muted font-medium">PKR</span>
                  <span className="text-4xl font-extrabold text-secondary">{plan.price}</span>
                  <span className="text-sm text-muted mb-1">/month</span>
                </div>

                <ul className="space-y-3 mb-7">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-primary mt-0.5 font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'border-2 border-primary text-primary hover:bg-primary-light'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Info */}
      <section className="py-14 bg-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary text-center mb-10">
            Commission & Payments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {commission.map((c, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 text-center shadow-card border border-border">
                <div className="text-3xl font-extrabold text-primary mb-2">{c.value}</div>
                <div className="font-semibold text-secondary text-sm mb-1">{c.label}</div>
                <div className="text-xs text-muted">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-section">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Start Free Today
          </h2>
          <p className="text-purple-200 mb-8">No credit card required. Upgrade anytime.</p>
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