import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-white font-bold text-lg">Trendora</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Create. Connect. Grow.<br />
              Pakistan's creator-brand collaboration platform.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/how-it-works" className="hover:text-purple-400 transition-colors">How It Works</Link></li>
              <li><Link to="/features" className="hover:text-purple-400 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
              <li><Link to="/opportunities" className="hover:text-purple-400 transition-colors">Opportunities</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-purple-400 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-purple-400 transition-colors">Contact</Link></li>
              <li><Link to="/trending-creators" className="hover:text-purple-400 transition-colors">Trending Creators</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-purple-400 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Trendora. All rights reserved.
        </div>
      </div>
    </footer>
  )
}