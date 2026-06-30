import { useState, useEffect } from "react";
// import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from "./AdminDashboard";
import axios from "../../../utils/axios";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
const roleColors = {
  creator: "bg-blue-50 text-blue-700",
  brand: "bg-yellow-50 text-yellow-700",
  admin: "bg-purple-50 text-primary",
};

const avatarColors = [
  "from-purple-400 to-purple-700",
  "from-blue-400 to-blue-700",
  "from-green-400 to-green-700",
  "from-pink-400 to-pink-700",
];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState("");
  const [banModal, setBanModal] = useState(null);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleBan = async (userId, isBanned) => {
    try {
      await axios.put(`/admin/users/${userId}/ban`, { isBanned: !isBanned });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: !isBanned } : u)),
      );
      showToast(
        isBanned ? "User unbanned successfully" : "User banned successfully",
      );
    } catch {
      showToast("Action failed. Please try again.");
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"
        ? true
        : filter === "active"
          ? !u.isBanned
          : filter === "banned"
            ? u.isBanned
            : u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      <div className="mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-purple-200">
          <Icon
            icon="solar:users-group-rounded-bold"
            className="text-white text-3xl"
          />
        </div>

        <div>
          <h1 className="text-4xl font-black text-secondary">All Users</h1>

          <p className="text-muted text-lg mt-1">
            Manage creators, brands and administrators.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
          w-full
          h-14
          rounded-2xl
          border
          border-purple-100
          bg-white
          px-5
          text-sm
          font-medium
          placeholder:text-gray-400
          transition-all
          focus:outline-none
          focus:border-primary
          focus:ring-4
          focus:ring-purple-100
        "
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:justify-end">
            {["all", "creator", "brand", "admin", "active", "banned"].map(
              (r) => (
                <button
                  key={r}
                  onClick={() => setFilter(r)}
                  className={`
    h-12
    px-6
    rounded-2xl
    font-bold
    text-sm
    whitespace-nowrap
    transition-all
    duration-300

    ${
      filter === r
        ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-purple-200"
        : "bg-white border border-purple-100 text-secondary hover:border-primary hover:text-primary"
    }
  `}
                >
                  {r === "all"
                    ? "All"
                    : r === "creator"
                      ? "Creator"
                      : r === "brand"
                        ? "Brand"
                        : r === "admin"
                          ? "Admin"
                          : r === "active"
                            ? "Active"
                            : r === "banned"
                              ? "Banned"
                              : r}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-3xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto shadow-sm mb-6">
              <Icon
                icon="solar:users-group-rounded-bold"
                className="text-primary text-5xl"
              />
            </div>

            <h3 className="text-2xl font-black text-secondary mb-2">
              No Users Found
            </h3>

            <p className="text-muted text-sm max-w-sm mx-auto leading-7">
              We couldn't find any users matching your current search or filter.
              Try changing the search keywords or selecting a different role.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-purple-50 border-b border-purple-100 text-xs font-bold text-secondary uppercase tracking-wider">
              <div className="col-span-4 flex items-center gap-2">
                <Icon icon="solar:user-bold" className="text-primary text-lg" />
                <span>User</span>
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <Icon
                  icon="solar:shield-user-bold"
                  className="text-primary text-lg"
                />
                <span>Role</span>
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <Icon
                  icon="solar:calendar-bold"
                  className="text-primary text-lg"
                />
                <span>Joined</span>
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <Icon
                  icon="solar:verified-check-bold"
                  className="text-primary text-lg"
                />
                <span>Status</span>
              </div>

              <div className="col-span-1 flex items-center gap-2">
                <Icon
                  icon="solar:settings-bold"
                  className="text-primary text-lg"
                />
                <span>Action</span>
              </div>
            </div>

            {filtered.map((u, i) => (
              <div
                key={u._id}
                className="
    grid
    grid-cols-1
    md:grid-cols-12
    gap-4
    px-6
    py-5
    items-center
    hover:bg-purple-50/50
    transition-all
    duration-300
  "
              >
                {/* User */}
                <div className="md:col-span-4 flex items-center gap-4">
                  <div
                    className={`
        w-14
        h-14
        rounded-2xl
        bg-gradient-to-br
        ${avatarColors[i % avatarColors.length]}
        flex
        items-center
        justify-center
        text-white
        font-black
        text-lg
        shadow-md
        flex-shrink-0
      `}
                  >
                    {u.fullName?.[0] || "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="text-base font-black text-secondary truncate">
                      {u.fullName}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted mt-1">
                      <Icon
                        icon="solar:letter-bold"
                        className="text-primary text-base flex-shrink-0"
                      />

                      <span className="truncate">{u.email}</span>
                    </div>
                  </div>
                </div>

                {/* Role */}

                <div className="md:col-span-2">
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

        ${
          u.role === "creator"
            ? "bg-blue-50 text-blue-700"
            : u.role === "brand"
              ? "bg-orange-50 text-orange-700"
              : "bg-purple-50 text-primary"
        }
      `}
                  >
                    <Icon
                      icon={
                        u.role === "creator"
                          ? "solar:user-bold"
                          : u.role === "brand"
                            ? "solar:buildings-bold"
                            : "solar:shield-user-bold"
                      }
                      className="text-sm"
                    />

                    {u.role}
                  </span>
                </div>

                {/* Joined */}

                <div className="md:col-span-3">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Icon icon="solar:calendar-bold" className="text-primary" />

                    {new Date(u.createdAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {/* Status */}

                <div className="md:col-span-2">
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

        ${u.isBanned ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}
      `}
                  >
                    <Icon
                      icon={
                        u.isBanned
                          ? "solar:user-block-bold"
                          : "solar:verified-check-bold"
                      }
                      className="text-sm"
                    />

                    {u.isBanned ? "Banned" : "Active"}
                  </span>
                </div>

                {/* Action */}

                <div className="md:col-span-1">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => setBanModal(u)}
                      className={`
          h-10
          px-4
          rounded-xl
          font-bold
          text-xs
          transition-all
          duration-300
          inline-flex
          items-center
          justify-center
          gap-2

          ${
            u.isBanned
              ? "bg-green-50 text-green-700 hover:bg-green-100"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }
        `}
                    >
                      <Icon
                        icon={
                          u.isBanned
                            ? "solar:user-check-bold"
                            : "solar:user-block-bold"
                        }
                        className="text-base"
                      />

                      {u.isBanned ? "Unban" : "Ban"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 🚫 Ban / Unban Confirmation */}
      <AnimatePresence>
        {banModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-purple-200">
              {/* Header */}

              <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <Icon
                      icon={
                        banModal.isBanned
                          ? "solar:user-check-bold"
                          : "solar:user-block-bold"
                      }
                      className="text-white text-2xl"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">
                      {banModal.isBanned ? "Unban User" : "Ban User"}
                    </h3>

                    <p className="text-sm text-purple-100 mt-1">
                      Please review before continuing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}

              <div className="p-6 space-y-4">
                {/* User Info */}

                <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4">
                  <p className="text-sm font-bold text-secondary">
                    {banModal.fullName}
                  </p>

                  <p className="text-xs text-muted mt-1">{banModal.email}</p>

                  <p className="text-xs text-primary font-semibold mt-2 capitalize">
                    {banModal.role}
                  </p>
                </div>

                {/* Note */}

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
                  <Icon
                    icon="solar:info-circle-bold"
                    className="text-yellow-500 text-xl flex-shrink-0 mt-0.5"
                  />

                  <p className="text-xs text-yellow-800 leading-6">
                    <strong>Note:</strong>{" "}
                    {banModal.isBanned
                      ? "Unbanning will immediately restore this user's access to Trendora."
                      : "Only ban this user if they have violated platform rules or abused the system. Banned users cannot access their account until manually restored."}
                  </p>
                </div>

                {/* Important Notice */}

                {/* <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      icon="solar:danger-triangle-bold"
                      className="text-red-500"
                    />

                    <span className="font-bold text-red-600">
                      Important Notice
                    </span>
                  </div>

                  <p className="text-xs text-red-600 leading-6">
                    {banModal.isBanned
                      ? "The user will regain access immediately after confirmation."
                      : "The user won't be able to log in until the account is manually unbanned by an administrator."}
                  </p>
                </div> */}

                {/* Buttons */}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setBanModal(null)}
                    className="flex-1 py-3 rounded-2xl border border-border bg-white font-bold text-secondary hover:border-purple-400 hover:text-purple-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Icon icon="solar:close-circle-linear" />
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      handleBan(banModal._id, banModal.isBanned);
                      setBanModal(null);
                    }}
                    className={`flex-1 py-3 rounded-2xl text-white font-bold transition-all flex items-center justify-center gap-2 ${
                      banModal.isBanned
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-lg hover:shadow-purple-300/30"
                    }`}
                  >
                    <Icon
                      icon={
                        banModal.isBanned
                          ? "solar:user-check-bold"
                          : "solar:user-block-bold"
                      }
                    />

                    {banModal.isBanned ? "Unban User" : "Ban User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
