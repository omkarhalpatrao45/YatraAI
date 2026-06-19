export default function LoadingSpinner({ size = 'md', label = 'Loading' }) {
  const sizes = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-3 p-4" role="status">
      <div className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${sizes[size]}`} />
      {label && <span className="text-sm text-gray-400">{label}</span>}
    </div>
  )
}
