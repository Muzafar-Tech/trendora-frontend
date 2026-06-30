import { useState, useEffect } from "react";
// import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from "./AdminDashboard";
import axios from "../../../utils/axios";
import { Icon } from "@iconify/react";

const statusColors = {
  pending: "bg-gray-100 text-gray-600",
  screenshot_uploaded: "bg-yellow-50 text-yellow-700",
  verified: "bg-blue-50 text-blue-700",
  released: "bg-green-50 text-green-700",
  refunded: "bg-red-50 text-red-600",
};
const statusIcons = {
  screenshot_uploaded: "solar:gallery-bold",
  verified: "solar:verified-check-bold",
  released: "solar:wallet-money-bold",
  pending: "solar:clock-circle-bold",
  payment_pending: "solar:clock-circle-bold",
  active: "solar:play-circle-bold",
  submitted: "solar:document-bold",
  completed: "solar:check-circle-bold",
  revision: "solar:refresh-circle-bold",
  disputed: "solar:danger-circle-bold",
  cancelled: "solar:close-circle-bold",
};
const statusLabels = {
  pending: "Pending",
  payment_pending: "Payment Pending",
  screenshot_uploaded: "Screenshot Uploaded",
  verified: "Verified",
  released: "Released",
  refunded: "Refunded",
  active: "Active",
  submitted: "Submitted",
  completed: "Completed",
  revision: "Revision",
  disputed: "Disputed",
  cancelled: "Cancelled",
};

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [screenshotModal, setScreenshotModal] = useState(null);
  const [releaseModal, setReleaseModal] = useState(null);
  const [releaseNote, setReleaseNote] = useState("");
  const [releaseRef, setReleaseRef] = useState("");
  const [releasing, setReleasing] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("/admin/payments");
      setPayments(res.data);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleVerify = async (id) => {
    try {
      await axios.put(`/admin/payments/${id}/verify`);
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "verified" } : p)),
      );
      showToast("✅ Payment verified! Collaboration activated.");
    } catch {
      showToast("Action failed.");
    }
  };

  const handleRelease = async () => {
    if (!releaseRef.trim())
      return showToast("Please enter transaction reference");

    // ✅ Check if brand has approved the work
    if (releaseModal.collaborationId?.status !== "completed") {
      showToast(
        `⚠️ Cannot release - Brand hasn't approved work yet (Status: ${releaseModal.collaborationId?.status})`,
      );
      return;
    }
    if (releaseModal.collaborationId?.paymentStatus !== "paid") {
      showToast(`⚠️ Cannot release - Payment not marked as paid by brand`);
      return;
    }

    setReleasing(true);
    try {
      await axios.put(`/admin/payments/${releaseModal._id}/release`, {
        releaseNote,
        releaseRef,
      });
      setPayments((prev) =>
        prev.map((p) =>
          p._id === releaseModal._id ? { ...p, status: "released" } : p,
        ),
      );
      showToast("💰 Payment released to creator!");
      setReleaseModal(null);
      setReleaseNote("");
      setReleaseRef("");
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed.");
    } finally {
      setReleasing(false);
    }
  };

  const filtered = payments.filter((p) =>
    filter === "all" ? true : p.status === filter,
  );

  // Stats update karo
  const stats = [
    {
      label: "Total Received",
      value: `PKR ${payments
        .filter((p) => p.status !== "refunded")
        .reduce((a, p) => a + (p.totalAmount || 0), 0)
        .toLocaleString()}`,
      icon: "solar:wallet-money-bold",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      valueColor: "text-secondary",
    },
    {
      label: "Needs Verify",
      value: payments.filter((p) => p.status === "screenshot_uploaded").length,
      icon: "solar:gallery-bold",
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      valueColor: "text-yellow-700",
    },
    {
      label: "Ready to Release",
      value: payments.filter((p) => p.status === "verified").length,
      icon: "solar:verified-check-bold",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      valueColor: "text-blue-700",
    },
    {
      label: "Commission Earned",
      value: `PKR ${payments
        .filter((p) => p.status === "released")
        .reduce((a, p) => a + (p.platformCommission || 0), 0)
        .toLocaleString()}`,
      icon: "solar:chart-square-bold",
      iconBg: "bg-purple-50",
      iconColor: "text-primary",
      valueColor: "text-primary",
    },
  ];

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-primary text-white text-sm font-semibold rounded-xl shadow-purple">
          {toast}
        </div>
      )}

      {/* Screenshot Modal */}
      {screenshotModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setScreenshotModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
w-full
max-w-2xl
max-h-[88vh]
bg-white
rounded-[30px]
border
border-purple-100
shadow-[0_30px_90px_rgba(124,58,237,.18)]
overflow-hidden
flex
flex-col
"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-1xl  flex items-center justify-center">
                  <Icon
                    icon="solar:gallery-bold"
                    className="text-white text-2xl"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">
                    Payment Screenshot
                  </h3>

                  <p className="text-purple-100 text-sm mt-1">
                    Review payment proof before verification.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setScreenshotModal(null)}
                className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center"
              >
                <Icon
                  icon="solar:close-circle-bold"
                  className="text-white text-2xl"
                />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-7 space-y-6">
              {/* Screenshot */}
              <div className="rounded-3xl overflow-hidden border border-purple-100 bg-gray-50">
                <img
                  src={screenshotModal.screenshotUrl}
                  alt="Payment Screenshot"
                  className="w-full max-h-[320px] object-contain"
                />
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    label: "Transaction ID",
                    value: screenshotModal.transactionId || "N/A",
                    icon: "solar:document-text-bold",
                  },
                  {
                    label: "Brand JazzCash",
                    value: screenshotModal.brandJazzCash || "N/A",
                    icon: "solar:wallet-money-bold",
                  },
                  {
                    label: "Total Amount",
                    value: `PKR ${screenshotModal.totalAmount?.toLocaleString()}`,
                    icon: "solar:card-bold",
                  },
                  {
                    label: "Creator Amount",
                    value: `PKR ${screenshotModal.creatorAmount?.toLocaleString()}`,
                    icon: "solar:wallet-money-bold",
                  },
                  {
                    label: "Platform Commission",
                    value: `PKR ${screenshotModal.platformCommission?.toLocaleString()}`,
                    icon: "solar:chart-square-bold",
                  },
                  {
                    label: "Creator JazzCash",
                    value:
                      screenshotModal.creatorId?.jazzCashNumber || "Not Set",
                    icon: "solar:smartphone-bold",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-purple-100 bg-purple-50 p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon icon={item.icon} className="text-primary text-xl" />

                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {item.label}
                      </p>
                    </div>

                    <p className="text-lg font-black text-secondary break-words">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Important Notice */}
              <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-5 flex gap-3">
                <Icon
                  icon="solar:shield-warning-bold"
                  className="text-yellow-600 text-2xl flex-shrink-0"
                />

                <div>
                  <h4 className="font-black text-yellow-800 mb-1">
                    Verify Carefully
                  </h4>

                  <p className="text-sm text-yellow-700 leading-6">
                    Ensure the payment screenshot, transaction ID and payment
                    amount are correct before verifying this transaction. Once
                    verified, the creator becomes eligible for payment release.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-purple-100 bg-white p-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setScreenshotModal(null)}
                className="
          flex-1
          h-14
          rounded-2xl
          border
          border-purple-100
          bg-white
          font-bold
          text-secondary
          hover:border-primary
          hover:text-primary
          transition-all
          flex
          items-center
          justify-center
          gap-2
          "
              >
                <Icon icon="solar:close-circle-linear" />
                Close
              </button>

              {screenshotModal.status === "screenshot_uploaded" && (
                <button
                  onClick={() => {
                    handleVerify(screenshotModal._id);
                    setScreenshotModal(null);
                  }}
                  className="
            flex-1
            h-14
            rounded-2xl
            bg-primary
            hover:bg-primary-dark
            text-white
            font-bold
            transition-all
            flex
            items-center
            justify-center
            gap-2
            "
                >
                  <Icon icon="solar:verified-check-bold" />
                  Verify Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Release Modal */}
      {releaseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-purple overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-700 p-5 rounded-t-2xl">
              <h3 className="font-black text-white text-lg">
                Release Payment to Creator
              </h3>
              <p className="text-green-100 text-sm mt-1">
                Amount: PKR {releaseModal.creatorAmount?.toLocaleString()}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* ✅ Show Collaboration Status */}
              <div
                className={`rounded-xl p-4 ${
                  releaseModal.collaborationId?.status === "completed" &&
                  releaseModal.collaborationId?.paymentStatus === "paid"
                    ? "bg-green-50 border border-green-200"
                    : "bg-orange-50 border border-orange-200"
                }`}
              >
                <p className="text-xs font-bold mb-2 text-secondary">
                  📋 Collaboration Status:
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Work Status:</span>
                    <span
                      className={`font-bold ${releaseModal.collaborationId?.status === "completed" ? "text-green-700" : "text-orange-600"}`}
                    >
                      {releaseModal.collaborationId?.status === "completed"
                        ? "✅ Completed"
                        : `⏳ ${releaseModal.collaborationId?.status}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Payment Status:</span>
                    <span
                      className={`font-bold ${releaseModal.collaborationId?.paymentStatus === "paid" ? "text-green-700" : "text-orange-600"}`}
                    >
                      {releaseModal.collaborationId?.paymentStatus === "paid"
                        ? "✅ Paid"
                        : `⏳ ${releaseModal.collaborationId?.paymentStatus}`}
                    </span>
                  </div>
                </div>

                {/* ⚠️ Warning if brand hasn't approved */}
                {(releaseModal.collaborationId?.status !== "completed" ||
                  releaseModal.collaborationId?.paymentStatus !== "paid") && (
                  <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-300">
                    <p className="text-xs font-semibold text-orange-700">
                      ⚠️ Cannot Release Yet
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Brand must first approve the submitted work before you can
                      release payment.
                    </p>
                  </div>
                )}
              </div>

              {/* Creator Payment Info */}
              <div className="bg-primary-light rounded-xl p-4">
                <p className="text-xs font-bold text-primary mb-3">
                  👤 Creator Payment Details:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Name:</span>
                    <span className="font-bold text-secondary">
                      {releaseModal.creatorId?.fullName}
                    </span>
                  </div>
                  {releaseModal.creatorId?.jazzCashNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">JazzCash:</span>
                      <span className="font-bold text-secondary">
                        {releaseModal.creatorId.jazzCashNumber}
                      </span>
                    </div>
                  )}
                  {releaseModal.creatorId?.easypaisaNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Easypaisa:</span>
                      <span className="font-bold text-secondary">
                        {releaseModal.creatorId.easypaisaNumber}
                      </span>
                    </div>
                  )}
                  {releaseModal.creatorId?.bankName && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Bank:</span>
                        <span className="font-bold text-secondary">
                          {releaseModal.creatorId.bankName}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Account:</span>
                        <span className="font-bold text-secondary">
                          {releaseModal.creatorId.bankAccountNumber}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Title:</span>
                        <span className="font-bold text-secondary">
                          {releaseModal.creatorId.bankAccountTitle}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-primary/20">
                    <span className="text-muted">Amount to Send:</span>
                    <span className="font-black text-green-700 text-base">
                      PKR {releaseModal.creatorAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Transaction Details */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Your Transaction Reference Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN987654321"
                  value={releaseRef}
                  onChange={(e) => setReleaseRef(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Note to Creator (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Payment sent via JazzCash. Please check your account."
                  value={releaseNote}
                  onChange={(e) => setReleaseNote(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setReleaseModal(null);
                    setReleaseNote("");
                    setReleaseRef("");
                  }}
                  className="flex-1 py-2.5 border-2 border-border text-muted rounded-xl text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRelease}
                  disabled={
                    releasing ||
                    !releaseRef.trim() ||
                    releaseModal.collaborationId?.status !== "completed" ||
                    releaseModal.collaborationId?.paymentStatus !== "paid"
                  }
                  className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {releasing ? "Releasing..." : "💰 Confirm Release"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="md:w-14 md:h-14 w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-purple-200">
          <Icon
            icon="solar:wallet-money-bold"
            className="text-white text-3xl"
          />
        </div>

        <div>
          <h1 className="md:text-4xl text-2xl  font-black text-secondary">
            Payments & Commission
          </h1>

          <p className="text-muted text-lg mt-1">
            Review payment proofs, verify transactions, release creator payouts,
            and track platform commissions.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((card, i) => (
          <div
            key={i}
            className="
        group
        bg-purple-100
        rounded-[30px]
        border
        border-purple-100
        p-6
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

      {/* Platform Payment Account */}
      <div className="bg-white rounded-[32px] border border-purple-100 shadow-sm p-7 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Icon
              icon="solar:card-transfer-bold"
              className="text-3xl text-primary"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black text-secondary">
              Platform Payment Account
            </h2>

            <p className="text-sm text-muted mt-1">
              All brand payments must be transferred to this official account
              before creator payouts are released.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* JazzCash */}
          <div className="bg-purple-50 rounded-3xl border border-purple-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center">
                <Icon
                  icon="solar:wallet-money-bold"
                  className="text-2xl text-primary"
                />
              </div>

              <div>
                <p className="text-xs text-muted">JazzCash Number</p>
                <p className="font-black text-secondary">0300-XXXXXXX</p>
              </div>
            </div>
          </div>

          {/* Account Title */}
          <div className="bg-blue-50 rounded-3xl border border-blue-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center">
                <Icon
                  icon="solar:user-id-bold"
                  className="text-2xl text-blue-600"
                />
              </div>

              <div>
                <p className="text-xs text-muted">Account Title</p>
                <p className="font-black text-secondary">Trendora Official</p>
              </div>
            </div>
          </div>

          {/* Commission */}
          <div className="bg-green-50 rounded-3xl border border-green-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center">
                <Icon
                  icon="solar:chart-square-bold"
                  className="text-2xl text-green-600"
                />
              </div>

              <div>
                <p className="text-xs text-muted">Platform Commission</p>
                <p className="font-black text-green-600">10%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-3xl p-5 flex gap-3">
          <Icon
            icon="solar:info-circle-bold"
            className="text-yellow-500 text-2xl flex-shrink-0 mt-0.5"
          />

          <p className="text-sm text-yellow-800 leading-7">
            <strong>Important:</strong> Verify the uploaded payment proof
            carefully before approving any transaction. Creator payments can
            only be released after successful verification.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[
            {
              key: "all",
              label: "All",
              icon: "solar:layers-bold",
            },
            {
              key: "screenshot_uploaded",
              label: "Needs Verify",
              icon: "solar:gallery-bold",
            },
            {
              key: "verified",
              label: "To Release",
              icon: "solar:verified-check-bold",
            },
            {
              key: "released",
              label: "Released",
              icon: "solar:wallet-money-bold",
            },
            {
              key: "pending",
              label: "Pending",
              icon: "solar:clock-circle-bold",
            },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`
          flex
          items-center
          gap-2
          h-12
          px-5
          rounded-2xl
          whitespace-nowrap
          font-bold
          text-sm
          transition-all
          duration-300
          flex-shrink-0

          ${
            filter === f.key
              ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-purple-200"
              : "bg-white border border-purple-100 text-secondary hover:border-primary hover:text-primary hover:shadow-md"
          }
        `}
            >
              <Icon icon={f.icon} className="text-lg" />

              <span>{f.label}</span>

              {f.key !== "all" && (
                <span
                  className={`
              min-w-6
              h-6
              px-2
              rounded-full
              flex
              items-center
              justify-center
              text-xs
              font-black

              ${
                filter === f.key
                  ? "bg-white/20 text-white"
                  : "bg-purple-50 text-primary"
              }
            `}
                >
                  {payments.filter((p) => p.status === f.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Payments List */}
      <div
        className="
  bg-white
  rounded-[32px]
  border
  border-purple-100
  shadow-sm
  hover:shadow-xl
  hover:shadow-purple-100/40
  transition-all
  duration-300
  overflow-hidden
  "
      >
        <div className="px-7 py-5 border-b border-purple-100 bg-gradient-to-r from-purple-50/40 to-white flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-xl font-black text-secondary">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Icon
                icon="solar:card-transfer-bold"
                className="text-primary text-xl"
              />
            </div>
            All Transactions
          </h2>
          <div className="px-4 py-2 rounded-2xl bg-purple-50 border border-purple-100 text-xs font-bold text-primary">
            {filtered.length} Records
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-100 flex items-center justify-center shadow-sm mb-6">
              <Icon
                icon="solar:wallet-money-bold"
                className="text-5xl text-primary"
              />
            </div>

            <h3 className="text-2xl font-black text-secondary mb-2">
              No Payments Found
            </h3>

            <p className="max-w-md text-center text-sm text-muted leading-7">
              There are no payment transactions matching your current filters.
              Once brands submit payments, they will appear here for review,
              verification, and creator payout.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="px-6 py-4 hover:bg-surface transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    {/* Title + Status */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-secondary truncate">
                          {p.collaborationId?.opportunityId?.title ||
                            "Collaboration Payment"}
                        </h3>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                          statusColors[p.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <Icon
                          icon={
                            statusIcons[p.status] || "solar:info-circle-bold"
                          }
                          className="text-sm"
                        />
                        {statusLabels[p.status] || p.status}
                      </span>
                    </div>

                    {/* Meta Information */}

                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted mb-5">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:buildings-2-bold"
                          className="text-primary text-lg"
                        />
                        <span>
                          {p.brandId?.brandName || p.brandId?.fullName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:user-bold"
                          className="text-blue-500 text-lg"
                        />
                        <span>{p.creatorId?.fullName}</span>
                      </div>

                      {p.transactionId && (
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="solar:hashtag-square-bold"
                            className="text-orange-500 text-lg"
                          />
                          <span className="font-semibold">
                            TXN: {p.transactionId}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Icon
                          icon="solar:calendar-bold"
                          className="text-violet-500 text-lg"
                        />
                        <span>
                          {new Date(p.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Creator Payment Details */}

                    {(p.status === "verified" || p.status === "released") && (
                      <div className="rounded-3xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-5 mb-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <Icon
                              icon="solar:wallet-money-bold"
                              className="text-green-600 text-xl"
                            />
                          </div>

                          <div>
                            <h4 className="font-black text-green-700">
                              Creator Payment Details
                            </h4>

                            <p className="text-xs text-green-600">
                              Release payment using the details below.
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          {p.creatorId?.jazzCashNumber && (
                            <div className="flex items-center gap-3 bg-white rounded-2xl border border-green-100 px-4 py-3">
                              <Icon
                                icon="solar:smartphone-bold"
                                className="text-green-600 text-xl"
                              />

                              <div>
                                <p className="text-xs text-muted">JazzCash</p>

                                <p className="font-bold text-secondary">
                                  {p.creatorId.jazzCashNumber}
                                </p>
                              </div>
                            </div>
                          )}

                          {p.creatorId?.easypaisaNumber && (
                            <div className="flex items-center gap-3 bg-white rounded-2xl border border-green-100 px-4 py-3">
                              <Icon
                                icon="solar:smartphone-bold"
                                className="text-green-600 text-xl"
                              />

                              <div>
                                <p className="text-xs text-muted">Easypaisa</p>

                                <p className="font-bold text-secondary">
                                  {p.creatorId.easypaisaNumber}
                                </p>
                              </div>
                            </div>
                          )}

                          {p.creatorId?.bankName && (
                            <div className="md:col-span-2 flex items-center gap-3 bg-white rounded-2xl border border-green-100 px-4 py-3">
                              <Icon
                                icon="solar:card-bold"
                                className="text-green-600 text-xl"
                              />

                              <div>
                                <p className="text-xs text-muted">
                                  {p.creatorId.bankName}
                                </p>

                                <p className="font-bold text-secondary">
                                  {p.creatorId.bankAccountNumber}
                                </p>

                                <p className="text-xs text-muted">
                                  {p.creatorId.bankAccountTitle}
                                </p>
                              </div>
                            </div>
                          )}

                          {!p.creatorId?.jazzCashNumber &&
                            !p.creatorId?.easypaisaNumber &&
                            !p.creatorId?.bankName && (
                              <div className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-4">
                                <Icon
                                  icon="solar:danger-triangle-bold"
                                  className="text-orange-500 text-xl"
                                />

                                <div>
                                  <p className="font-bold text-orange-700">
                                    Payment Details Missing
                                  </p>

                                  <p className="text-xs text-orange-600">
                                    Creator has not added payment information
                                    yet.
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    {/* Screenshot */}

                    {p.screenshotUrl && (
                      <button
                        onClick={() => setScreenshotModal(p)}
                        className="
      inline-flex
      items-center
      gap-2
      px-4
      py-2.5
      rounded-2xl
      border
      border-purple-100
      bg-purple-50
      text-primary
      font-bold
      text-sm
      hover:bg-primary
      hover:text-white
      hover:border-primary
      transition-all
      "
                      >
                        <Icon icon="solar:gallery-bold" className="text-lg" />
                        View Payment Screenshot
                      </button>
                    )}
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                    <div className="text-right">
                      <p className="text-sm font-black text-secondary">
                        PKR {p.totalAmount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600">
                        Creator: PKR {p.creatorAmount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-primary">
                        Commission: PKR {p.platformCommission?.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {p.status === "screenshot_uploaded" && (
                        <button
                          onClick={() => setScreenshotModal(p)}
                          className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          🔍 Review & Verify
                        </button>
                      )}
                      {p.status === "verified" && (
                        <>
                          {p.collaborationId?.status === "completed" &&
                          p.collaborationId?.paymentStatus === "paid" ? (
                            <button
                              onClick={() => setReleaseModal(p)}
                              className="px-3 py-1.5 text-xs font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              title="Brand approved work - Ready to release"
                            >
                              💰 Release Payment
                            </button>
                          ) : (
                            <div className="relative group">
                              <button
                                disabled
                                className="px-3 py-1.5 text-xs font-bold bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed opacity-60"
                                title="Waiting for brand approval"
                              >
                                ⏳ Awaiting Brand
                              </button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-normal">
                                ⏳ Waiting for brand to approve work completion
                                <br />
                                Current:{" "}
                                {p.collaborationId?.status || "unknown"}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {p.status === "pending" && (
                        <span className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-500 rounded-lg">
                          Awaiting Brand
                        </span>
                      )}
                      {p.status === "released" && (
                        <span className="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 rounded-lg">
                          ✅ Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
