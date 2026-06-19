export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon className="w-16 h-16 text-gray-300 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-500 mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  )
}
