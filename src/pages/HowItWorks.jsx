import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const steps = [
  {
    number: '01',
    title: 'Brand Creates Account',
    desc: 'Brand signs up, verifies email, and sets up their company profile with logo and details.',
    icon: '🏢',
    side: 'left',
  },
  {
    number: '02',
    title: 'Brand Posts Opportunity',
    desc: 'Brand creates a campaign — title, budget, deadline, platform, and requirements. Goes live instantly.',
    icon: '📢',
    side: 'right',
  },
  {
    number: '03',
    title: 'Creators Browse & Apply',
    desc: 'Creators see all active opportunities. They can Accept, Reject, or send a Counter Offer.',
    icon: '🔍',
    side: 'left',
  },
  {
    number: '04',
    title: 'Negotiation Happens',
    desc: 'Brand reviews applications. They can Accept, Reject, or Counter Offer back to the creator.',
    icon: '🤝',
    side: 'right',
  },
  {
    number: '05',
    title: 'Collaboration Confirmed',
    desc: 'When both parties agree, collaboration is created and private chat is unlocked automatically.',
    icon: '✅',
    side: 'left',
  },
  {
    number: '06',
    title: 'Work & Payment',
    desc: 'Creator completes the work, brand approves, platform deducts commission and releases payment to creator.',
    icon: '💰',
    side: 'right',
  },
]

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-14 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Simple Process
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
            How Trendora Works
          </h1>
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto">
            From posting an opportunity to getting paid — everything in one platform.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Center line - only on md+ */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-light -translate-x-1/2" />

            <div className="space-y-10 md:space-y-16">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${
                    step.side === 'right' ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Card */}
                  <div className="w-full md:w-5/12">
                    <div className="bg-card rounded-2xl p-6 shadow-card border border-border hover:border-primary hover:shadow-purple transition-all">
                      <div className="text-3xl mb-3">{step.icon}</div>
                      <div className="text-xs font-bold text-primary mb-1">Step {step.number}</div>
                      <h3 className="text-lg font-bold text-secondary mb-2">{step.title}</h3>
                      <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-purple z-10">
                      {step.number}
                    </div>
                  </div>

                  {/* Empty space other side */}
                  <div className="hidden md:block w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-section">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-purple-200 mb-8">
            Join Trendora today and start collaborating with top brands and creators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-purple-50 transition-colors">
              Join as Creator
            </a>
            <a href="/signup" className="px-8 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              Join as Brand
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}