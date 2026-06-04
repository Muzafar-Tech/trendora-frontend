import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from '../utils/axios'

const categories = ['All', 'AI Marketing', 'Fashion', 'Food', 'Tech', 'Lifestyle', 'Gaming']

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      const res = await axios.get('/opportunities')
      setOpportunities(res.data)
    } catch (err) {
      // fallback demo data
      setOpportunities(demoData)
    } finally {
      setLoading(false)
    }
  }

  const filtered = opportunities.filter(o => {
    const matchCat = selectedCategory === 'All' || o.category === selectedCategory
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-10 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Live Opportunities
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
            Brand Opportunities
          </h1>
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto">
            Browse active campaigns. Login to apply, accept, or send a counter offer.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-white border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  selectedCategory === cat
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

      {/* Cards */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-6"></div>
                  <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">No opportunities found</p>
              <p className="text-sm mt-1">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(op => (
                <OpportunityCard key={op._id} op={op} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

function OpportunityCard({ op }) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-purple transition-all duration-200 border border-border hover:border-primary group">
      {/* Top */}
      <div className="flex items-start justify-between mb-4">
        <span className="px-3 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full">
          {op.category}
        </span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          op.deadline <= 3
            ? 'bg-red-50 text-red-600'
            : 'bg-green-50 text-green-600'
        }`}>
          {op.deadline} days left
        </span>
      </div>

      {/* Title */}
      <h3 className="font-bold text-secondary text-base mb-2 group-hover:text-primary transition-colors">
        {op.title}
      </h3>
      <p className="text-sm text-muted mb-5 leading-relaxed line-clamp-2">
        {op.description}
      </p>

      {/* Details */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Budget</span>
          <span className="font-bold text-primary">PKR {op.budget?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Platform</span>
          <span className="font-medium text-secondary">{op.platform}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Posted by</span>
          <span className="font-medium text-secondary">{op.brandName}</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        to="/login"
        className="block w-full text-center py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors"
      >
        Login to Apply
      </Link>
    </div>
  )
}

// Demo data jab backend nahi ho
const demoData = [
  {
    _id: '1',
    title: 'Need a 30-Second AI Generated Ad',
    description: 'Looking for a creative creator to produce a short AI-generated advertisement for our new product launch.',
    category: 'AI Marketing',
    budget: 4000,
    deadline: 5,
    platform: 'Instagram',
    brandName: 'TechCo PK',
  },
  {
    _id: '2',
    title: 'Fashion Reel for Summer Collection',
    description: 'We need a stylish reel showcasing our summer clothing line. Must be trendy and engaging.',
    category: 'Fashion',
    budget: 8000,
    deadline: 7,
    platform: 'TikTok',
    brandName: 'StyleHouse',
  },
  {
    _id: '3',
    title: 'Food Review Video for New Restaurant',
    description: 'Visit our new branch and create an honest review video. Full meal provided.',
    category: 'Food',
    budget: 3500,
    deadline: 3,
    platform: 'YouTube',
    brandName: 'Foodie Hub',
  },
  {
    _id: '4',
    title: 'Tech Unboxing — Latest Smartphone',
    description: 'Unbox and review our latest flagship smartphone. Detailed specs walkthrough required.',
    category: 'Tech',
    budget: 12000,
    deadline: 10,
    platform: 'YouTube',
    brandName: 'GadgetZone PK',
  },
  {
    _id: '5',
    title: 'Lifestyle Vlog — Morning Routine',
    description: 'Integrate our wellness product naturally into your morning routine vlog.',
    category: 'Lifestyle',
    budget: 5500,
    deadline: 8,
    platform: 'Instagram',
    brandName: 'WellnessPK',
  },
  {
    _id: '6',
    title: 'Gaming Sponsorship — Mobile Game Launch',
    description: 'Play and promote our newly launched mobile game. Must have gaming audience.',
    category: 'Gaming',
    budget: 9000,
    deadline: 6,
    platform: 'TikTok',
    brandName: 'GameZone',
  },
]