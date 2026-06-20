export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="w-12 h-12 text-gray-300 dark:text-zinc-600 mb-4" />}
      <h3 className="text-base font-semibold text-gray-500 dark:text-zinc-300 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 dark:text-zinc-400 mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  )
}
