import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, LogOut, Shield } from 'lucide-react'
import Card from '../components/Card'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-textDark">Profile</h1>

      <Card className="p-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-textDark">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3" /> Verified Account
            </span>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-5">
          {[
            { icon: User, label: 'Full Name', value: user?.name },
            { icon: Mail, label: 'Email Address', value: user?.email },
            { icon: Calendar, label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-textDark">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-textDark mb-4">Account Actions</h3>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </Card>
    </div>
  )
}
