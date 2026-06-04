import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from './AdminDashboard'

export default function ManageCollaborations() {
  return (
    <DashboardLayout links={adminLinks}>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">All Collaborations</h1>
        <p className="text-muted text-sm mt-1">Monitor all active and completed collaborations.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🤝</div>
          <p className="font-medium text-secondary">No collaborations yet</p>
          <p className="text-muted text-sm mt-1">Collaborations will appear here when creators and brands connect.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}