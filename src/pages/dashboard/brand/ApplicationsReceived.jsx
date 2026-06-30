// import { useState, useEffect } from 'react'
// import DashboardLayout from '../shared/DashboardLayout'
// import { brandLinks } from './BrandDashboard'
// import axios from '../../../utils/axios'

// const statusColors = {
//   pending:   'bg-yellow-50 text-yellow-700',
//   accepted:  'bg-green-50 text-green-700',
//   rejected:  'bg-red-50 text-red-600',
//   countered: 'bg-blue-50 text-blue-700',
//   withdrawn: 'bg-gray-100 text-gray-500',
// }

// const statusLabels = {
//   pending:   '⏳ Pending',
//   accepted:  '✅ Accepted',
//   rejected:  '❌ Rejected',
//   countered: '🔄 Counter Offer',
//   withdrawn: '↩️ Withdrawn',
// }

// const avatarColors = [
//   'from-purple-400 to-purple-700',
//   'from-blue-400 to-blue-700',
//   'from-green-400 to-green-700',
//   'from-pink-400 to-pink-700',
//   'from-orange-400 to-orange-600',
// ]

// export default function ApplicationsReceived() {
//   const [applications, setApplications] = useState([])
//   const [loading, setLoading]           = useState(true)
//   const [toast, setToast]               = useState('')
//   const [counterModal, setCounterModal] = useState(null)
//   const [counterAmount, setCounterAmount] = useState('')
//   const [counterNote, setCounterNote]   = useState('')

//   useEffect(() => { fetchApplications() }, [])

//   const fetchApplications = async () => {
//     try {
//       const res = await axios.get('/applications/brand')
//       setApplications(res.data)
//     } catch {
//       setApplications([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const showToast = (msg) => {
//     setToast(msg)
//     setTimeout(() => setToast(''), 3000)
//   }

//  const handleRespond = async (id, action) => {
//   try {
//     if (action === 'accept') {
//       await axios.put(`/applications/${id}/respond`, { action })
//       const res = await axios.post('/collaborations', { applicationId: id })
//       setApplications(prev => prev.map(a =>
//         a._id === id ? { ...a, status: 'accepted' } : a
//       ))
//       showToast('✅ Application accepted! Please complete payment.')
//     } else {
//       await axios.put(`/applications/${id}/respond`, { action })
//       setApplications(prev => prev.map(a =>
//         a._id === id ? { ...a, status: 'rejected' } : a
//       ))
//       showToast('❌ Application rejected')
//     }
//   } catch (err) {
//     showToast(err.response?.data?.message || 'Failed')
//   }
// }
//   const handleCounter = async () => {
//     if (!counterAmount) return
//     try {
//       await axios.put(`/applications/${counterModal._id}/respond`, {
//         action: 'counter',
//         counterAmount: Number(counterAmount),
//         note: counterNote,
//       })
//       setApplications(prev => prev.map(a =>
//         a._id === counterModal._id ? { ...a, status: 'countered' } : a
//       ))
//       showToast('Counter offer sent to creator!')
//       setCounterModal(null)
//       setCounterAmount('')
//       setCounterNote('')
//     } catch (err) {
//       showToast(err.response?.data?.message || 'Failed')
//     }
//   }

//   return (
//     <DashboardLayout links={brandLinks}>

//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
//           {toast}
//         </div>
//       )}

//       {/* Counter Modal */}
//       {counterModal && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
//             <h3 className="font-bold text-secondary text-lg mb-1">Send Counter Offer</h3>
//             <p className="text-sm text-muted mb-1">To: <span className="font-semibold text-secondary">{counterModal.creatorId?.fullName}</span></p>
//             <p className="text-sm text-muted mb-5">
//               Creator offered: <span className="font-bold text-primary">PKR {counterModal.counterAmount?.toLocaleString()}</span>
//             </p>

