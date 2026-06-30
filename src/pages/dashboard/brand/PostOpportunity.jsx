import { useState } from "react";
// import DashboardLayout from "../shared/DashboardLayout";
// import { brandLinks } from "./BrandDashboard";
import axios from "../../../utils/axios";
import { Icon } from "@iconify/react";

const platformOptions = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "Twitter",
  "Snapchat",
  "Other",
];
const categoryOptions = [
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
  "Other",
];

export default function PostOpportunity() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    platform: "",
  });
  const [customPlatform, setCustomPlatform] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Other select hone par custom value use karo
    const finalPlatform =
      form.platform === "Other" ? customPlatform.trim() : form.platform;
    const finalCategory =
      form.category === "Other" ? customCategory.trim() : form.category;

    if (!finalPlatform) return setError("Please enter a platform name");
    if (!finalCategory) return setError("Please enter a category name");

    setLoading(true);
    try {
      await axios.post("/opportunities", {
        ...form,
        platform: finalPlatform,
        category: finalCategory,
        budget: Number(form.budget),
        deadline: Number(form.deadline),
      });
      setSuccess(true);
      setForm({
        title: "",
        description: "",
        category: "",
        budget: "",
        deadline: "",
        platform: "",
      });
      setCustomPlatform("");
      setCustomCategory("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post opportunity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div className="flex items-start gap-4">
          <div className="md:w-12 md:h-12 w-10 h-10 rounded-[22px] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-purple-200 flex-shrink-0">
            <Icon
              icon="solar:add-circle-bold"
              className="text-[30px] text-white"
            />
          </div>

          <div>
            <h1 className="text-3xl lg:text-[34px] font-black tracking-tight text-secondary">
              Post Opportunity
            </h1>

            <p className="text-muted text-sm mt-2 max-w-xl leading-6">
              Create a professional campaign and start receiving applications
              from verified creators across multiple social platforms.
            </p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-3 px-5 py-4 rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
            <Icon
              icon="solar:users-group-rounded-bold"
              className="text-2xl text-primary"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Audience
            </p>

            <h4 className="font-black text-secondary">Verified Creators</h4>
          </div>
        </div>
      </div>

      <div className="max-w-5xl">
        <div
          className="
      relative
      overflow-hidden
      bg-white
      rounded-[32px]
      border
      border-purple-100
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-300
    "
        >
          {/* Decorative Background */}

          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-50 blur-3xl opacity-70" />

          <div className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full bg-violet-50 blur-3xl opacity-60" />

          {/* Top Header */}

          <div className="relative z-10 border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-white px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-purple-200 flex items-center justify-center">
                <Icon
                  icon="solar:clipboard-add-bold"
                  className="text-[28px] text-white"
                />
              </div>

              <div>
                <h2 className="text-xl font-black text-secondary">
                  Opportunity Details
                </h2>

                <p className="text-sm text-muted mt-1">
                  Fill in the campaign information to attract the right
                  creators.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}

          <div className="relative z-10 p-8 lg:p-10">
            {success && (
              <div className="mb-8 flex items-start gap-4 rounded-3xl border border-green-200 bg-gradient-to-r from-green-50 via-white to-green-50 p-5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Icon
                    icon="solar:check-circle-bold"
                    className="text-2xl text-green-600"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-black text-green-700">
                    Opportunity Published Successfully
                  </h3>

                  <p className="text-sm text-green-600 mt-1 leading-6">
                    Your campaign is now live and verified creators can start
                    submitting applications immediately.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-8 flex items-start gap-4 rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50 p-5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Icon
                    icon="solar:danger-circle-bold"
                    className="text-2xl text-red-600"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-black text-red-700">
                    Unable to Publish Opportunity
                  </h3>

                  <p className="text-sm text-red-600 mt-1 leading-6">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Opportunity Title */}

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-3">
                  <Icon
                    icon="solar:pen-bold"
                    className="text-primary text-lg"
                  />
                  Opportunity Title
                </label>

                <div className="relative group">
                  <div
                    className="
      absolute
      left-5
      top-1/2
      -translate-y-1/2
      text-gray-400
      group-focus-within:text-primary
      transition-colors
    "
                  >
                    <Icon
                      icon="solar:clipboard-text-bold"
                      className="text-xl"
                    />
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Need a 30-Second AI Generated Advertisement..."
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
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

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted">
                    Choose a short and attractive campaign title.
                  </p>

                  <span className="text-xs font-semibold text-gray-400">
                    {form.title.length}/100
                  </span>
                </div>
              </div>

              {/* Description */}

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-3">
                  <Icon
                    icon="solar:document-text-bold"
                    className="text-lg text-primary"
                  />
                  Campaign Description
                </label>

                <div className="relative group">
                  <div className="absolute top-5 left-5 text-gray-400 group-focus-within:text-primary transition-colors">
                    <Icon icon="solar:document-add-bold" className="text-xl" />
                  </div>

                  <textarea
                    required
                    rows={6}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Explain your campaign, creator requirements, deliverables, content style, expectations and any important instructions..."
                    className="
        w-full
        rounded-2xl
        border
        border-purple-800
        bg-white
        pl-14
        pr-5
        py-4
        text-sm
        leading-4
        font-medium
        placeholder:text-gray-400
        resize-none
        transition-all
        duration-300

        focus:outline-none
        focus:border-primary
        focus:ring-4
        focus:ring-purple-100
      "
                  />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted">
                    Add complete campaign details to receive better creator
                    applications.
                  </p>

                  <span className="text-xs font-semibold text-gray-400">
                    {form.description.length}/1000
                  </span>
                </div>
              </div>

              {/* Category + Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category */}

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-3">
                    <Icon
                      icon="solar:widget-5-bold"
                      className="text-lg text-primary"
                    />
                    Category
                  </label>

                  <div className="relative group">
                    {/* Left Icon */}

                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                      <Icon
                        icon="solar:widget-5-bold"
                        className="text-xl text-gray-400 group-focus-within:text-primary transition-colors"
                      />
                    </div>

                    {/* Select */}

                    <select
                      required
                      value={form.category}
                      onChange={(e) => update("category", e.target.value)}
                      className="
        relative
        z-10
        w-full
        h-14
        rounded-2xl
        border
        border-purple-100
        bg-white
        pl-14
        pr-12
        text-sm
        font-medium
        text-secondary
        cursor-pointer
        appearance-none
        transition-all
        duration-300

        hover:border-primary/40

        focus:outline-none
        focus:border-primary
        focus:ring-4
        focus:ring-purple-100
      "
                    >
                      <option value="">Select category</option>

                      {categoryOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    {/* Arrow */}

                    <Icon
                      icon="solar:alt-arrow-down-bold"
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-lg text-gray-400 pointer-events-none"
                    />
                  </div>

                  <p className="text-xs text-muted mt-2">
                    Select the most suitable category for your campaign.
                  </p>

                  {/* Custom Category */}

                  {form.category === "Other" && (
                    <div className="mt-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-3">
                        <Icon
                          icon="solar:pen-new-square-bold"
                          className="text-primary"
                        />
                        Custom Category
                      </label>

                      <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <Icon
                            icon="solar:pen-bold"
                            className="text-lg text-gray-400"
                          />
                        </div>

                        <input
                          type="text"
                          required
                          placeholder="Enter your category..."
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="
            w-full
            h-14
            rounded-2xl
            border
            border-purple-100
            bg-purple-50/30
            pl-14
            pr-5
            text-sm
            font-medium

            transition-all
            duration-300

            focus:outline-none
            focus:border-primary
            focus:ring-4
            focus:ring-purple-100
          "
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Platform */}

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-3">
                    <Icon
                      icon="solar:smartphone-bold"
                      className="text-lg text-primary"
                    />
                    Platform
                  </label>

                  <div className="relative group">
                    {/* Left Icon */}

                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                      <Icon
                        icon="solar:smartphone-bold"
                        className="text-xl text-gray-400 group-focus-within:text-primary transition-colors"
                      />
                    </div>

                    {/* Select */}

                    <select
                      required
                      value={form.platform}
                      onChange={(e) => update("platform", e.target.value)}
                      className="
        relative
        z-10
        w-full
        h-14
        rounded-2xl
        border
        border-purple-100
        bg-white
        pl-14
        pr-12
        text-sm
        font-medium
        text-secondary
        cursor-pointer
        appearance-none

        transition-all
        duration-300

        hover:border-primary/40

        focus:outline-none
        focus:border-primary
        focus:ring-4
        focus:ring-purple-100
      "
                    >
                      <option value="">Select platform</option>

                      {platformOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    {/* Arrow */}

                    <Icon
                      icon="solar:alt-arrow-down-bold"
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-lg text-gray-400 pointer-events-none"
                    />
                  </div>

                  <p className="text-xs text-muted mt-2">
                    Select the platform where creators will publish the
                    campaign.
                  </p>

                  {/* Custom Platform */}

                  {form.platform === "Other" && (
                    <div className="mt-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-3">
                        <Icon
                          icon="solar:pen-new-square-bold"
                          className="text-primary"
                        />
                        Custom Platform
                      </label>

                      <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                          <Icon
                            icon="solar:pen-bold"
                            className="text-lg text-gray-400"
                          />
                        </div>

                        <input
                          type="text"
                          required
                          placeholder="Enter platform name..."
                          value={customPlatform}
                          onChange={(e) => setCustomPlatform(e.target.value)}
                          className="
            w-full
            h-14
            rounded-2xl
            border
            border-purple-100
            bg-purple-50/30
            pl-14
            pr-5
            text-sm
            font-medium

            transition-all
            duration-300

            focus:outline-none
            focus:border-primary
            focus:ring-4
            focus:ring-purple-100
          "
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Budget + Deadline */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Budget */}

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-3">
                    <Icon
                      icon="solar:wallet-money-bold"
                      className="text-lg text-primary"
                    />
                    Campaign Budget
                  </label>

                  <div className="relative group">
                    {/* PKR Badge */}

                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-primary text-xs font-black">
                        PKR
                      </span>
                    </div>

                    <input
                      type="number"
                      required
                      min="100"
                      placeholder="5000"
                      value={form.budget}
                      onChange={(e) => update("budget", e.target.value)}
                      className="
          w-full
          h-14
          rounded-2xl
          border
          border-purple-100
          bg-white
          pl-20
          pr-5
          text-sm
          font-semibold
          text-secondary

          transition-all
          duration-300

          hover:border-primary/40

          focus:outline-none
          focus:border-primary
          focus:ring-4
          focus:ring-purple-100
        "
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted">
                      Total amount allocated for creators.
                    </p>

                    <span className="text-xs font-bold text-primary">
                      Min PKR 100
                    </span>
                  </div>
                </div>

                {/* Deadline */}

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-secondary mb-3">
                    <Icon
                      icon="solar:calendar-bold"
                      className="text-lg text-primary"
                    />
                    Application Deadline
                  </label>

                  <div className="relative group">
                    {/* Left Icon */}

                    <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Icon
                        icon="solar:calendar-bold"
                        className="text-xl text-gray-400"
                      />
                    </div>

                    <input
                      type="number"
                      required
                      min="1"
                      max="60"
                      placeholder="7"
                      value={form.deadline}
                      onChange={(e) => update("deadline", e.target.value)}
                      className="
          w-full
          h-14
          rounded-2xl
          border
          border-purple-100
          bg-white
          pl-14
          pr-20
          text-sm
          font-semibold
          text-secondary

          transition-all
          duration-300

          hover:border-primary/40

          focus:outline-none
          focus:border-primary
          focus:ring-4
          focus:ring-purple-100
        "
                    />

                    {/* Days Badge */}

                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-primary text-xs font-bold">
                        Days
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted">
                      Applications remain open until the deadline.
                    </p>

                    <span className="text-xs font-bold text-primary">
                      Max 60 Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}

              <div className="mt-10 pt-8 border-t border-purple-100">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Preview */}

                  <div className="xl:col-span-2">
                    <div className="rounded-[28px] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-white overflow-hidden">
                      {/* Header */}

                      <div className="px-6 py-5 border-b border-purple-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                            <Icon
                              icon="solar:eye-bold"
                              className="text-2xl text-primary"
                            />
                          </div>

                          <div>
                            <h3 className="font-black text-secondary text-lg">
                              Opportunity Preview
                            </h3>

                            <p className="text-xs text-muted mt-1">
                              This is how creators will see your campaign.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Body */}

                      <div className="p-6 space-y-5">
                        <div>
                          <h2 className="text-xl font-black text-secondary break-words">
                            {form.title || "Your Campaign Title"}
                          </h2>

                          <p className="text-sm text-muted mt-3 leading-7">
                            {form.description ||
                              "Your campaign description will appear here after you complete the form."}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-primary text-sm font-bold">
                            <Icon icon="solar:widget-5-bold" />

                            {form.category || "Category"}
                          </span>

                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                            <Icon icon="solar:smartphone-bold" />

                            {form.platform || "Platform"}
                          </span>

                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-bold">
                            <Icon icon="solar:wallet-money-bold" />
                            PKR {form.budget || "0"}
                          </span>

                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 text-sm font-bold">
                            <Icon icon="solar:calendar-bold" />
                            {form.deadline || 0} Days
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Publish Card */}

                  <div>
                    <div className="rounded-[28px] border border-purple-100 bg-white p-6 shadow-sm">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-purple-200 mb-5">
                        <Icon
                          icon="solar:rocket-bold"
                          className="text-3xl text-white"
                        />
                      </div>

                      <h3 className="text-lg font-black text-secondary">
                        Ready to Publish?
                      </h3>

                      <p className="text-sm text-muted mt-2 leading-6">
                        Once published, verified creators can discover and apply
                        for your campaign.
                      </p>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Icon
                            icon="solar:verified-check-bold"
                            className="text-green-600 text-lg"
                          />

                          <span className="text-secondary">
                            Visible to verified creators
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <Icon
                            icon="solar:shield-check-bold"
                            className="text-green-600 text-lg"
                          />

                          <span className="text-secondary">
                            Secure application process
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <Icon
                            icon="solar:chart-bold"
                            className="text-green-600 text-lg"
                          />

                          <span className="text-secondary">
                            Track creator applications
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="
            w-full
            h-14
            mt-8
            rounded-2xl
            bg-gradient-to-r
            from-primary
            to-primary-dark
            text-white
            font-black
            text-sm

            flex
            items-center
            justify-center
            gap-3

            hover:shadow-xl
            hover:shadow-purple-200
            hover:scale-[1.02]

            active:scale-100

            transition-all
            duration-300

            disabled:opacity-60
            disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
                      >
                        {loading ? (
                          <>
                            <Icon
                              icon="svg-spinners:180-ring"
                              className="text-xl"
                            />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Icon
                              icon="solar:rocket-bold"
                              className="text-xl"
                            />
                            Publish Opportunity
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// import { useState } from 'react'
// import DashboardLayout from '../shared/DashboardLayout'
// import { brandLinks } from './BrandDashboard'
// import axios from '../../../utils/axios'

// const platforms   = ['Instagram', 'TikTok', 'YouTube', 'Facebook', 'Twitter', 'Snapchat']
// const categories  = ['AI Marketing', 'Fashion', 'Food', 'Tech', 'Lifestyle', 'Gaming', 'Fitness', 'Travel', 'Beauty', 'Education']

// export default function PostOpportunity() {
//   const [form, setForm] = useState({
//     title: '', description: '', category: '',
//     budget: '', deadline: '', platform: '',
//   })
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const [error, setError]     = useState('')

//   const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)
//     try {
//       await axios.post('/opportunities', {
//         ...form,
//         budget:   Number(form.budget),
//         deadline: Number(form.deadline),
//       })
//       setSuccess(true)
//       setForm({ title: '', description: '', category: '', budget: '', deadline: '', platform: '' })
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to post opportunity.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <DashboardLayout links={brandLinks}>
//       <div className="mb-6">
//         <h1 className="text-2xl font-black text-secondary">Post Opportunity</h1>
//         <p className="text-muted text-sm mt-1">Create a new campaign for creators to apply.</p>
//       </div>

//       <div className="max-w-2xl">
//         <div className="bg-card rounded-2xl border border-border shadow-card p-8">

//           {success && (
//             <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
//               ✅ Opportunity posted successfully! Creators can now apply.
//             </div>
//           )}

//           {error && (
//             <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">

//             {/* Title */}
//             <div>
//               <label className="block text-sm font-semibold text-secondary mb-1.5">
//                 Opportunity Title
//               </label>
//               <input
//                 type="text" required
//                 placeholder="e.g. Need a 30-Second AI Generated Ad"
//                 value={form.title} onChange={e => update('title', e.target.value)}
//                 className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-semibold text-secondary mb-1.5">
//                 Description
//               </label>
//               <textarea
//                 required rows={4}
//                 placeholder="Describe what you need, target audience, content style..."
//                 value={form.description} onChange={e => update('description', e.target.value)}
//                 className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light resize-none"
//               />
//             </div>

//             {/* Category + Platform */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-secondary mb-1.5">Category</label>
//                 <select
//                   required value={form.category} onChange={e => update('category', e.target.value)}
//                   className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
//                 >
//                   <option value="">Select category</option>
//                   {categories.map(c => <option key={c} value={c}>{c}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-secondary mb-1.5">Platform</label>
//                 <select
//                   required value={form.platform} onChange={e => update('platform', e.target.value)}
//                   className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white"
//                 >
//                   <option value="">Select platform</option>
//                   {platforms.map(p => <option key={p} value={p}>{p}</option>)}
//                 </select>
//               </div>
//             </div>

//             {/* Budget + Deadline */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold text-secondary mb-1.5">
//                   Budget (PKR)
//                 </label>
//                 <div className="relative">
//                   <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">PKR</span>
//                   <input
//                     type="number" required min="100"
//                     placeholder="e.g. 5000"
//                     value={form.budget} onChange={e => update('budget', e.target.value)}
//                     className="w-full pl-12 pr-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-secondary mb-1.5">
//                   Deadline (Days)
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number" required min="1" max="60"
//                     placeholder="e.g. 7"
//                     value={form.deadline} onChange={e => update('deadline', e.target.value)}
//                     className="w-full px-4 py-3 text-sm border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
//                   />
//                   <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted">days</span>
//                 </div>
//               </div>
//             </div>

//             {/* Preview Card */}
//             {form.title && (
//               <div className="bg-primary-light rounded-xl p-4 border border-primary/20">
//                 <p className="text-xs font-bold text-primary mb-2">Preview</p>
//                 <p className="text-sm font-bold text-secondary">{form.title}</p>
//                 {form.budget && (
//                   <p className="text-xs text-muted mt-1">
//                     Budget: <span className="text-primary font-bold">PKR {Number(form.budget).toLocaleString()}</span>
//                     {form.deadline && <span> · Deadline: {form.deadline} days</span>}
//                     {form.platform && <span> · {form.platform}</span>}
//                   </p>
//                 )}
//               </div>
//             )}

//             <button
//               type="submit" disabled={loading}
//               className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors shadow-purple text-sm disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Posting...' : '📢 Post Opportunity'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </DashboardLayout>
//   )
// }
