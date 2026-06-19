// import { useState, useEffect } from 'react'
// import DashboardLayout from '../shared/DashboardLayout'
// import axios from '../../../utils/axios'

// const creatorLinks = [
//   { to: '/creator/dashboard',      icon: '📊', label: 'Dashboard' },
//   { to: '/creator/opportunities',  icon: '🔍', label: 'Browse Opportunities' },
//   { to: '/creator/applications',   icon: '📋', label: 'My Applications' },
//   { to: '/creator/collaborations', icon: '🤝', label: 'Active Collaborations' },
//   { to: '/creator/earnings',       icon: '💰', label: 'Earnings' },
//   { to: '/creator/profile',        icon: '👤', label: 'Profile Settings' },
// ]

// const categories = ['All', 'AI Marketing', 'Fashion', 'Food', 'Tech', 'Lifestyle', 'Gaming']

// const demoData = [
//   { _id: '1', title: 'Need a 30-Second AI Generated Ad', category: 'AI Marketing', budget: 4000, deadline: 5, platform: 'Instagram', brandName: 'TechCo PK', description: 'Looking for a creative creator to produce a short AI-generated advertisement.' },
//   { _id: '2', title: 'Fashion Reel for Summer Collection', category: 'Fashion', budget: 8000, deadline: 7, platform: 'TikTok', brandName: 'StyleHouse', description: 'We need a stylish reel showcasing our summer clothing line.' },
//   { _id: '3', title: 'Food Review Video for New Restaurant', category: 'Food', budget: 3500, deadline: 3, platform: 'YouTube', brandName: 'Foodie Hub', description: 'Visit our new branch and create an honest review video.' },
//   { _id: '4', title: 'Tech Unboxing — Latest Smartphone', category: 'Tech', budget: 12000, deadline: 10, platform: 'YouTube', brandName: 'GadgetZone PK', description: 'Unbox and review our latest flagship smartphone.' },
//   { _id: '5', title: 'Lifestyle Vlog — Morning Routine', category: 'Lifestyle', budget: 5500, deadline: 8, platform: 'Instagram', brandName: 'WellnessPK', description: 'Integrate our wellness product into your morning routine vlog.' },
//   { _id: '6', title: 'Gaming Sponsorship — Mobile Game', category: 'Gaming', budget: 9000, deadline: 6, platform: 'TikTok', brandName: 'GameZone', description: 'Play and promote our newly launched mobile game.' },
// ]

// export default function BrowseOpportunities() {
//   const [opportunities, setOpportunities] = useState([])
//   const [loading, setLoading]             = useState(true)
//   const [category, setCategory]           = useState('All')
//   const [search, setSearch]               = useState('')
//   const [applying, setApplying]           = useState(null)
//   const [counterModal, setCounterModal]   = useState(null)
//   const [counterAmount, setCounterAmount] = useState('')
//   const [counterNote, setCounterNote]     = useState('')
//   const [toast, setToast]                 = useState('')

//   useEffect(() => {
//     fetchOpportunities()
//   }, [])

//   const fetchOpportunities = async () => {
//     try {
//       const res = await axios.get('/opportunities')
//       setOpportunities(res.data.length ? res.data : demoData)
//     } catch {
//       setOpportunities(demoData)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const showToast = (msg) => {
//     setToast(msg)
//     setTimeout(() => setToast(''), 3000)
//   }

// const handleAccept = async (op) => {
//   setApplying(op._id)
//   try {
//     await axios.post('/applications', {
//       opportunityId: op._id,
//       offerType:     'accept',
//       counterAmount: op.budget,
//       note:          '',
//     })
//     showToast(`✅ Applied to "${op.title}" successfully!`)
//   } catch (err) {
//     showToast(err.response?.data?.message || 'Failed to apply.')
//   } finally {
//     setApplying(null)
//   }
// }

// const handleCounter = async () => {
//   if (!counterAmount) return
//   try {
//     await axios.post('/applications', {
//       opportunityId: counterModal._id,
//       offerType:     'counter',
//       counterAmount: Number(counterAmount),
//       note:          counterNote,
//     })
//     showToast(`✅ Counter offer of PKR ${counterAmount} sent!`)
//     setCounterModal(null)
//     setCounterAmount('')
//     setCounterNote('')
//   } catch (err) {
//     showToast(err.response?.data?.message || 'Failed to send counter offer.')
//   }
// }