//             <div className="mb-4">
//               <label className="block text-sm font-semibold text-secondary mb-1.5">Your Counter Amount (PKR)</label>
//               <input
//                 type="number" placeholder="e.g. 5000"
//                 value={counterAmount} onChange={e => setCounterAmount(e.target.value)}
//                 className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
//               />
//             </div>
//             <div className="mb-5">
//               <label className="block text-sm font-semibold text-secondary mb-1.5">Note (Optional)</label>
//               <textarea
//                 rows={3} placeholder="Explain your counter offer..."
//                 value={counterNote} onChange={e => setCounterNote(e.target.value)}
//                 className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
//               />
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => setCounterModal(null)}
//                 className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
//                 Cancel
//               </button>
//               <button onClick={handleCounter}
//                 className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors">
//                 Send Counter
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mb-6">
//         <h1 className="text-2xl font-black text-secondary">Applications Received</h1>
//         <p className="text-muted text-sm mt-1">Review and respond to creator applications.</p>
//       </div>

//       {loading ? (
//         <div className="space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="bg-card rounded-2xl p-6 border border-border animate-pulse">
//               <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
//               <div className="h-3 bg-gray-100 rounded w-1/3" />
//             </div>
//           ))}
//         </div>
//       ) : applications.length === 0 ? (
//         <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
//           <div className="text-5xl mb-3">👥</div>
//           <p className="font-medium text-secondary">No applications yet</p>
//           <p className="text-muted text-sm mt-1">Post an opportunity to start receiving applications.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {applications.map((app, i) => (
//             <div key={app._id} className="bg-card rounded-2xl border border-border shadow-card p-6 hover:border-primary transition-all">
//               <div className="flex flex-col sm:flex-row sm:items-start gap-5">

//                 {/* Creator Info */}
//                 <div className="flex items-start gap-3 flex-shrink-0">
//                   <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-lg`}>
//                     {app.creatorId?.fullName?.[0] || 'C'}
//                   </div>
//                   <div>
//                     <p className="font-bold text-secondary text-sm">{app.creatorId?.fullName}</p>
//                     <p className="text-xs text-muted">{app.creatorId?.email}</p>
//                     {app.creatorId?.socialPlatform && (
//                       <p className="text-xs text-primary mt-0.5">{app.creatorId.socialPlatform}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Application Details */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-3 flex-wrap mb-2">
//                     <h3 className="font-bold text-secondary text-sm">
//                       {app.opportunityId?.title}
//                     </h3>
//                     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>
//                       {statusLabels[app.status]}
//                     </span>
//                   </div>

//                   <div className="flex flex-wrap gap-4 text-xs text-muted mb-3">
//                     <span>💰 Offer: <span className="font-bold text-primary">PKR {app.counterAmount?.toLocaleString()}</span></span>
//                     <span>📱 {app.opportunityId?.platform}</span>
//                     <span>🕐 {new Date(app.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}</span>
//                   </div>

//                   {/* Creator Note */}
//                   {app.note && (
//                     <p className="text-xs text-muted bg-surface rounded-lg px-3 py-2 mb-3">
//                       "{app.note}"
//                     </p>
//                   )}

//                   {/* Creator Counter */}
//                   {app.status === 'countered' && app.lastCounterBy === 'creator' && (
//                     <div className="bg-purple-50 border border-primary/20 rounded-xl px-4 py-3 mb-3">
//                       <p className="text-xs font-bold text-primary mb-1">Creator sent a counter offer!</p>
//                       <p className="text-sm font-bold text-secondary">
//                         PKR {app.lastCounterAmount?.toLocaleString()}
//                       </p>
//                       {app.lastCounterNote && (
//                         <p className="text-xs text-muted mt-1">"{app.lastCounterNote}"</p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Action Buttons */}
//                 {(app.status === 'pending' || (app.status === 'countered' && app.lastCounterBy === 'creator')) && (
//                   <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
//                     <button
//                       onClick={() => handleRespond(app._id, 'accept')}
//                       className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition-colors"
//                     >
//                       ✓ Accept
//                     </button>
//                     <button
//                       onClick={() => setCounterModal(app)}
//                       className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl transition-colors"
//                     >
//                       Counter
//                     </button>
//                     <button
//                       onClick={() => handleRespond(app._id, 'reject')}
//                       className="px-4 py-2 border border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition-colors"
//                     >
//                       ✕ Reject
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </DashboardLayout>
//   )
// }

import { useState, useEffect } from "react";
// import DashboardLayout from "../shared/DashboardLayout";
// import { brandLinks } from "./BrandDashboard";
import axios from "../../../utils/axios";
import { Icon } from "@iconify/react";

