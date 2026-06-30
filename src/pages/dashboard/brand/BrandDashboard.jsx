import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
// import DashboardLayout from '../shared/DashboardLayout'
import { Link } from "react-router-dom";
import axios from "../../../utils/axios";
import socket from "../../../utils/socket";
import { Icon } from "@iconify/react";

// export const brandLinks = [
//   { to: "/brand/dashboard", icon: "📊", label: "Dashboard" },
//   { to: "/brand/post-opportunity", icon: "📢", label: "Post Opportunity" },
//   { to: "/brand/opportunities", icon: "📋", label: "My Opportunities" },
//   { to: "/brand/applications", icon: "👥", label: "Applications Received" },
//   { to: "/brand/collaborations", icon: "🤝", label: "Active Collaborations" },
//   { to: "/brand/payments", icon: "💳", label: "Payments" },
//   { to: "/brand/profile", icon: "🏢", label: "Profile Settings" },
// ];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

export default function BrandDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    opportunities: 0,
    applications: 0,
    active: 0,
    spent: 0,
  });
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();

    socket.on("new_notification", () => {
      fetchAll();
    });

    return () => socket.off("new_notification");
  }, []);
  const fetchAll = async () => {
    try {
      const [oppsRes, appsRes, collabsRes, notifsRes, paymentsRes] =
        await Promise.all([
          axios.get("/opportunities/my/list"),
          axios.get("/applications/brand"),
          axios.get("/collaborations/brand"),
          axios.get("/notifications"),
          axios.get("/payments/brand"),
        ]);

      setOpportunities(oppsRes.data.slice(0, 3));
      setApplications(appsRes.data.slice(0, 5));
      setCollaborations(collabsRes.data);
      setNotifications(notifsRes.data.slice(0, 5));

      const totalSpent = paymentsRes.data
        .filter((p) => p.status === "released")
        .reduce((a, p) => a + (p.totalAmount || 0), 0);

      const pendingPayments = paymentsRes.data
        .filter((p) => ["pending", "screenshot_uploaded"].includes(p.status))
        .reduce((a, p) => a + (p.totalAmount || 0), 0);

      setStats({
        opportunities: oppsRes.data.filter((o) => o.status === "active").length,
        applications: appsRes.data.filter(
          (a) => a.status === "pending" || a.status === "countered",
        ).length,
        active: collabsRes.data.filter((c) =>
          ["active", "submitted", "revision"].includes(c.status),
        ).length,
        spent: totalSpent,
        pending: pendingPayments,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const notifIcons = {
    application: "solar:clipboard-list-bold",
    collaboration: "solar:handshake-bold",
    payment: "solar:wallet-money-bold",
    message: "solar:chat-round-bold",
    system: "solar:bell-bold",
  };

  const statusColors = {
    active: "bg-blue-50 text-blue-700",
    submitted: "bg-yellow-50 text-yellow-700",
    completed: "bg-green-50 text-green-700",
    revision: "bg-orange-50 text-orange-700",
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        {/* Left */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-200 flex-shrink-0">
            <Icon icon="solar:shop-2-bold" className="text-white text-3xl" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-secondary">
                {getGreeting()},{" "}
                {user?.brandName || user?.fullName?.split(" ")[0]}
              </h1>

              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 text-amber-500">
                <Icon icon="solar:star-bold" className="text-lg" />
              </span>
            </div>

            <p className="text-muted text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Manage opportunities, review creator applications, track active
              collaborations, and monitor your campaign performance from one
              professional dashboard.
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
      from-primary
      to-primary-dark
      text-white
      font-bold
      text-sm
      shadow-lg
      shadow-purple-200
      hover:scale-[1.03]
      hover:shadow-xl
      transition-all
      duration-300
      w-full
      sm:w-auto
    "
        >
          <Icon icon="solar:add-circle-bold" className="text-xl" />
          Post Opportunity
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Active Opportunities",
            value: stats.opportunities,
            icon: "solar:add-circle-bold",
            color:
              "bg-gradient-to-br from-violet-100 to-purple-100 text-primary",
            sub: "View Opportunities",
            to: "/brand/opportunities",
          },
          {
            label: "Pending Applications",
            value: stats.applications,
            icon: "solar:users-group-rounded-bold",
            color:
              "bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-600",
            sub: "Review Applications",
            to: "/brand/applications",
          },
          {
            label: "Active Collaborations",
            value: stats.active,
            icon: "solar:users-group-rounded-bold",
            color:
              "bg-gradient-to-br from-emerald-100 to-green-100 text-green-600",
            sub: "View Collaborations",
            to: "/brand/collaborations",
          },
          {
            label: "Total Spent",
            value: `PKR ${stats.spent.toLocaleString()}`,
            icon: "solar:wallet-money-bold",
            color: "bg-gradient-to-br from-sky-100 to-cyan-100 text-sky-600",
            sub: "View Payments",
            to: "/brand/payments",
          },
        ].map((s, i) => (
          <Link
            key={i}
            to={s.to}
            className="
        group
       bg-purple-100
        rounded-[30px]
        border
        border-purple-100
        shadow-sm
        hover:shadow-xl
        hover:border-primary/30
        transition-all
        duration-300
        hover:-translate-y-1
        p-6
        overflow-hidden
        relative
      "
          >
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-purple-50 opacity-60 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10">
              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-2xl ${s.color} flex items-center justify-center shadow-sm mb-5`}
              >
                <Icon icon={s.icon} className="text-2xl" />
              </div>

              {/* Value */}
              <h3 className="text-3xl font-black text-secondary tracking-tight">
                {s.value}
              </h3>

              {/* Label */}
              <p className="text-sm font-semibold text-gray-500 mt-2">
                {s.label}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6">
                <span className="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                  {s.sub}
                </span>

                <div className="w-9 h-9 rounded-xl bg-purple-50 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center">
                  <Icon icon="solar:arrow-right-linear" className="text-lg" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-[30px] border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Icon
                  icon="solar:clipboard-list-bold"
                  className="text-2xl text-primary"
                />
              </div>

              <div>
                <h2 className="text-lg font-black text-secondary">
                  Recent Applications
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Latest creator applications received
                </p>
              </div>
            </div>

            <Link
              to="/brand/applications"
              className="
        hidden
        sm:inline-flex
        items-center
        gap-2
        px-4
        h-11
        rounded-2xl
        border
        border-purple-100
        bg-white
        text-sm
        font-bold
        text-primary
        hover:bg-purple-50
        hover:border-primary
        transition-all
      "
            >
              View All
              <Icon icon="solar:arrow-right-linear" className="text-base" />
            </Link>
          </div>
          {/* Body */}
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-2xl border border-purple-100 bg-white p-4 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100" />
                      <div className="space-y-2">
                        <div className="h-3 w-40 rounded-full bg-gray-200" />
                        <div className="h-2.5 w-28 rounded-full bg-gray-100" />
                      </div>
                    </div>

                    <div className="space-y-2 text-right">
                      <div className="h-3 w-20 rounded-full bg-gray-200 ml-auto" />
                      <div className="h-7 w-16 rounded-full bg-gray-100 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-20 h-20 rounded-[24px] bg-purple-100 flex items-center justify-center mb-5">
                  <Icon
                    icon="solar:clipboard-remove-bold"
                    className="text-4xl text-primary"
                  />
                </div>

                <h3 className="text-lg font-black text-secondary">
                  No Applications Yet
                </h3>

                <p className="text-sm text-muted mt-2 max-w-sm leading-relaxed">
                  Creator applications will appear here once creators start
                  applying to your opportunities.
                </p>

                <Link
                  to="/brand/post-opportunity"
                  className="
      inline-flex
      items-center
      gap-2
      mt-6
      px-5
      h-11
      rounded-2xl
      bg-gradient-to-r
      from-primary
      to-primary-dark
      text-white
      text-sm
      font-bold
      shadow-lg
      shadow-purple-200
      hover:scale-[1.03]
      transition-all
    "
                >
                  <Icon icon="solar:add-circle-bold" className="text-lg" />
                  Post Opportunity
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app, i) => (
                  <div
                    key={app._id}
                    className="
    group
    flex
    flex-col
    sm:flex-row
    sm:items-center
    justify-between
    gap-4
    p-5
    rounded-2xl
    border
    border-purple-100
    bg-white
    hover:bg-purple-50/40
    hover:border-primary/20
    hover:shadow-md
    transition-all
    duration-300
  "
                  >
                    {/* Left */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {/* Avatar */}
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                          i % 3 === 0
                            ? "from-purple-500 to-violet-700"
                            : i % 3 === 1
                              ? "from-sky-500 to-blue-700"
                              : "from-emerald-500 to-green-700"
                        } flex items-center justify-center text-white font-black text-base shadow-sm flex-shrink-0`}
                      >
                        {app.creatorId?.fullName?.charAt(0)?.toUpperCase() ||
                          "C"}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-secondary truncate">
                          {app.creatorId?.fullName}
                        </h3>

                        <p className="text-xs text-muted mt-1 truncate">
                          {app.opportunityId?.title}
                        </p>

                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                              app.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : app.status === "accepted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Icon
                              icon={
                                app.status === "pending"
                                  ? "solar:clock-circle-bold"
                                  : app.status === "accepted"
                                    ? "solar:check-circle-bold"
                                    : "solar:close-circle-bold"
                              }
                              className="text-sm"
                            />

                            {app.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center justify-between sm:block sm:text-right">
                      <div>
                        <p className="text-[11px] text-muted uppercase tracking-wide">
                          Offer
                        </p>

                        <h3 className="text-lg font-black text-primary mt-0.5">
                          PKR {app.counterAmount?.toLocaleString()}
                        </h3>
                      </div>

                      {/* <div className="mt-3 flex justify-end">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 group-hover:bg-primary transition-all flex items-center justify-center">
                          <Icon
                            icon="solar:arrow-right-linear"
                            className="text-primary group-hover:text-white transition-colors"
                          />
                        </div>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-[30px] border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Icon
                  icon="solar:bell-bold"
                  className="text-2xl text-primary"
                />
              </div>

              <div>
                <h2 className="text-lg font-black text-secondary">
                  Notifications
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Latest updates and platform alerts
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-purple-100 text-primary text-xs font-bold">
              {notifications.length}
            </span>
          </div>

          <div className="p-6">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-20 h-20 rounded-[24px] bg-purple-100 flex items-center justify-center mb-5">
                  <Icon
                    icon="solar:bell-off-bold"
                    className="text-4xl text-primary"
                  />
                </div>

                <h3 className="text-lg font-black text-secondary">
                  No Notifications
                </h3>

                <p className="text-sm text-muted mt-2 max-w-xs">
                  You'll receive application updates, collaboration alerts and
                  payment notifications here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`
              group
              flex
              items-start
              gap-4
              p-4
              rounded-2xl
              border
              transition-all
              duration-300

              ${
                n.isRead
                  ? "bg-white border-purple-100 hover:bg-purple-50/40 hover:border-primary/20"
                  : "bg-purple-50 border-purple-200 hover:border-primary"
              }
            `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                w-11
                h-11
                rounded-2xl
                flex
                items-center
                justify-center
                shadow-sm
                flex-shrink-0

                ${
                  n.isRead
                    ? "bg-purple-100"
                    : "bg-gradient-to-br from-primary to-primary-dark"
                }
              `}
                    >
                      <Icon
                        icon={notifIcons[n.type] || "solar:bell-bold"}
                        className={`text-xl ${
                          n.isRead ? "text-primary" : "text-white"
                        }`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-bold text-secondary line-clamp-1">
                          {n.title}
                        </h3>

                        {!n.isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-1 animate-pulse" />
                        )}
                      </div>

                      <p className="text-xs text-muted mt-1.5 leading-5 line-clamp-2">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <Icon
                          icon="solar:calendar-linear"
                          className="text-sm text-gray-400"
                        />

                        <span className="text-xs text-muted">
                          {new Date(n.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Active Collaborations */}
      <div className="bg-white rounded-[30px] border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Icon
                icon="solar:users-group-rounded-bold"
                className="text-2xl text-primary"
              />
            </div>

            <div>
              <h2 className="text-lg font-black text-secondary">
                Active Collaborations
              </h2>

              <p className="text-xs text-muted mt-0.5">
                Ongoing creator collaborations
              </p>
            </div>
          </div>

          <Link
            to="/brand/collaborations"
            className="
        hidden
        sm:inline-flex
        items-center
        gap-2
        px-4
        h-11
        rounded-2xl
        border
        border-purple-100
        bg-white
        text-sm
        font-bold
        text-primary
        hover:bg-purple-50
        hover:border-primary
        transition-all
      "
          >
            View All
            <Icon icon="solar:arrow-right-linear" className="text-base" />
          </Link>
        </div>

        <div className="p-6">
          {collaborations.filter((c) =>
            ["active", "submitted", "revision"].includes(c.status),
          ).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-[24px] bg-purple-100 flex items-center justify-center mb-5">
                <Icon
                  icon="solar:users-group-rounded-bold"
                  className="text-4xl text-primary"
                />
              </div>

              <h3 className="text-lg font-black text-secondary">
                No Active Collaborations
              </h3>

              <p className="text-sm text-muted mt-2 max-w-sm">
                Once creators are approved, active collaborations will appear
                here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {collaborations
                .filter((c) =>
                  ["active", "submitted", "revision"].includes(c.status),
                )
                .slice(0, 3)
                .map((c, i) => {
                  const progress =
                    c.status === "active"
                      ? 30
                      : c.status === "submitted"
                        ? 80
                        : 50;

                  return (
                    <div
                      key={c._id}
                      className="
                  group
                  rounded-3xl
                  border
                  border-purple-100
                  bg-white
                  p-5
                  hover:border-primary/20
                  hover:bg-purple-50/30
                  hover:shadow-lg
                  transition-all
                  duration-300
                "
                    >
                      {/* Top */}

                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                              i % 3 === 0
                                ? "from-violet-500 to-purple-700"
                                : i % 3 === 1
                                  ? "from-sky-500 to-blue-700"
                                  : "from-emerald-500 to-green-700"
                            } flex items-center justify-center text-white font-black shadow-sm`}
                          >
                            {c.creatorId?.fullName?.charAt(0)?.toUpperCase() ||
                              "C"}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-secondary truncate">
                              {c.creatorId?.fullName}
                            </h3>

                            <p className="text-xs text-muted mt-1 truncate">
                              {c.opportunityId?.title}
                            </p>
                          </div>
                        </div>

                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                          <Icon
                            icon="solar:users-group-rounded-bold"
                            className="text-primary"
                          />
                        </div>
                      </div>

                      {/* Status */}

                      <div className="flex items-center justify-between mb-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold ${statusColors[c.status]}`}
                        >
                          <Icon
                            icon={
                              c.status === "active"
                                ? "solar:play-circle-bold"
                                : c.status === "submitted"
                                  ? "solar:clipboard-check-bold"
                                  : "solar:refresh-circle-bold"
                            }
                            className="text-sm"
                          />

                          {c.status === "active"
                            ? "In Progress"
                            : c.status === "submitted"
                              ? "Under Review"
                              : "Revision"}
                        </span>

                        <span className="text-lg font-black text-primary">
                          PKR {c.agreedAmount?.toLocaleString()}
                        </span>
                      </div>

                      {/* Progress */}

                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted">
                          Progress
                        </span>

                        <span className="text-xs font-black text-primary">
                          {progress}%
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