//   const filtered = opportunities.filter(o => {
//     const matchCat    = category === 'All' || o.category === category
//     const matchSearch = o.title.toLowerCase().includes(search.toLowerCase())
//     return matchCat && matchSearch
//   })

//   return (
//     <DashboardLayout links={creatorLinks}>

//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
//           {toast}
//         </div>
//       )}

//       {/* Counter Offer Modal */}
//       {counterModal && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
//             <h3 className="font-bold text-secondary text-lg mb-1">Send Counter Offer</h3>
//             <p className="text-sm text-muted mb-5">for: {counterModal.title}</p>

//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-secondary mb-1.5">
//                 Your Counter Amount (PKR)
//               </label>
//               <input
//                 type="number" placeholder="e.g. 5000"
//                 value={counterAmount} onChange={e => setCounterAmount(e.target.value)}
//                 className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
//               />
//             </div>
//             <div className="mb-5">
//               <label className="block text-sm font-semibold text-secondary mb-1.5">Note (Optional)</label>
//               <textarea
//                 rows={3} placeholder="Explain your offer..."
//                 value={counterNote} onChange={e => setCounterNote(e.target.value)}
//                 className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light resize-none"
//               />
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setCounterModal(null)}
//                 className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleCounter}
//                 className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
//               >
//                 Send Offer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mb-6">
//         <h1 className="text-2xl font-black text-secondary">Browse Opportunities</h1>
//         <p className="text-muted text-sm mt-1">Find and apply to brand campaigns.</p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3 mb-6">
//         <input
//           type="text" placeholder="Search opportunities..."
//           value={search} onChange={e => setSearch(e.target.value)}
//           className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
//         />
//         <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
//           {categories.map(cat => (
//             <button
//               key={cat} onClick={() => setCategory(cat)}
//               className={`whitespace-nowrap px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
//                 category === cat
//                   ? 'bg-primary text-white'
//                   : 'bg-white text-muted border border-border hover:border-primary hover:text-primary'
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Cards */}
//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-border">
//               <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
//               <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
//               <div className="h-3 bg-gray-100 rounded w-full mb-2" />
//             </div>
//           ))}
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-20 text-muted">
//           <div className="text-5xl mb-4">🔍</div>
//           <p className="font-medium">No opportunities found</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {filtered.map(op => (
//             <div key={op._id} className="bg-card rounded-2xl p-6 border border-border shadow-card hover:border-primary hover:shadow-purple transition-all">
//               <div className="flex items-start justify-between mb-3">
//                 <span className="px-3 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full">
//                   {op.category}
//                 </span>
//                 <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
//                   op.deadline <= 3 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
//                 }`}>
//                   {op.deadline} days left
//                 </span>
//               </div>

//               <h3 className="font-bold text-secondary text-sm mb-2">{op.title}</h3>
//               <p className="text-xs text-muted mb-4 line-clamp-2">{op.description}</p>

//               <div className="space-y-1.5 mb-5">
//                 <div className="flex justify-between text-xs">
//                   <span className="text-muted">Budget</span>
//                   <span className="font-bold text-primary">PKR {op.budget?.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-xs">
//                   <span className="text-muted">Platform</span>
//                   <span className="font-medium text-secondary">{op.platform}</span>
//                 </div>
//                 <div className="flex justify-between text-xs">
//                   <span className="text-muted">Brand</span>
//                   <span className="font-medium text-secondary">{op.brandName}</span>
//                 </div>
//               </div>

//               {/* 3 Action Buttons */}
//               <div className="grid grid-cols-3 gap-2">
//                 <button
//                   onClick={() => handleAccept(op)}
//                   disabled={applying === op._id}
//                   className="py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-60"
//                 >
//                   {applying === op._id ? '...' : '✓ Accept'}
//                 </button>
//                 <button
//                   onClick={() => setCounterModal(op)}
//                   className="py-2 border-2 border-primary text-primary hover:bg-primary-light text-xs font-bold rounded-xl transition-colors"
//                 >
//                   Counter
//                 </button>
//                 <button className="py-2 border-2 border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors">
//                   ✕ Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </DashboardLayout>
//   )
// }