const statusColors = {
  pending: "bg-yellow-50 text-yellow-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-600",
  countered: "bg-blue-50 text-blue-700",
  withdrawn: "bg-gray-100 text-gray-500",
};

const statusLabels = {
  pending: "⏳ Pending",
  accepted: "✅ Accepted",
  rejected: "❌ Rejected",
  countered: "🔄 Counter Offer",
  withdrawn: "↩️ Withdrawn",
};
const statusFilters = [
  "All",
  "Pending",
  "Accepted",
  "Counter Offer",
  "Rejected",
  "Withdrawn",
];
const avatarColors = [
  "from-purple-400 to-purple-700",
  "from-blue-400 to-blue-700",
  "from-green-400 to-green-700",
  "from-pink-400 to-pink-700",
  "from-orange-400 to-orange-600",
];

export default function ApplicationsReceived() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [counterModal, setCounterModal] = useState(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [expanded, setExpanded] = useState(null); // ← expanded application
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("/applications/brand");
      setApplications(res.data);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleRespond = async (id, action) => {
    try {
      if (action === "accept") {
        await axios.put(`/applications/${id}/respond`, { action });
        await axios.post("/collaborations", { applicationId: id });
        setApplications((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: "accepted" } : a)),
        );
        showToast("✅ Application accepted! Please complete payment.");
      } else {
        await axios.put(`/applications/${id}/respond`, { action });
        setApplications((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: "rejected" } : a)),
        );
        showToast("❌ Application rejected");
      }
      setExpanded(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed");
    }
  };

  const handleCounter = async () => {
    if (!counterAmount) return;
    try {
      await axios.put(`/applications/${counterModal._id}/respond`, {
        action: "counter",
        counterAmount: Number(counterAmount),
        note: counterNote,
      });
      setApplications((prev) =>
        prev.map((a) =>
          a._id === counterModal._id ? { ...a, status: "countered" } : a,
        ),
      );
      showToast("Counter offer sent to creator!");
      setCounterModal(null);
      setCounterAmount("");
      setCounterNote("");
      setExpanded(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed");
    }
  };

  const canRespond = (app) =>
    app.status === "pending" ||
    (app.status === "countered" && app.lastCounterBy === "creator");

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.creatorId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      app.opportunityId?.title?.toLowerCase().includes(search.toLowerCase());

    const statusMap = {
      Pending: "pending",
      Accepted: "accepted",
      "Counter Offer": "countered",
      Rejected: "rejected",
      Withdrawn: "withdrawn",
    };

    const matchesStatus = status === "All" || app.status === statusMap[status];

    return matchesSearch && matchesStatus;
  });
  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* ✅ Expanded Application Modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 py-8"
          onClick={() => setExpanded(null)}
        >
          <div
            className="
bg-white
w-full
max-w-2xl

max-h-[92vh]

overflow-y-auto
overflow-x-hidden

rounded-[28px]

