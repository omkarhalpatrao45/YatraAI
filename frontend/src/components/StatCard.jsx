export default function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-primary',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  }
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`flex-shrink-0 rounded-lg p-3 ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="truncate text-xl font-bold text-textDark sm:text-2xl">{value}</p>
      </div>
    </div>
  )
}
