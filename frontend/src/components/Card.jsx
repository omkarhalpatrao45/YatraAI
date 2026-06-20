export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}
