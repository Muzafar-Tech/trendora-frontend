// import { useState, useEffect } from 'react'
// import DashboardLayout from '../shared/DashboardLayout'
// import { brandLinks } from './BrandDashboard'
// import axios from '../../../utils/axios'
// import { Link } from 'react-router-dom'

// export default function MyOpportunities() {
//   const [opportunities, setOpportunities] = useState([])
//   const [loading, setLoading]             = useState(true)

//   useEffect(() => {
//     fetchMyOpportunities()
//   }, [])

//  const fetchMyOpportunities = async () => {
//   try {
//     const res = await axios.get('/opportunities/my/list')
//     setOpportunities(res.data)
//   } catch {
//     setOpportunities([])
//   } finally {
//     setLoading(false)
//   }
// }

//   const statusColors = {
//     active:    'bg-green-50 text-green-700',
//     closed:    'bg-gray-100 text-gray-600',
//     completed: 'bg-blue-50 text-blue-700',
//   }

//   return (
//     <DashboardLayout links={brandLinks}>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-black text-secondary">My Opportunities</h1>
//           <p className="text-muted text-sm mt-1">All campaigns you have posted.</p>
//         </div>
//         <Link
//           to="/brand/post-opportunity"
//           className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors"
//         >
//           + Post New
//         </Link>
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
//       ) : opportunities.length === 0 ? (
//         <div className="bg-card rounded-2xl border border-border shadow-card p-6 text-center py-16">
//           <div className="text-5xl mb-3">📢</div>
//           <p className="font-medium text-secondary">No opportunities posted yet</p>
//           <p className="text-muted text-sm mt-1">Post your first campaign to get started.</p>
//           <Link
//             to="/brand/post-opportunity"
//             className="inline-block mt-4 px-5 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors"
//           >
//             Post Opportunity
//           </Link>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {opportunities.map(op => (
//             <div key={op._id} className="bg-card rounded-2xl border border-border shadow-card p-6 hover:border-primary transition-all">
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-3 mb-2 flex-wrap">
//                     <h3 className="font-bold text-secondary">{op.title}</h3>
//                     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[op.status]}`}>
//                       {op.status}
//                     </span>
//                   </div>
//                   <p className="text-sm text-muted line-clamp-1 mb-3">{op.description}</p>
//                   <div className="flex flex-wrap gap-4 text-xs text-muted">
//                     <span>💰 PKR {op.budget?.toLocaleString()}</span>
//                     <span>📱 {op.platform}</span>
//                     <span>⏰ {op.deadline} days</span>
//                     <span>📁 {op.category}</span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-shrink-0">
//                   <button className="px-3 py-1.5 text-xs font-semibold border border-border text-muted rounded-lg hover:border-primary hover:text-primary transition-colors">
//                     Edit
//                   </button>
//                   <button className="px-3 py-1.5 text-xs font-semibold border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
//                     Close
//                   </button>
//                 </div>
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
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const platforms = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "Twitter",
  "Snapchat",
];
const categories = [
  "AI Marketing",
  "Fashion",
  "Food",
  "Tech",
  "Lifestyle",
  "Gaming",
  "Fitness",
  "Travel",
  "Beauty",
  "Education",
];

