import { Edit2, Trash2 } from 'lucide-react'
import EmptyState from './EmptyState'
import { formatCurrency, formatDate } from '../utils/formatters'
import { CATEGORY_COLORS } from '../utils/expenseConstants'

export default function ExpenseTable({ expenses, onEdit, onDelete, showTrip = false }) {
  const showActions = Boolean(onEdit || onDelete)

  if (!expenses.length) {
    return (
      <EmptyState
        title="No expenses yet"
        description="Add expenses as you spend to keep the trip budget honest."
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950 text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Expense</th>
            {showTrip && <th className="px-4 py-3 font-semibold">Trip</th>}
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 text-right font-semibold">Amount</th>
            {showActions && <th className="px-4 py-3 text-right font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {expenses.map(expense => (
            <tr key={expense.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-zinc-900">
              <td className="px-4 py-3 font-medium text-textDark">{expense.title}</td>
              {showTrip && <td className="px-4 py-3 text-gray-500">{expense.trip_destination || 'Selected trip'}</td>}
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other}`}>
                  {expense.category}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{formatDate(expense.expense_date)}</td>
              <td className="px-4 py-3 text-right font-semibold text-textDark">{formatCurrency(expense.amount)}</td>
              {showActions && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        aria-label={`Edit ${expense.title}`}
                        onClick={() => onEdit(expense)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-primary"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        aria-label={`Delete ${expense.title}`}
                        onClick={() => onDelete(expense)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
