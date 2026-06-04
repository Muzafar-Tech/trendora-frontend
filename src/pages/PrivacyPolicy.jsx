import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const sections = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide during registration including your name, email address, social media profiles, and payment details. We also collect usage data such as pages visited, features used, and interactions on the platform.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'Your information is used to provide and improve our services, process payments, send notifications, verify accounts, resolve disputes, and ensure platform safety. We do not sell your personal data to third parties.',
  },
  {
    title: '3. Data Security',
    content: 'We use industry-standard encryption and security measures to protect your personal information. Passwords are hashed and never stored in plain text. Payment information is handled securely through verified payment channels.',
  },
  {
    title: '4. Cookies',
    content: 'Trendora uses cookies to maintain your session and improve your experience. You can disable cookies in your browser settings, but some features may not function properly without them.',
  },
  {
    title: '5. Third Party Services',
    content: 'We may use third-party services for analytics and payment processing. These services have their own privacy policies and we encourage you to review them.',
  },
  {
    title: '6. Your Rights',
    content: 'You have the right to access, update, or delete your personal information at any time through your account settings. You may also contact us directly to request data deletion.',
  },
  {
    title: '7. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on our platform.',
  },
  {
    title: '8. Contact',
    content: 'If you have any questions about this Privacy Policy, please contact us at trendaoraofficial@gmail.com.',
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <section className="pt-24 pb-14 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
            Privacy Policy
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