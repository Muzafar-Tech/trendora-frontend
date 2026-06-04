import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using Trendora, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform.',
  },
  {
    title: '2. User Accounts',
    content: 'You must provide accurate information during registration. You are responsible for maintaining the confidentiality of your account credentials. Trendora reserves the right to suspend accounts that violate our policies.',
  },
  {
    title: '3. Creator Responsibilities',
    content: 'Creators must deliver agreed work on time and to the quality described in the collaboration. Misrepresenting followers, engagement, or capabilities is strictly prohibited and may result in account termination.',
  },
  {
    title: '4. Brand Responsibilities',
    content: 'Brands must provide clear project requirements and pay agreed amounts promptly. Brands must approve or request revisions within 5 business days of work submission. Failure to respond may result in automatic approval.',
  },
  {
    title: '5. Payments & Commission',
    content: 'Trendora charges a 10% commission on all successful collaborations. This is deducted automatically before releasing payment to the creator. All payments are processed through verified channels.',
  },
  {
    title: '6. Dispute Resolution',
    content: 'In case of a dispute, both parties must first attempt to resolve it through the platform chat. If unresolved, either party can raise a formal dispute which will be reviewed by our admin team within 48 hours.',
  },
  {
    title: '7. Prohibited Activities',
    content: 'Users may not engage in fraud, spam, harassment, or any illegal activities on the platform. Off-platform payments to avoid commission charges are strictly prohibited.',
  },
  {
    title: '8. Termination',
    content: 'Trendora reserves the right to terminate any account at any time for violations of these terms. Users may also delete their accounts at any time through account settings.',
  },
  {
    title: '9. Limitation of Liability',
    content: 'Trendora is a platform facilitating connections and is not liable for the quality of work delivered or disputes between creators and brands beyond the scope of our dispute resolution process.',
  },
  {
    title: '10. Contact',
    content: 'For any questions regarding these Terms, contact us at trendaoraofficial@gmail.com.',
  },
]

export default function Terms() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <section className="pt-24 pb-14 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
            Terms & Conditions
          </h1>
          <p className="text-muted text-sm">Last updated: June 2025</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {sections.map((s, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border shadow-card">
              <h2 className="font-bold text-secondary text-base mb-3">{s.title}</h2>
              <p className="text-sm text-muted leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}