shadow-2xl
mx-2
sm:mx-4
"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark p-6 rounded-t-2xl">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-xl flex-shrink-0`}
                  >
                    {expanded.creatorId?.fullName?.[0] || "C"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-black text-white break-words">
                      {expanded.creatorId?.fullName}
                    </h2>
                    <p className="text-purple-200 text-sm break-all">
                      {expanded.creatorId?.email}
                    </p>
                    {expanded.creatorId?.socialPlatform && (
                      <p className="text-purple-300 text-xs mt-0.5 break-words">
                        {expanded.creatorId.socialPlatform}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className="
flex
items-center
justify-between
sm:justify-end
gap-2
w-full
sm:w-auto
flex-shrink-0
"
                >
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white`}
                  >
                    {statusLabels[expanded.status]}
                  </span>
                  <button
                    onClick={() => setExpanded(null)}
                    className="w-8 h-8 rounded-lg bg-white/20 text-white hover:bg-white/30 flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Opportunity Info */}
              <div className="bg-primary-light rounded-xl p-4">
                <p className="text-xs text-muted mb-1">Opportunity</p>
                <p className="font-bold text-secondary">
                  {expanded.opportunityId?.title}
                </p>
                <p className="text-xs text-muted mt-1">
                  {expanded.opportunityId?.platform} ·{" "}
                  {expanded.opportunityId?.category}
                </p>
              </div>

              {/* Offer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-surface rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Original Budget</p>
                  <p className="text-lg font-black text-secondary">
                    PKR {expanded.opportunityId?.budget?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Creator's Offer</p>
                  <p className="text-lg font-black text-primary">
                    PKR {expanded.counterAmount?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Creator's Note / Proposal */}
              {expanded.note && (
                <div>
                  <h3 className="text-sm font-bold text-secondary mb-2">
                    📝 Creator's Proposal
                  </h3>
                  <div className="bg-surface rounded-xl p-4 border-l-4 border-primary">
                    <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
                      {expanded.note}
                    </p>
                  </div>
                </div>
              )}

              {/* Counter Offer History */}
              {expanded.status === "countered" && (
                <div>
                  <h3 className="text-sm font-bold text-secondary mb-2">
                    🔄 Counter Offer
                  </h3>
                  <div
                    className={`rounded-xl p-4 ${
                      expanded.lastCounterBy === "creator"
                        ? "bg-purple-50 border border-primary/20"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p
                        className={`text-xs font-bold ${
                          expanded.lastCounterBy === "creator"
                            ? "text-primary"
                            : "text-blue-700"
                        }`}
                      >
                        {expanded.lastCounterBy === "creator"
                          ? "👤 Creator sent counter offer"
                          : "🏢 You sent counter offer"}
                      </p>
                      <p className="text-lg font-black text-secondary">
                        PKR {expanded.lastCounterAmount?.toLocaleString()}
                      </p>
                    </div>
                    {expanded.lastCounterNote && (
                      <div className="bg-white/70 rounded-lg p-3 mt-2">
                        <p className="text-xs text-muted mb-1">Note:</p>
                        <p className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">
                          {expanded.lastCounterNote}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {expanded.creatorId?.socialProfileUrl && (
                <div className="bg-surface rounded-xl p-4">
                  <p className="text-xs text-muted mb-1">Social Profile</p>

                  <a
                    href={expanded.creatorId.socialProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary font-semibold hover:underline break-all"
                  >
                    {expanded.creatorId.socialProfileUrl}
                  </a>
                </div>
              )}

              {/* Applied Date */}
              <p className="text-xs text-muted">
                Applied on:{" "}
                {new Date(expanded.createdAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {/* Action Buttons */}
              {canRespond(expanded) && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => handleRespond(expanded._id, "accept")}
                    className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors text-sm"
                  >
                    ✅ Accept & Start Collaboration
                  </button>
                  <button
                    onClick={() => {
                      setCounterModal(expanded);
                      setExpanded(null);
                    }}
                    className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors text-sm"
                  >
                    🔄 Counter Offer
                  </button>
                  <button
                    onClick={() => handleRespond(expanded._id, "reject")}
                    className="flex-1 py-3 border-2 border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors text-sm"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Counter Modal */}
      {counterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-purple">
            <h3 className="font-bold text-secondary text-lg mb-1">
              Send Counter Offer
            </h3>
            <p className="text-sm text-muted mb-1">
              To:{" "}
              <span className="font-semibold text-secondary">
                {counterModal.creatorId?.fullName}
              </span>
            </p>
            <p className="text-sm text-muted mb-5">
              Creator offered:{" "}
              <span className="font-bold text-primary">
                PKR {counterModal.counterAmount?.toLocaleString()}
              </span>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-secondary mb-1.5">
                Your Counter Amount (PKR)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-secondary mb-1.5">
                Note (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Explain your counter offer..."
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCounterModal(null)}
                className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCounter}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                Send Counter
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        {/* Left */}

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
            <Icon
              icon="solar:users-group-rounded-bold"
              className="text-[28px] text-white"
            />
          </div>

          <div>
            <h1 className="md:text-3xl text-2xl font-black text-secondary">
              Applications Received
            </h1>

            <p className="text-sm text-muted mt-1">
              Review creator applications, negotiate offers and start
              collaborations.
            </p>
          </div>
        </div>

        {/* Right */}

        <div className="hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary-light border border-primary/10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Icon
              icon="solar:clipboard-check-bold"
              className="text-xl text-white"
            />
          </div>

          <div>
            <p className="text-xs text-muted">Total Applications</p>

            <p className="font-black text-secondary text-lg">
              {applications.length}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
        {[
          {
            label: "Pending",
            value: applications.filter((a) => a.status === "pending").length,
            icon: "solar:clock-circle-bold",
            bg: "bg-amber-100",
            color: "text-amber-600",
          },
          {
            label: "Accepted",
            value: applications.filter((a) => a.status === "accepted").length,
            icon: "solar:check-circle-bold",
            bg: "bg-green-100",
            color: "text-green-600",
          },
          {
            label: "Counter Offers",
            value: applications.filter((a) => a.status === "countered").length,
            icon: "solar:refresh-circle-bold",
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            label: "Rejected",
            value: applications.filter((a) => a.status === "rejected").length,
            icon: "solar:close-circle-bold",
            bg: "bg-red-100",
            color: "text-red-600",
          },
          {
            label: "Withdrawn",
            value: applications.filter((a) => a.status === "withdrawn").length,
            icon: "solar:logout-2-bold",
            bg: "bg-gray-100",
            color: "text-gray-600",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="
        group
        bg-purple-100
        rounded-[28px]
        border
        border-border
        p-5

        shadow-card

        hover:border-primary/20
        hover:shadow-lg
        hover:shadow-primary/10
        hover:-translate-y-1

        transition-all
        duration-300
      "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                  {item.label}
                </p>

                <h2 className="text-3xl font-black text-secondary mt-3">
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center`}
              >
                <Icon
                  icon={item.icon}
                  className={`text-[28px] ${item.color}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col xl:flex-row gap-4 mb-8 items-start xl:items-center">
        {/* Search */}

        <div className="relative w-full xl:flex-1">
          <Icon
            icon="mynaui:search"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary text-lg"
          />

          <input
            type="text"
            placeholder="Search creator or opportunity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
w-full
pl-11
pr-4
py-3

bg-white

border
border-gray-200

rounded-[22px]

shadow-sm

focus:outline-none
focus:border-primary
focus:ring-4
focus:ring-primary/10

hover:border-primary

transition-all
"
          />
        </div>

        {/* Status Filters */}

        <div
          className="
    flex
    flex-wrap
    lg:flex-nowrap

    gap-3

    w-full

    lg:w-auto

    items-center
  "
        >
          {statusFilters.map((item) => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={`
        flex-1
        sm:flex-none

        min-w-[110px]
        h-11

        px-5

        rounded-2xl

        text-xs
        font-bold

        whitespace-nowrap

        transition-all

        ${
          status === item
            ? "bg-primary text-white shadow-lg shadow-primary/20"
            : "bg-white border border-gray-200 text-secondary hover:border-primary hover:bg-primary-light"
        }
      `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="
          bg-card
          rounded-[30px]
          border
          border-border
          overflow-hidden
          shadow-card
          animate-pulse
        "
            >
              {/* Header */}

              <div className="bg-purple-100 h-16" />

              {/* Body */}

              <div className="p-5">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-4" />

                <div className="h-4 bg-gray-100 rounded w-full mb-2" />

                <div className="h-4 bg-gray-100 rounded w-3/4 mb-5" />

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="h-16 rounded-2xl bg-gray-100" />

                  <div className="h-16 rounded-2xl bg-gray-100" />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 h-11 rounded-2xl bg-gray-200" />

                  <div className="flex-1 h-11 rounded-2xl bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="py-20 px-6">
          <div className="max-w-lg mx-auto text-center">
            {/* Icon */}

            <div className="w-24 h-24 mx-auto rounded-[28px] bg-gradient-to-br from-purple-100 via-purple-50 to-white flex items-center justify-center shadow-lg shadow-purple-100">
              <Icon
                icon="solar:users-group-rounded-bold"
                className="text-[48px] text-primary"
              />
            </div>

            {/* Heading */}

            <h2 className="mt-6 text-2xl font-black text-secondary">
              {applications.length === 0
                ? "No Applications Yet"
                : "No Matching Applications"}
            </h2>

            {/* Description */}

            <p className="mt-3 text-sm text-muted leading-7">
              {applications.length === 0
                ? "Creator applications will appear here after someone applies to one of your published opportunities."
                : "There are no applications matching your selected filter."}
            </p>

            {/* Features */}

            <div className="mt-8 space-y-3 text-left max-w-sm mx-auto">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <Icon
                    icon="solar:verified-check-bold"
                    className="text-green-600 text-lg"
                  />
                </div>

                <span className="text-sm font-medium text-secondary">
                  Receive verified creator applications
                </span>
              </div>

              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon
                    icon="solar:handshake-bold"
                    className="text-blue-600 text-lg"
                  />
                </div>

                <span className="text-sm font-medium text-secondary">
                  Review and negotiate offers
                </span>
              </div>

              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Icon
                    icon="solar:chart-square-bold"
                    className="text-primary text-lg"
                  />
                </div>

                <span className="text-sm font-medium text-secondary">
                  Start collaborations instantly
                </span>
              </div>
            </div>

            {/* CTA */}

            {applications.length === 0 && (
              <Link
                to="/brand/post-opportunity"
                className="
        mt-10
        inline-flex
        items-center
        gap-2

        px-6
        h-12

        rounded-2xl

        bg-primary

        text-white
        text-sm
        font-bold

        shadow-lg
        shadow-primary/20

        hover:bg-primary-dark
        hover:-translate-y-0.5

        transition-all
      "
              >
                <Icon icon="solar:add-circle-bold" className="text-xl" />
                Post Opportunity
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredApplications.map((app, i) => (
            <div
              key={app._id}
              onClick={() => setExpanded(app)}
              className="group bg-card rounded-[30px] border border-border shadow-card overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Header */}
              <div className="bg-purple-100 border-purple-100 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                        avatarColors[i % avatarColors.length]
                      } flex items-center justify-center text-white text-xl font-black shadow-lg`}
                    >
                      {app.creatorId?.fullName?.[0] || "C"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-secondary text-base truncate">
                          {app.creatorId?.fullName}
                        </h3>

                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusColors[app.status]}`}
                        >
                          <Icon
                            icon={
                              app.status === "pending"
                                ? "solar:clock-circle-bold"
                                : app.status === "accepted"
                                  ? "solar:check-circle-bold"
                                  : app.status === "countered"
                                    ? "solar:refresh-circle-bold"
                                    : app.status === "withdrawn"
                                      ? "solar:logout-2-bold"
                                      : "solar:close-circle-bold"
                            }
                            className="text-sm"
                          />
                          {statusLabels[app.status]}
                        </span>
                      </div>

                      <p className="text-xs text-muted mt-2 truncate">
                        {app.opportunityId?.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="solar:wallet-money-bold"
                        className="text-primary text-lg"
                      />
                      <span className="text-xs text-muted font-semibold">
                        Offer
                      </span>
                    </div>

                    <p className="font-black text-secondary">
                      PKR {app.counterAmount?.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="solar:calendar-bold"
                        className="text-blue-600 text-lg"
                      />
                      <span className="text-xs text-muted font-semibold">
                        Applied
                      </span>
                    </div>

                    <p className="font-black text-secondary text-sm">
                      {new Date(app.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-bold">
                    <Icon icon="solar:smartphone-bold" />
                    {app.opportunityId?.platform}
                  </span>

                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold">
                    <Icon icon="solar:widget-5-bold" />
                    {app.opportunityId?.category}
                  </span>
                </div>

                {app.note && (
                  <div className="mt-4 rounded-2xl bg-surface border border-border p-3">
                    <p className="text-xs font-semibold text-muted mb-1">
                      Creator Note
                    </p>

                    <p className="text-sm text-secondary line-clamp-2">
                      {app.note}
                    </p>
                  </div>
                )}

                {app.status === "countered" &&
                  app.lastCounterBy === "creator" && (
                    <div className="mt-4 rounded-2xl border border-primary/20 bg-purple-50 p-3">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:refresh-circle-bold"
                          className="text-primary"
                        />
                        <span className="text-xs font-bold text-primary">
                          Creator Counter Offer
                        </span>
                      </div>

                      <p className="font-black text-secondary mt-2">
                        PKR {app.lastCounterAmount?.toLocaleString()}
                      </p>
                    </div>
                  )}

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Icon icon="solar:eye-bold" className="text-primary" />
                    Click to view
                  </div>

                  <Icon
                    icon="solar:alt-arrow-right-bold"
                    className="text-lg text-primary group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