import { useState, useEffect } from 'react'
import DashboardLayout from '../shared/DashboardLayout'
import axios from '../../../utils/axios'

const creatorLinks = [
  { to: '/creator/dashboard',      icon: '📊', label: 'Dashboard' },
  { to: '/creator/opportunities',  icon: '🔍', label: 'Browse Opportunities' },
  { to: '/creator/applications',   icon: '📋', label: 'My Applications' },
  { to: '/creator/collaborations', icon: '🤝', label: 'Active Collaborations' },
  { to: '/creator/earnings',       icon: '💰', label: 'Earnings' },
  { to: '/creator/profile',        icon: '👤', label: 'Profile Settings' },
]

const categories = ['All', 'AI Marketing', 'Fashion', 'Food', 'Tech', 'Lifestyle', 'Gaming', 'Fitness', 'Travel', 'Beauty', 'Education']

export default function BrowseOpportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading]             = useState(true)
  const [category, setCategory]           = useState('All')
  const [search, setSearch]               = useState('')
  const [applying, setApplying]           = useState(null)
  const [counterModal, setCounterModal]   = useState(null)
  const [counterAmount, setCounterAmount] = useState('')
  const [counterNote, setCounterNote]     = useState('')
  const [toast, setToast]                 = useState('')
  const [expanded, setExpanded]           = useState(null) // ← expanded card

  useEffect(() => { fetchOpportunities() }, [])

  const fetchOpportunities = async () => {
    try {
      const res = await axios.get('/opportunities')
      setOpportunities(res.data)
    } catch {
      setOpportunities([])
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleAccept = async (op) => {
    setApplying(op._id)
    try {
      await axios.post('/applications', {
        opportunityId: op._id,
        offerType:     'accept',
        counterAmount: op.budget,
        note:          '',
      })
      showToast(`✅ Applied to "${op.title}" successfully!`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to apply.')
    } finally {
      setApplying(null)
    }
  }

  const handleCounter = async () => {
    if (!counterAmount) return
    try {
      await axios.post('/applications', {
        opportunityId: counterModal._id,
        offerType:     'counter',
        counterAmount: Number(counterAmount),
        note:          counterNote,
      })
      showToast(`✅ Counter offer of PKR ${counterAmount} sent!`)
      setCounterModal(null)
      setCounterAmount('')
      setCounterNote('')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send counter offer.')
    }
  }

  const filtered = opportunities.filter(o => {
    const matchCat    = category === 'All' || o.category === category
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch && o.status === 'active'
  })

  return (
    <DashboardLayout links={creatorLinks}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* ✅ Expanded Opportunity Modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-8"
          onClick={() => setExpanded(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-purple"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark p-6 rounded-t-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">
                    {expanded.category}
                  </span>
                  <h2 className="text-xl font-black text-white mt-2">{expanded.title}</h2>
                  <p className="text-purple-200 text-sm mt-1">
                    by {expanded.brandId?.brandName || expanded.brandId?.fullName || expanded.brandName}
                  </p>
                </div>
                <button
                  onClick={() => setExpanded(null)}
                  className="w-8 h-8 rounded-lg bg-white/20 text-white hover:bg-white/30 flex items-center justify-center font-bold flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">

              {/* Key Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Budget',   value: `PKR ${expanded.budget?.toLocaleString()}`, icon: '💰' },
                  { label: 'Platform', value: expanded.platform,                          icon: '📱' },
                  { label: 'Deadline', value: `${expanded.deadline} days`,                icon: '⏰' },
                  { label: 'Category', value: expanded.category,                          icon: '📁' },
                ].map((item, i) => (
                  <div key={i} className="bg-surface rounded-xl p-3 text-center">
                    <p className="text-lg mb-1">{item.icon}</p>
                    <p className="text-xs text-muted">{item.label}</p>
                    <p className="text-sm font-bold text-secondary mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Full Description */}
              <div>
                <h3 className="text-sm font-bold text-secondary mb-2">📝 Description</h3>
                <div className="bg-surface rounded-xl p-4">
                  <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
                    {expanded.description}
                  </p>
                </div>
              </div>

              {/* Requirements if any */}
              {expanded.requirements && (
                <div>
                  <h3 className="text-sm font-bold text-secondary mb-2">✅ Requirements</h3>
                  <div className="bg-surface rounded-xl p-4">
                    <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
                      {expanded.requirements}
                    </p>
                  </div>
                </div>
              )}

              {/* Deadline warning */}
              <div className={`rounded-xl px-4 py-3 flex items-center gap-2 ${
                expanded.deadline <= 3
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-green-50 border border-green-200'
              }`}>
                <span>{expanded.deadline <= 3 ? '⚠️' : '✅'}</span>
                <p className={`text-sm font-semibold ${
                  expanded.deadline <= 3 ? 'text-red-700' : 'text-green-700'
                }`}>
                  {expanded.deadline <= 3
                    ? `Closing soon — only ${expanded.deadline} days left!`
                    : `${expanded.deadline} days remaining to apply`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => { handleAccept(expanded); setExpanded(null) }}
                  disabled={applying === expanded._id}
                  className="py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-60"
                >
                  {applying === expanded._id ? 'Applying...' : '✓ Accept Budget & Apply'}
                </button>
                <button
                  onClick={() => { setCounterModal(expanded); setExpanded(null) }}
                  className="py-3 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary-light transition-colors text-sm"
                >
                  💬 Send Counter Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Counter Offer Modal */}
      {counterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
            <h3 className="font-bold text-secondary text-lg mb-1">Send Counter Offer</h3>
            <p className="text-sm text-muted mb-1">for: <span className="font-semibold text-secondary">{counterModal.title}</span></p>
            <p className="text-sm text-muted mb-5">
              Brand budget: <span className="font-bold text-primary">PKR {counterModal.budget?.toLocaleString()}</span>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-secondary mb-1.5">Your Counter Amount (PKR)</label>
              <input
                type="number" placeholder="e.g. 5000"
                value={counterAmount} onChange={e => setCounterAmount(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-secondary mb-1.5">Note / Proposal</label>
              <textarea
                rows={4}
                placeholder="Explain why you deserve this amount, your experience, what you'll deliver..."
                value={counterNote} onChange={e => setCounterNote(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCounterModal(null)}
                className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                Cancel
              </button>
              <button onClick={handleCounter}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Browse Opportunities</h1>
        <p className="text-muted text-sm mt-1">Find and apply to brand campaigns.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text" placeholder="Search opportunities..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-white text-muted border border-border hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-border">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium">No opportunities found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(op => (
            <div
              key={op._id}
              className="bg-card rounded-2xl p-6 border border-border shadow-card hover:border-primary hover:shadow-purple transition-all cursor-pointer"
              onClick={() => setExpanded(op)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-3 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full">
                  {op.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  op.deadline <= 3 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  {op.deadline}d left
                </span>
              </div>

              <h3 className="font-bold text-secondary text-sm mb-2 line-clamp-2">{op.title}</h3>
              <p className="text-xs text-muted mb-4 line-clamp-2">{op.description}</p>

              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Budget</span>
                  <span className="font-bold text-primary">PKR {op.budget?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Platform</span>
                  <span className="font-medium text-secondary">{op.platform}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Brand</span>
                  <span className="font-medium text-secondary">
                    {op.brandId?.brandName || op.brandId?.fullName || op.brandName}
                  </span>
                </div>
              </div>

              {/* Click hint */}
              <div className="text-center py-2 bg-primary-light rounded-xl mb-3">
                <p className="text-xs text-primary font-semibold">👆 Tap to view full details</p>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleAccept(op)}
                  disabled={applying === op._id}
                  className="py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-60"
                >
                  {applying === op._id ? '...' : '✓ Accept'}
                </button>
                <button
                  onClick={() => setCounterModal(op)}
                  className="py-2 border-2 border-primary text-primary hover:bg-primary-light text-xs font-bold rounded-xl transition-colors"
                >
                  Counter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}