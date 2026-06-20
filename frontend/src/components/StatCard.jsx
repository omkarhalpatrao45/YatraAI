export default function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-emerald-500/10 text-green-600 dark:text-emerald-400',
    orange: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  }
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-5 shadow-sm">
      <div className={`flex-shrink-0 rounded-lg p-2.5 ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-300">{label}</p>
        <p className="truncate text-xl font-bold text-textDark dark:text-zinc-100">{value}</p>
      </div>
    </div>
  )
}
