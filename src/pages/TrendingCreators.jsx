import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const categories = ['All', 'Lifestyle', 'Tech', 'Fashion', 'Food', 'Gaming', 'Fitness', 'Travel']

const creators = [
  {
    id: 1,
    name: 'Ayesha Khan',
    category: 'Lifestyle',
    platform: 'Instagram',
    followers: '245K',
    engagement: '4.8%',
    completedJobs: 32,
    bio: 'Lifestyle content creator sharing daily routines, wellness tips, and home decor inspiration.',
    tags: ['Wellness', 'Home', 'Routine'],
  },
  {
    id: 2,
    name: 'Bilal Chaudhry',
    category: 'Tech',
    platform: 'YouTube',
    followers: '189K',
    engagement: '6.2%',
    completedJobs: 28,
    bio: 'Tech reviewer covering the latest smartphones, laptops, and gadgets in Pakistan.',
    tags: ['Gadgets', 'Reviews', 'Smartphones'],
  },
  {
    id: 3,
    name: 'Sara Ahmed',
    category: 'Fashion',
    platform: 'TikTok',
    followers: '312K',
    engagement: '7.1%',
    completedJobs: 45,
    bio: 'Fashion influencer showcasing Pakistani and international trends with styling tips.',
    tags: ['Style', 'OOTD', 'Trends'],
  },
  {
    id: 4,
    name: 'Usman Malik',
    category: 'Food',
    platform: 'Instagram',
    followers: '98K',
    engagement: '5.5%',
    completedJobs: 19,
    bio: 'Food blogger exploring the best street food and restaurants across Pakistan.',
    tags: ['Street Food', 'Reviews', 'Recipes'],
  },
  {
    id: 5,
    name: 'Zara Hussain',
    category: 'Fitness',
    platform: 'Instagram',
    followers: '156K',
    engagement: '8.3%',
    completedJobs: 24,
    bio: 'Certified fitness coach helping women build strength and confidence through workouts.',
    tags: ['Workout', 'Health', 'Motivation'],
  },
  {
    id: 6,
    name: 'Ali Raza',
    category: 'Gaming',
    platform: 'YouTube',
    followers: '421K',
    engagement: '5.9%',
    completedJobs: 38,
    bio: 'Pro gamer and content creator streaming mobile and PC games daily.',
    tags: ['Mobile Gaming', 'Esports', 'Live'],
  },
  {
    id: 7,
    name: 'Maryam Tariq',
    category: 'Travel',
    platform: 'YouTube',
    followers: '87K',
    engagement: '9.1%',
    completedJobs: 15,
    bio: 'Travel vlogger exploring Pakistan\'s hidden gems and international destinations.',
    tags: ['Vlog', 'Adventure', 'Pakistan'],
  },
  {
    id: 8,
    name: 'Hassan Sheikh',
    category: 'Tech',
    platform: 'TikTok',
    followers: '203K',
    engagement: '6.7%',
    completedJobs: 22,
    bio: 'Making tech simple for everyone — tips, tricks, and tutorials in Urdu.',
    tags: ['Tips', 'Urdu Tech', 'Tutorials'],
  },
  {
    id: 9,
    name: 'Nida Farooq',
    category: 'Fashion',
    platform: 'Instagram',
    followers: '178K',
    engagement: '5.2%',
    completedJobs: 41,
    bio: 'Luxury and modest fashion blogger with a focus on Pakistani designer wear.',
    tags: ['Modest Fashion', 'Designer', 'Beauty'],
  },
]

const platformColors = {
  Instagram: 'bg-pink-50 text-pink-600',
  YouTube:   'bg-red-50 text-red-600',
  TikTok:    'bg-gray-100 text-gray-700',
}

const avatarColors = [
  'from-purple-400 to-purple-700',
  'from-blue-400 to-blue-700',
  'from-pink-400 to-pink-700',
  'from-green-400 to-green-700',
  'from-orange-400 to-orange-700',
  'from-teal-400 to-teal-700',
  'from-red-400 to-red-600',
  'from-indigo-400 to-indigo-700',
  'from-yellow-400 to-yellow-600',
]

export default function TrendingCreators() {
  const [selected, setSelected] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = creators.filter(c => {
    const matchCat = selected === 'All' || c.category === selected
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-14 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Top Performers
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
            Trending Creators
          </h1>
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto">
            Discover Pakistan's top content creators. Login to collaborate with them.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-white border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search creators..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className={`whitespace-nowrap px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  selected === cat
                    ? 'bg-primary text-white'
                    : 'bg-surface text-muted hover:bg-primary-light hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Creators Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">No creators found</p>
              <p className="text-sm mt-1">Try a different category or name</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c, i) => (
                <div
                  key={c.id}
                  className="bg-card rounded-2xl p-6 shadow-card border border-border hover:border-primary hover:shadow-purple transition-all group"
                >
                  {/* Top */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                      {c.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-secondary group-hover:text-primary transition-colors truncate">
                        {c.name}
                      </h3>
                      <p className="text-xs text-muted mt-0.5">{c.category}</p>
                      <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${platformColors[c.platform]}`}>
                        {c.platform}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-2">{c.bio}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-primary-light text-primary rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-5 py-3 border-t border-b border-border">
                    <div className="text-center">
                      <div className="text-sm font-bold text-secondary">{c.followers}</div>
                      <div className="text-xs text-muted">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-secondary">{c.engagement}</div>
                      <div className="text-xs text-muted">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-secondary">{c.completedJobs}</div>
                      <div className="text-xs text-muted">Jobs Done</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to="/login"
                    className="block w-full text-center py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Login to Collaborate
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-section">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Are You a Creator?
          </h2>
          <p className="text-purple-200 mb-8">
            Join Trendora and get discovered by top brands in Pakistan.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-purple-50 transition-colors"
          >
            Join as Creator
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}