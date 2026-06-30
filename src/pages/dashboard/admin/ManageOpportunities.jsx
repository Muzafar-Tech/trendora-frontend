import { Fragment, useState, useEffect, useMemo } from "react";
// import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from "./AdminDashboard";
import axios from "../../../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const ITEMS_PER_PAGE = 10;

export default function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await axios.get("/admin/opportunities");
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

  // ✅ Admin sirf brand ki REQUEST pe close kare — confirmation modal
  const handleClose = async () => {
    if (!confirmModal) return;
    try {
      await axios.put(`/admin/opportunities/${confirmModal._id}/close`);
      setOpportunities((prev) =>
        prev.map((o) =>
          o._id === confirmModal._id ? { ...o, status: "closed" } : o,
        ),
      );
      showToast("✅ Opportunity closed");
      setConfirmModal(null);
    } catch {
      showToast("Action failed.");
    }
  };

  // ✅ Dynamic platforms from data
  const platforms = useMemo(() => {
    const all = [
      ...new Set(opportunities.map((o) => o.platform).filter(Boolean)),
    ];
    return ["all", ...all];
  }, [opportunities]);

  // ✅ Filter + Sort + Search
  const filtered = useMemo(() => {
    let data = [...opportunities];

    if (search) {
      data = data.filter(
        (o) =>
          o.title?.toLowerCase().includes(search.toLowerCase()) ||
          o.brandName?.toLowerCase().includes(search.toLowerCase()) ||
          o.category?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((o) => o.status === statusFilter);
    }

    if (platformFilter !== "all") {
      data = data.filter((o) => o.platform === platformFilter);
    }

    switch (sortBy) {
      case "newest":
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "budget_hi":
        data.sort((a, b) => b.budget - a.budget);
        break;
      case "budget_lo":
        data.sort((a, b) => a.budget - b.budget);
        break;
      case "title":
        data.sort((a, b) => a.title?.localeCompare(b.title));
        break;
    }

    return data;
  }, [opportunities, search, statusFilter, platformFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const statusColors = {
    active: "bg-green-50 text-green-700 border-green-200",
    closed: "bg-gray-100 text-gray-500 border-gray-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const stats = [
    {
      label: "Total",
      value: opportunities.length,
      icon: "solar:list-bold",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Active",
      value: opportunities.filter((o) => o.status === "active").length,
      icon: "solar:check-circle-bold",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Closed",
      value: opportunities.filter((o) => o.status === "closed").length,
      icon: "zondicons:close-outline",
      color: "text-gray-500",
      bg: "bg-red-200",
    },
    {
      label: "Completed",
      value: opportunities.filter((o) => o.status === "completed").length,
      icon: "solar:medal-bold",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-semibold rounded-2xl shadow-lg flex items-center gap-2">
          <Icon icon="solar:check-circle-bold" className="text-lg" />
          {toast}
        </div>
      )}

      {/* ✅ Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl shadow-purple-200 overflow-hidden"
            >
              <div className="bg-primary p-5">
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  <Icon
                    icon="solar:danger-triangle-bold"
                    className="text-2xl"
                  />
                  Close Opportunity?
                </h3>
                <p className="text-red-100 text-sm mt-1">
                  This action cannot be undone
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                  <p className="text-sm font-bold text-gray-800 mb-1">
                    {confirmModal.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Brand: {confirmModal.brandName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Budget: PKR {confirmModal.budget?.toLocaleString()}
                  </p>
                </div>

                {/* ✅ Warning about brand's right */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
                  <Icon
                    icon="solar:info-circle-bold"
                    className="text-yellow-500 text-xl flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Only close this opportunity if the
                    brand has specifically requested it, or if it violates
                    platform policies. Closing prematurely may harm the brand.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmModal(null)}
                    className="flex-1 py-3 border-2 border-gray-200 text-gray-500 rounded-2xl text-sm font-semibold hover:border-purple-400 hover:text-purple-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-red-200 transition-all"
                  >
                    Yes, Close It
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-purple-200">
          <Icon
            icon="solar:clipboard-list-bold"
            className="text-white text-3xl"
          />
        </div>

        <div>
          <h1 className="text-4xl font-black text-secondary">
            All Opportunities
          </h1>

          <p className="text-muted text-lg mt-1">
            Monitor, review and manage every campaign across the platform.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="
      bg-purple-100
      rounded-[30px]
      p-6
      border
      border-purple-100
      shadow-sm
      hover:shadow-xl
      hover:shadow-purple-100
      hover:-translate-y-1
      transition-all
      duration-300
      relative
      overflow-hidden
    "
          >
            {/* Background Glow */}

            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {s.label}
                </p>

                <h2 className={`text-4xl font-black mt-3 ${s.color}`}>
                  {s.value}
                </h2>
              </div>

              <div
                className={`
          w-14
          h-14
          rounded-2xl
          ${s.bg}
          flex
          items-center
          justify-center
          shadow-sm
        `}
              >
                <Icon icon={s.icon} className={`text-3xl ${s.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[30px] border border-purple-100 shadow-sm p-6 mb-7">
        {/* Search */}

        <div className="relative mb-5">
          <Icon
            icon="material-symbols-light:search"
            className="absolute left-5 top-1/2 -translate-y-1/2 text-primary text-xl"
          />

          <input
            type="text"
            placeholder="Search by title, brand or category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="
w-full
h-14
rounded-2xl
border
border-purple-100
bg-white
pl-14
pr-5
text-sm
font-medium
transition-all
focus:outline-none
focus:border-primary
focus:ring-4
focus:ring-purple-100
placeholder:text-gray-400
"
          />
        </div>

        {/* Filters */}

        <div className="flex flex-wrap items-center gap-4">
          {/* Status */}

          <div className="flex items-center gap-2">
            <Icon icon="solar:filter-bold" className="text-primary text-lg" />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="
h-12
rounded-2xl
border
border-purple-100
bg-white
px-4
text-sm
font-semibold
text-secondary
focus:outline-none
focus:border-primary
focus:ring-4
focus:ring-purple-100
"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Platform */}

          <div className="flex items-center gap-2">
            <Icon
              icon="solar:smartphone-bold"
              className="text-primary text-lg"
            />

            <select
              value={platformFilter}
              onChange={(e) => {
                setPlatformFilter(e.target.value);
                setPage(1);
              }}
              className="
h-12
rounded-2xl
border
border-purple-100
bg-white
px-4
text-sm
font-semibold
text-secondary
focus:outline-none
focus:border-primary
focus:ring-4
focus:ring-purple-100
"
            >
              <option value="all">All Platforms</option>

              <option value="Instagram">Instagram</option>

              <option value="TikTok">TikTok</option>

              <option value="YouTube">YouTube</option>

              <option value="Facebook">Facebook</option>

              <option value="Twitter">Twitter</option>

              <option value="Snapchat">Snapchat</option>

              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort */}

          <div className="flex items-center gap-2">
            <Icon icon="solar:sort-bold" className="text-primary text-lg" />

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="
h-12
rounded-2xl
border
border-purple-100
bg-white
px-4
text-sm
font-semibold
text-secondary
focus:outline-none
focus:border-primary
focus:ring-4
focus:ring-purple-100
"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget_hi">Budget : High → Low</option>
              <option value="budget_lo">Budget : Low → High</option>
              <option value="title">Title A → Z</option>
            </select>
          </div>

          {/* Results */}

          <div className="ml-auto flex items-center gap-3">
            <span className="px-4 py-2 rounded-2xl bg-purple-50 border border-purple-100 text-xs font-bold text-primary">
              {filtered.length} Results
            </span>

            {(search ||
              statusFilter !== "all" ||
              platformFilter !== "all" ||
              sortBy !== "newest") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPlatformFilter("all");
                  setSortBy("newest");
                  setPage(1);
                }}
                className="
h-11
px-5
rounded-2xl
border
border-red-200
bg-red-50
text-red-500
font-bold
text-sm
flex
items-center
gap-2
hover:bg-red-100
transition-all
"
              >
                <Icon icon="solar:restart-bold" className="text-lg" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-purple-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-7 space-y-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="
        h-20
        rounded-[24px]
        border
        border-purple-100
        bg-gradient-to-r
        from-purple-50
        via-white
        to-purple-50
        animate-pulse
      "
              />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="w-24 h-24 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center shadow-sm mb-6">
              <Icon icon="mynaui:search" className="text-5xl text-primary" />
            </div>

            <h3 className="text-2xl font-black text-secondary mb-2">
              No Opportunities Found
            </h3>

            <p className="max-w-md text-center text-sm leading-7 text-muted">
              We couldn't find any opportunities matching your current search or
              selected filters. Try changing the search keywords or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-5 bg-gradient-to-r from-purple-50 via-white to-purple-50 border-b border-purple-100">
              <div className="col-span-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                <Icon
                  icon="solar:document-text-bold"
                  className="text-primary text-base"
                />
                Opportunity
              </div>

              <div className="col-span-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                <Icon
                  icon="solar:buildings-3-bold"
                  className="text-primary text-base"
                />
                Brand
              </div>

              <div className="col-span-1 flex items-center justify-end gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                <Icon
                  icon="solar:wallet-money-bold"
                  className="text-primary text-base"
                />
                Budget
              </div>

              <div className="col-span-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                <Icon
                  icon="solar:smartphone-bold"
                  className="text-primary text-base"
                />
                Platform
              </div>

              <div className="col-span-1 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                <Icon icon="uiw:date" className="text-primary text-base" />
                Deadline
              </div>

              <div className="col-span-1 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                <Icon
                  icon="solar:shield-check-bold"
                  className="text-primary text-base"
                />
                Status
              </div>

              <div className="col-span-1 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500">
                <Icon
                  icon="solar:settings-bold"
                  className="text-primary text-base"
                />
                Action
              </div>
            </div>

            <div className="divide-y divide-purple-100">
              {paginated.map((op, i) => (
                <motion.div
                  key={op._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="
        grid
        grid-cols-1
        lg:grid-cols-12
        gap-6
        px-8
        py-6
        items-center
        hover:bg-gradient-to-r
        hover:from-purple-50/60
        hover:to-white
        transition-all
        duration-300
      "
                >
                  {/* Opportunity */}

                  <div className="lg:col-span-4 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <Icon
                          icon="solar:document-text-bold"
                          className="text-primary text-xl"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-base font-black text-secondary truncate">
                          {op.title}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <Icon
                            icon="solar:tag-bold"
                            className="text-gray-400 text-sm"
                          />

                          <span className="text-sm text-muted">
                            {op.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand */}

                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="solar:buildings-3-bold"
                        className="text-primary"
                      />

                      <span className="font-semibold text-secondary truncate">
                        {op.brandName}
                      </span>
                    </div>
                  </div>

                  {/* Budget */}

                  <div className="lg:col-span-1 lg:text-right">
                    <div className="flex lg:justify-end items-center gap-2">
                      <Icon
                        icon="solar:wallet-money-bold"
                        className="text-green-500"
                      />

                      <span className="font-black text-primary">
                        {op.budget >= 1000
                          ? `${(op.budget / 1000).toFixed(0)}K`
                          : op.budget}
                      </span>
                    </div>
                  </div>

                  {/* Platform */}

                  <div className="lg:col-span-2">
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-purple-50 border border-purple-100 text-sm font-semibold text-secondary">
                      <Icon
                        icon="solar:smartphone-bold"
                        className="text-primary"
                      />

                      {op.platform}
                    </span>
                  </div>

                  {/* Deadline */}

                  <div className="lg:col-span-1">
                    <span
                      className={`inline-flex items-center gap-2 font-bold ${
                        op.deadline <= 3 ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      <Icon
                        icon="solar:calendar-bold"
                        className={
                          op.deadline <= 3 ? "text-red-500" : "text-primary"
                        }
                      />
                      {op.deadline} Days
                    </span>
                  </div>

                  {/* Status */}

                  <div className="lg:col-span-1">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border ${
                        statusColors[op.status] ||
                        "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      <Icon
                        icon={
                          op.status === "active"
                            ? "solar:check-circle-bold"
                            : op.status === "completed"
                              ? "solar:verified-check-bold"
                              : "solar:lock-bold"
                        }
                        className="text-sm"
                      />

                      {op.status.charAt(0).toUpperCase() + op.status.slice(1)}
                    </span>
                  </div>

                  {/* Action */}

                  <div className="lg:col-span-1 flex lg:justify-center">
                    {op.status === "active" ? (
                      <button
                        onClick={() => setConfirmModal(op)}
                        className="
              h-11
              px-5
              rounded-2xl
              bg-red-50
              border
              border-red-200
              text-red-600
              font-bold
              flex
              items-center
              gap-2
              hover:bg-red-100
              transition-all
            "
                      >
                        <Icon
                          icon="solar:close-circle-bold"
                          className="text-base"
                        />
                        Close
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400">
                        <Icon icon="solar:lock-bold" className="text-base" />
                        Closed
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="px-8 py-5 border-t border-purple-100 bg-gradient-to-r from-white via-purple-50/40 to-white flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Icon
                    icon="solar:documents-bold"
                    className="text-primary text-lg"
                  />

                  <span>
                    Page{" "}
                    <span className="font-bold text-secondary">{page}</span> of{" "}
                    <span className="font-bold text-secondary">
                      {totalPages}
                    </span>
                  </span>

                  <span className="text-gray-300">•</span>

                  <span>
                    <span className="font-bold text-primary">
                      {filtered.length}
                    </span>{" "}
                    Total Opportunities
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous */}

                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="
w-10
h-10
rounded-2xl
border
border-purple-100
bg-white
flex
items-center
justify-center
text-gray-500
hover:bg-purple-50
hover:border-primary
hover:text-primary
disabled:opacity-40
transition-all
"
                  >
                    <Icon
                      icon="solar:alt-arrow-left-bold"
                      className="text-lg"
                    />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                    )
                    .map((p, idx, arr) => (
                      <Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="w-8 flex justify-center text-gray-300">
                            ...
                          </span>
                        )}

                        <button
                          onClick={() => setPage(p)}
                          className={`

w-10
h-10
rounded-2xl
font-bold
text-sm
transition-all

${
  page === p
    ? "bg-primary text-white shadow-lg shadow-purple-200"
    : "border border-purple-100 bg-white text-secondary hover:bg-purple-50 hover:border-primary hover:text-primary"
}

`}
                        >
                          {p}
                        </button>
                      </Fragment>
                    ))}

                  {/* Next */}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="
w-10
h-10
rounded-2xl
border
border-purple-100
bg-white
flex
items-center
justify-center
text-gray-500
hover:bg-purple-50
hover:border-primary
hover:text-primary
disabled:opacity-40
transition-all
"
                  >
                    <Icon
                      icon="solar:alt-arrow-right-bold"
                      className="text-lg"
                    />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
