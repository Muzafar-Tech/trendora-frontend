import { useState, useEffect } from "react";
// import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from "./AdminDashboard";
import axios from "../../../utils/axios";
import { Icon } from "@iconify/react";

const statusColors = {
  payment_pending: "bg-gray-100 text-gray-600",
  active: "bg-blue-50 text-blue-700",
  submitted: "bg-yellow-50 text-yellow-700",
  completed: "bg-green-50 text-green-700",
  revision: "bg-orange-50 text-orange-700",
  cancelled: "bg-red-50 text-red-600",
  disputed: "bg-red-50 text-red-600",
};

export default function ManageCollaborations() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState("");
  const [cancelModal, setCancelModal] = useState(null);
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get("/admin/collaborations");
      setCollaborations(res.data);
    } catch {
      setCollaborations([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collaboration and all its chat messages?"))
      return;
    try {
      await axios.delete(`/admin/collaborations/${id}`);
      setCollaborations((prev) => prev.filter((c) => c._id !== id));
      showToast("✅ Collaboration deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm("Force complete this collaboration?")) return;
    try {
      await axios.put(`/admin/collaborations/${id}/complete`);
      setCollaborations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "completed" } : c)),
      );
      showToast("✅ Collaboration completed");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this collaboration? Payment will be refunded."))
      return;
    try {
      await axios.put(`/admin/collaborations/${id}/cancel`);
      setCollaborations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "cancelled" } : c)),
      );
      showToast("✅ Collaboration cancelled");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed");
    }
  };

  const filtered = collaborations.filter((c) => {
    const matchSearch =
      c.opportunityId?.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.brandId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.brandId?.brandName?.toLowerCase().includes(search.toLowerCase()) ||
      c.creatorId?.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-purple-200">
          <Icon
            icon="solar:users-group-rounded-bold"
            className="text-white text-3xl"
          />
        </div>

        <div>
          <h1 className="text-4xl font-black text-secondary">
            All Collaborations
          </h1>

          <p className="text-muted text-lg mt-1">
            Monitor, review, and manage every collaboration across the platform.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Collaborations",
            value: collaborations.length,
            icon: "solar:clipboard-list-bold",
            iconBg: "bg-purple-50",
            iconColor: "text-primary",
            valueColor: "text-secondary",
          },
          {
            label: "Active",
            value: collaborations.filter((c) => c.status === "active").length,
            icon: "solar:play-circle-bold",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            valueColor: "text-blue-700",
          },
          {
            label: "Submitted",
            value: collaborations.filter((c) => c.status === "submitted")
              .length,
            icon: "solar:document-text-bold",
            iconBg: "bg-yellow-50",
            iconColor: "text-yellow-600",
            valueColor: "text-yellow-700",
          },
          {
            label: "Completed",
            value: collaborations.filter((c) => c.status === "completed")
              .length,
            icon: "solar:verified-check-bold",
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
            valueColor: "text-green-700",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="
        group
        bg-purple-100
        rounded-[30px]
        border
        border-purple-100
        p-4
        shadow-sm
        hover:shadow-xl
        hover:shadow-purple-100
        hover:-translate-y-1
        transition-all
        duration-300
      "
          >
            <div
              className={`
          w-10
          h-10
          rounded-2xl
          flex
          items-center
          justify-center
          mb-5
          transition-transform
          duration-300
          group-hover:scale-110
          ${card.iconBg}
        `}
            >
              <Icon icon={card.icon} className={`text-3xl ${card.iconColor}`} />
            </div>

            <h3
              className={`text-3xl font-black leading-none ${card.valueColor}`}
            >
              {card.value}
            </h3>

            <p className="mt-2 text-sm font-medium text-muted">{card.label}</p>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="flex-1 relative">
          <Icon
            icon="material-symbols-light:search"
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          />

          <input
            type="text"
            placeholder="Search by title, brand, or creator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
        w-full
        h-14
        pl-14
        pr-5
        rounded-2xl
        border
        border-purple-100
        bg-white
        text-sm
        font-medium
        placeholder:text-gray-400
        transition-all
        duration-300
        focus:outline-none
        focus:border-primary
        focus:ring-4
        focus:ring-purple-100
      "
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {[
            {
              value: "all",
              label: "All",
              icon: "solar:layers-bold",
            },
            {
              value: "active",
              label: "Active",
              icon: "solar:play-circle-bold",
            },
            {
              value: "submitted",
              label: "Submitted",
              icon: "solar:document-text-bold",
            },
            {
              value: "completed",
              label: "Completed",
              icon: "solar:verified-check-bold",
            },
            {
              value: "revision",
              label: "Revision",
              icon: "solar:refresh-circle-bold",
            },
            {
              value: "disputed",
              label: "Disputed",
              icon: "solar:shield-warning-bold",
            },
            {
              value: "cancelled",
              label: "Cancelled",
              icon: "solar:close-circle-bold",
            },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`
          h-12
          px-5
          rounded-2xl
          flex
          items-center
          gap-2
          text-sm
          font-bold
          transition-all
          duration-300
          capitalize

          ${
            filter === item.value
              ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-purple-200"
              : "bg-white border border-purple-100 text-secondary hover:border-primary hover:text-primary hover:shadow-md"
          }
        `}
            >
              <Icon icon={item.icon} className="text-lg" />

              {item.label}
            </button>
          ))}
        </div>
      </div>
      {/* List */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center shadow-lg shadow-purple-100 mb-6">
              <Icon
                icon="solar:users-group-rounded-bold"
                className="text-5xl text-primary"
              />
            </div>

            <h3 className="text-2xl font-black text-secondary mb-2">
              No Collaborations Found
            </h3>

            <p className="text-sm text-muted text-center max-w-sm leading-7">
              There are no collaborations matching your current search or
              filter. Try changing the filters or check back later.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="px-6 py-4 hover:bg-surface transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {/* Title + Status */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-lg font-black text-secondary leading-tight">
                        {c.opportunityId?.title || "Untitled Collaboration"}
                      </h3>

                      <span
                        className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-1.5
        rounded-full
        text-xs
        font-bold
        capitalize
        ${statusColors[c.status]}
      `}
                      >
                        <Icon
                          icon={
                            c.status === "active"
                              ? "solar:play-circle-bold"
                              : c.status === "submitted"
                                ? "solar:document-text-bold"
                                : c.status === "completed"
                                  ? "solar:verified-check-bold"
                                  : c.status === "revision"
                                    ? "solar:refresh-circle-bold"
                                    : c.status === "disputed"
                                      ? "solar:shield-warning-bold"
                                      : c.status === "cancelled"
                                        ? "solar:close-circle-bold"
                                        : "solar:clock-circle-bold"
                          }
                          className="text-sm"
                        />

                        {c.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-x-6 gap-y-3 text-sm">
                      {/* Brand */}
                      <div className="flex items-center gap-2 text-muted">
                        <Icon
                          icon="solar:buildings-bold"
                          className="text-primary text-lg flex-shrink-0"
                        />
                        <span className="truncate">
                          {c.brandId?.brandName || c.brandId?.fullName}
                        </span>
                      </div>

                      {/* Creator */}
                      <div className="flex items-center gap-2 text-muted">
                        <Icon
                          icon="solar:user-bold"
                          className="text-primary text-lg flex-shrink-0"
                        />
                        <span className="truncate">
                          {c.creatorId?.fullName}
                        </span>
                      </div>

                      {/* Budget */}
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:wallet-money-bold"
                          className="text-green-600 text-lg flex-shrink-0"
                        />

                        <span className="font-bold text-secondary">
                          PKR {c.agreedAmount?.toLocaleString()}
                        </span>
                      </div>

                      {/* Platform */}
                      <div className="flex items-center gap-2 text-muted">
                        <Icon
                          icon="solar:smartphone-bold"
                          className="text-violet-600 text-lg flex-shrink-0"
                        />

                        <span className="truncate">
                          {c.opportunityId?.platform}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-muted">
                        <Icon
                          icon="solar:calendar-bold"
                          className="text-orange-500 text-lg flex-shrink-0"
                        />

                        <span>
                          {new Date(c.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    {/* Force Complete — active/submitted/revision pe */}
                    {/* Complete */}
                    {["active", "submitted", "revision", "disputed"].includes(
                      c.status,
                    ) && (
                      <button
                        onClick={() => handleComplete(c._id)}
                        className="
      h-11
      px-5
      rounded-2xl
      bg-green-50
      border
      border-green-200
      text-green-700
      font-bold
      text-sm
      hover:bg-green-100
      hover:shadow-lg
      hover:shadow-green-100
      transition-all
      duration-300
      flex
      items-center
      gap-2
    "
                      >
                        <Icon
                          icon="solar:check-circle-bold"
                          className="text-lg"
                        />
                        Complete
                      </button>
                    )}

                    {/* Cancel — active/payment_pending pe */}

                    {["active", "payment_pending", "disputed"].includes(
                      c.status,
                    ) && (
                      <button
                        onClick={() => setCancelModal(c)}
                        className="
      h-11
      px-5
      rounded-2xl
      bg-orange-50
      border
      border-orange-200
      text-orange-600
      font-bold
      text-sm
      hover:bg-orange-100
      hover:shadow-lg
      hover:shadow-orange-100
      transition-all
      duration-300
      flex
      items-center
      gap-2
    "
                      >
                        <Icon
                          icon="solar:close-circle-bold"
                          className="text-lg"
                        />
                        Cancel
                      </button>
                    )}

                    {/* Delete — sirf completed pe */}
                    {/* Delete */}
                    {c.status === "completed" && (
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="
      h-11
      px-5
      rounded-2xl
      bg-red-50
      border
      border-red-200
      text-red-600
      font-bold
      text-sm
      hover:bg-red-100
      hover:shadow-lg
      hover:shadow-red-100
      transition-all
      duration-300
      flex
      items-center
      gap-2
    "
                      >
                        <Icon
                          icon="solar:trash-bin-trash-bold"
                          className="text-lg"
                        />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-[30px] overflow-hidden border border-orange-100 shadow-[0_25px_80px_rgba(249,115,22,.18)]">
            {/* Header */}

            <div className="bg-primary px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Icon
                    icon="solar:close-circle-bold"
                    className="text-white text-3xl"
                  />
                </div>

                <div>
                  <h3 className="text-white text-2xl font-black">
                    Cancel Collaboration
                  </h3>

                  <p className="text-orange-100 text-sm mt-1">
                    Please review before continuing.
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}

            <div className="p-6">
              <div className="bg-purple-50 border border-orange-200 rounded-3xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="solar:shield-warning-bold"
                    className="text-orange-500 text-lg"
                  />

                  <span className="font-bold text-secondary">
                    Are you sure?
                  </span>
                </div>

                <p className="text-sm text-muted leading-7">
                  This collaboration will be cancelled and the payment will be
                  refunded to the brand.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-5 mb-7 flex gap-3">
                <Icon
                  icon="solar:info-circle-bold"
                  className="text-yellow-500 text-xl flex-shrink-0 mt-1"
                />

                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Cancel a collaboration only when
                  required. This action may affect both the creator and the
                  brand.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCancelModal(null)}
                  className="flex-1 h-14 rounded-2xl border border-border bg-white font-bold text-secondary hover:border-orange-300 transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleCancel(cancelModal._id);
                    setCancelModal(null);
                  }}
                  className="flex-1 h-14 rounded-2xl bg-primary  text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Icon icon="solar:close-circle-bold" />
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
