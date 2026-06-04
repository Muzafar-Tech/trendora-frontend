import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  { icon: '🎯', title: 'Smart Matching', desc: 'AI-powered brand-creator matching based on niche, audience, and budget.' },
  { icon: '💬', title: 'Private Chat', desc: 'Secure chat unlocks only after collaboration is confirmed.' },
  { icon: '💰', title: 'Safe Payments', desc: 'Escrow system ensures creators get paid and brands get results.' },
  { icon: '📊', title: 'Analytics', desc: 'Track campaign performance and creator engagement in real time.' },
  { icon: '🛡️', title: 'Verified Profiles', desc: 'All creators and brands go through a verification process.' },
  { icon: '⚡', title: 'Fast Collaboration', desc: 'From opportunity post to collaboration in minutes, not days.' },
]

const steps = [
  { step: '01', title: 'Brand Posts Opportunity', desc: 'Brand creates a campaign with budget, deadline, and requirements.' },
  { step: '02', title: 'Creators Apply', desc: 'Creators browse and apply, accept, or send counter offers.' },
  { step: '03', title: 'Collaboration Starts', desc: 'Once both agree, chat unlocks and work begins.' },
  { step: '04', title: 'Payment Released', desc: 'After approval, platform releases payment to creator automatically.' },
]

const creators = [
  { name: 'Ayesha Khan', category: 'Lifestyle', followers: '245K', platform: 'Instagram' },
  { name: 'Bilal Chaudhry', category: 'Tech', followers: '189K', platform: 'YouTube' },
  { name: 'Sara Ahmed', category: 'Fashion', followers: '312K', platform: 'TikTok' },
  { name: 'Usman Malik', category: 'Food', followers: '98K', platform: 'Instagram' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-6 uppercase tracking-wide">
            Pakistan's #1 Creator Platform
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Create. Connect.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
              Grow.
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Trendora connects brands with top creators for seamless collaborations.
            Post opportunities, negotiate deals, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-purple-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/opportunities"
              className="px-8 py-3.5 border-2 border-purple-200 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
            >
              Browse Opportunities
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: '500+', label: 'Active Creators' },
              { value: '200+', label: 'Brands' },
              { value: 'PKR 2M+', label: 'Paid Out' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold text-purple-700">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Simple 4-step process to start collaborating</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-black text-purple-100 mb-3">{s.step}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 right-0 translate-x-1/2 text-purple-300 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Trendora?</h2>
            <p className="text-gray-500">Everything you need for successful collaborations</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Creators */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Creators</h2>
              <p className="text-gray-500 mt-1">Top performers this week</p>
            </div>
            <Link to="/trending-creators" className="text-purple-600 text-sm font-semibold hover:text-purple-800">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {creators.map((c, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-5 hover:border-purple-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-white font-bold text-lg mb-4">
                  {c.name[0]}
                </div>
                <h3 className="font-bold text-gray-900">{c.name}</h3>
                <p className="text-xs text-purple-600 font-medium mt-0.5">{c.category}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{c.platform}</span>
                  <span className="font-semibold text-gray-700">{c.followers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-purple-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Grow?</h2>
          <p className="text-purple-200 mb-8">
            Join hundreds of creators and brands already collaborating on Trendora.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-colors"
            >
              Join as Creator
            </Link>
            <Link
              to="/signup"
              className="px-8 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              Join as Brand
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}