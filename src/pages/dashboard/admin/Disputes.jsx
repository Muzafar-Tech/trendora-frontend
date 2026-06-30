// import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from "./AdminDashboard";
import { Icon } from "@iconify/react";

export default function Disputes() {
  return (
    <>
      <div className="mb-8 flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-purple-200">
          <Icon
            icon="solar:shield-warning-bold"
            className="text-white text-3xl"
          />
        </div>

        <div>
          <h1 className="text-4xl font-black text-secondary">
            Dispute Resolution
          </h1>

          <p className="text-muted text-lg mt-1">
            Review reported conflicts, investigate evidence, and make fair
            decisions between creators and brands.
          </p>
        </div>
      </div>

      {/* How to resolve */}
      {/* Dispute Resolution Process */}

      <div className="bg-white rounded-[32px] border border-purple-100 shadow-sm p-7 mb-8">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              number: "01",
              icon: "solar:clipboard-text-bold",
              title: "Review Both Sides",
              desc: "Carefully review the complete conversation, submitted work, and evidence from both parties.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              number: "02",
              icon: "solar:scale-bold",
              title: "Make Fair Decision",
              desc: "Decide whether to release payment, refund the brand, or approve a partial settlement.",
              color: "bg-yellow-50 text-yellow-600",
            },
            {
              number: "03",
              icon: "solar:bell-bold",
              title: "Notify Both Parties",
              desc: "The final decision is shared automatically with both the creator and the brand.",
              color: "bg-green-50 text-green-600",
            },
          ].map((step) => (
            <div
              key={step.number}
              className="
              bg-purple-100
        rounded-[28px]
        border
        border-purple-100
        bg-gradient-to-br
        from-white
        to-purple-50/40
        p-6
        hover:shadow-xl
        hover:shadow-purple-100
        hover:-translate-y-1
        transition-all
        duration-300
        "
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.color}`}
                >
                  <Icon icon={step.icon} className="text-2xl" />
                </div>

                <span className="text-3xl font-black text-purple-100">
                  {step.number}
                </span>
              </div>

              <h3 className="text-lg font-black text-secondary mb-2">
                {step.title}
              </h3>

              <p className="text-sm leading-7 text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-purple-100 shadow-sm p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-100 flex items-center justify-center shadow-sm mb-6">
            <Icon
              icon="solar:shield-warning-bold"
              className="text-primary text-5xl"
            />
          </div>

          <h2 className="text-2xl font-black text-secondary mb-2">
            No Disputes Found
          </h2>

          <p className="max-w-xl text-center text-muted text-sm leading-7 mb-8">
            Great news! There are currently no reported disputes between
            creators and brands. Any future disputes submitted by users will
            appear here for review and resolution.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3">
                <Icon
                  icon="solar:verified-check-bold"
                  className="text-green-600 text-2xl"
                />
              </div>

              <p className="font-bold text-secondary">Fair Resolution</p>

              <p className="text-xs text-muted mt-1">
                Every dispute is reviewed fairly.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3">
                <Icon
                  icon="solar:chat-round-bold"
                  className="text-blue-600 text-2xl"
                />
              </div>

              <p className="font-bold text-secondary">Complete Evidence</p>

              <p className="text-xs text-muted mt-1">
                Chat history and files are reviewed.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3">
                <Icon
                  icon="solar:bell-bold"
                  className="text-yellow-600 text-2xl"
                />
              </div>

              <p className="font-bold text-secondary">Instant Updates</p>

              <p className="text-xs text-muted mt-1">
                Both parties receive the final decision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