export default function MyOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [closeModal, setCloseModal] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  useEffect(() => {
    fetchMyOpportunities();
  }, []);

  const fetchMyOpportunities = async () => {
    try {
      const res = await axios.get("/opportunities/my/list");
      setOpportunities(res.data);
    } catch {
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleEdit = (op) => {
    setEditForm({
      title: op.title,
      description: op.description,
      category: op.category,
      platform: op.platform,
      budget: op.budget,
      deadline: op.deadline,
    });
    setEditModal(op);
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`/opportunities/${editModal._id}`, {
        ...editForm,
        budget: Number(editForm.budget),
        deadline: Number(editForm.deadline),
      });
      setOpportunities((prev) =>
        prev.map((op) => (op._id === editModal._id ? res.data : op)),
      );
      showToast("✅ Opportunity updated!");
      setEditModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = async (id) => {
    try {
      await axios.put(`/opportunities/${id}/close`);
      setOpportunities((prev) =>
        prev.map((op) => (op._id === id ? { ...op, status: "closed" } : op)),
      );
      showToast("✅ Opportunity closed");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to close");
    }
  };
  const statusFilters = ["All", "Active", "Closed", "Completed"];
  const statusMap = {
    Active: "active",
    Closed: "closed",
    Completed: "completed",
  };

  const filteredOpportunities = opportunities.filter((op) => {
    const matchesSearch =
      op.title?.toLowerCase().includes(search.toLowerCase()) ||
      op.description?.toLowerCase().includes(search.toLowerCase()) ||
      op.category?.toLowerCase().includes(search.toLowerCase()) ||
      op.platform?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === "All" || op.status === statusMap[status];

    return matchesSearch && matchesStatus;
  });
  const statusColors = {
    active: "bg-green-50 text-green-700",
    closed: "bg-gray-100 text-gray-600",
    completed: "bg-blue-50 text-blue-700",
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-purple overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-dark p-5">
              <h3 className="font-black text-white text-lg">
                Edit Opportunity
              </h3>
              <p className="text-purple-200 text-sm mt-1 truncate">
                {editModal.title}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Platform
                  </label>
                  <select
                    value={editForm.platform}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, platform: e.target.value }))
                    }
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary bg-white"
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Budget (PKR)
                  </label>
                  <input
                    type="number"
                    value={editForm.budget}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, budget: e.target.value }))
                    }
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-1.5">
                    Deadline (Days)
                  </label>
                  <input
                    type="number"
                    value={editForm.deadline}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, deadline: e.target.value }))
                    }
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditModal(null)}
                  className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : "✅ Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Close Opportunity Modal */}
      {closeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCloseModal(null)}
        >
          <div
            className="bg-white rounded-[30px] overflow-hidden w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-primary px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Icon
                      icon="solar:danger-triangle-bold"
                      className="text-[26px] text-white"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-white">
                      Close Opportunity
                    </h2>
                    <p className="text-sm text-purple-100 mt-0.5">
                      Confirm before closing this campaign.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCloseModal(null)}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
                >
                  <Icon
                    icon="solar:close-circle-bold"
                    className="text-2xl text-white"
                  />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5">
                <p className="text-sm text-orange-700 leading-6">
                  Closing this opportunity will stop accepting new creator
                  applications. Existing applications and collaborations will
                  remain accessible.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-green-50 border border-green-100">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Icon
                      icon="solar:check-circle-bold"
                      className="text-green-600 text-lg"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-secondary text-sm">
                      Existing Applications
                    </p>
                    <p className="text-xs text-muted mt-1">
                      All submitted applications will remain available.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-red-50 border border-red-100">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Icon
                      icon="solar:lock-bold"
                      className="text-red-600 text-lg"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-secondary text-sm">
                      New Applications
                    </p>
                    <p className="text-xs text-muted mt-1">
                      New creators won't be able to apply after closing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setCloseModal(null)}
                  className="
              flex-1
              h-12
              rounded-2xl
              border
              border-border
              bg-white
              text-secondary
              font-bold
              hover:bg-surface
              transition-all
            "
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleClose(closeModal._id)}
                  className="
              flex-1
              h-12
              rounded-2xl
              bg-primary
              text-white
              font-bold
              hover:bg-primary-dark
              shadow-lg
              shadow-primary/20
              transition-all
            "
                >
                  Close Opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        {/* Left */}

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <Icon
              icon="solar:clipboard-list-bold"
              className="text-[28px] text-white"
            />
          </div>

          <div>
            <h1 className="text-3xl font-black text-secondary">
              My Opportunities
            </h1>

            <p className="text-sm text-muted mt-1">
              Manage, edit and monitor all your published campaigns.
            </p>
          </div>
        </div>

        {/* Right */}

        <Link
          to="/brand/post-opportunity"
          className="
      inline-flex
      items-center
      justify-center
      gap-2

      h-12
      px-6

      rounded-2xl

      bg-gradient-to-r
      from-purple-600
      to-violet-600

      text-white
      text-sm
      font-bold

      shadow-lg
      shadow-purple-200

      transition-all
      duration-300

      hover:-translate-y-0.5
      hover:shadow-xl
      hover:shadow-purple-300
    "
        >
          <Icon icon="solar:add-circle-bold" className="text-xl" />
          Post Opportunity
        </Link>
      </div>
      {/* Search + Filters */}

      <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-8">
        {/* Search */}

        <div className="relative w-full xl:flex-1">
          <Icon
            icon="mynaui:search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg"
          />

          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
        w-full
        h-12
        pl-12
        pr-4

        rounded-2xl

        border
        border-border

        bg-white

        text-sm

        focus:outline-none
        focus:border-primary
        focus:ring-4
        focus:ring-primary/10

        transition-all
      "
          />
        </div>

        {/* Filters */}

        <div
          className="
    flex
    flex-wrap
    xl:flex-nowrap

    items-center

    gap-3

    xl:justify-end

    w-full
    xl:w-auto
  "
        >
          {statusFilters.map((item) => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={`
          flex-1
          sm:flex-none

          min-w-[120px]

          h-11

          rounded-2xl

          text-xs
          font-bold

          transition-all

          ${
            status === item
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-white border border-border text-secondary hover:border-primary hover:bg-primary-light"
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
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="
          bg-white
          rounded-[28px]
          border
          border-purple-100
          overflow-hidden
          animate-pulse
        "
            >
              {/* Header */}

              <div className="h-16 bg-purple-100" />

              {/* Body */}

              <div className="p-5 space-y-4">
                <div className="h-5 w-3/4 rounded bg-gray-200" />

                <div className="h-4 w-full rounded bg-gray-100" />

                <div className="h-4 w-2/3 rounded bg-gray-100" />

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="h-16 rounded-2xl bg-gray-100" />

                  <div className="h-16 rounded-2xl bg-gray-100" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="h-11 rounded-2xl bg-gray-200" />

                  <div className="h-11 rounded-2xl bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="py-20 px-6">
          <div className="max-w-md mx-auto text-center">
            {/* Icon */}

            <div className="w-24 h-24 mx-auto rounded-[28px] bg-gradient-to-br from-purple-100 via-purple-50 to-white flex items-center justify-center shadow-lg shadow-purple-100">
              <Icon
                icon="solar:clipboard-remove-bold"
                className="text-[46px] text-primary"
              />
            </div>

            {/* Title */}

            <h2 className="mt-6 text-2xl font-black text-secondary">
              No Opportunities Yet
            </h2>

            {/* Description */}

            <p className="mt-3 text-sm leading-7 text-muted">
              You haven't published any campaigns yet. Create your first
              opportunity and start receiving applications from verified
              creators.
            </p>

            {/* Features */}

            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <Icon
                    icon="solar:verified-check-bold"
                    className="text-green-600 text-lg"
                  />
                </div>

                <span className="text-sm font-medium text-secondary">
                  Reach verified creators
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon
                    icon="solar:users-group-rounded-bold"
                    className="text-blue-600 text-lg"
                  />
                </div>

                <span className="text-sm font-medium text-secondary">
                  Receive quality applications
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Icon
                    icon="solar:chart-square-bold"
                    className="text-primary text-lg"
                  />
                </div>

                <span className="text-sm font-medium text-secondary">
                  Manage campaigns efficiently
                </span>
              </div>
            </div>

            {/* Button */}

            <Link
              to="/brand/post-opportunity"
              className="
          mt-10
          inline-flex
          items-center
          gap-2

          h-12
          px-6

          rounded-2xl

          bg-gradient-to-r
          from-primary
          to-primary-dark

          text-white
          font-bold
          text-sm

          shadow-lg
          shadow-purple-200

          hover:-translate-y-0.5
          hover:shadow-xl
          hover:shadow-purple-300

          transition-all
          duration-300
        "
            >
              <Icon icon="solar:add-circle-bold" className="text-xl" />
              Post Your First Opportunity
            </Link>
          </div>
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="col-span-full py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto rounded-[28px] bg-gradient-to-br from-purple-100 via-purple-50 to-white flex items-center justify-center shadow-lg shadow-purple-100">
              <Icon
                icon="solar:clipboard-remove-bold"
                className="text-[46px] text-primary"
              />
            </div>

            <h2 className="mt-6 text-2xl font-black text-secondary">
              No Matching Opportunities
            </h2>

            <p className="mt-3 text-sm text-muted leading-7">
              There are no opportunities matching your current search or filter.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredOpportunities.map((o) => (
            <div
              key={o._id}
              className="
      group
      bg-white
      rounded-[30px]
      border
      border-purple-100
      shadow-sm

      hover:border-primary/20
      hover:shadow-xl
      hover:shadow-purple-100
      hover:-translate-y-1

      transition-all
      duration-300

      overflow-hidden
"
            >
              <div className="bg-purple-100 border-b border-purple-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Left */}

                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-purple-200 flex-shrink-0">
                      <Icon
                        icon="solar:clipboard-text-bold"
                        className="text-2xl text-white"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-secondary line-clamp-2">
                          {o.title}
                        </h3>

                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusColors[o.status]}`}
                        >
                          <Icon
                            icon={
                              o.status === "active"
                                ? "solar:check-circle-bold"
                                : o.status === "closed"
                                  ? "solar:lock-bold"
                                  : "solar:clipboard-check-bold"
                            }
                            className="text-sm"
                          />

                          {o.status}
                        </span>
                      </div>

                      <p className="text-xs text-muted mt-2">
                        Posted on{" "}
                        {new Date(o.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm text-muted leading-7 line-clamp-3">
                  {o.description}
                </p>

                {/* Budget + Deadline */}

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="solar:wallet-money-bold"
                        className="text-lg text-primary"
                      />

                      <span className="text-xs font-semibold text-muted">
                        Budget
                      </span>
                    </div>

                    <p className="text-base font-black text-secondary">
                      PKR {o.budget?.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="solar:calendar-bold"
                        className="text-lg text-blue-600"
                      />

                      <span className="text-xs font-semibold text-muted">
                        Deadline
                      </span>
                    </div>

                    <p className="text-base font-black text-secondary">
                      {o.deadline} Days
                    </p>
                  </div>
                </div>

                {/* Badges */}

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-bold">
                    <Icon icon="solar:widget-5-bold" />

                    {o.category}
                  </span>

                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold">
                    <Icon icon="solar:smartphone-bold" />

                    {o.platform}
                  </span>
                </div>

                {/* Actions */}

                <div className="flex gap-3 mt-6">
                  {o.status === "active" && (
                    <>
                      <button
                        onClick={() => handleEdit(o)}
                        className="flex-1 h-11 rounded-xl border border-purple-200 text-primary font-bold text-sm hover:bg-purple-50 transition-all inline-flex items-center justify-center gap-2"
                      >
                        <Icon icon="solar:pen-bold" className="text-lg" />
                        Edit
                      </button>

                      <button
                        onClick={() => setCloseModal(o)}
                        className="flex-1 h-11 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-all inline-flex items-center justify-center gap-2"
                      >
                        <Icon icon="solar:lock-bold" className="text-lg" />
                        Close
                      </button>
                    </>
                  )}

                  {o.status === "closed" && (
                    <div className="w-full h-11 rounded-xl bg-gray-100 text-gray-500 font-semibold flex items-center justify-center gap-2">
                      <Icon icon="solar:lock-bold" />
                      Opportunity Closed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
