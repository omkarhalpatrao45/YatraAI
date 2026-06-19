export function getApiError(error, fallback = 'Something went wrong') {
  const detail = error?.response?.data?.detail

  if (typeof detail === 'string') return detail

  if (Array.isArray(detail)) {
    return detail
      .map(item => item?.msg || item?.message)
      .filter(Boolean)
      .join(', ') || fallback
  }

  if (error?.message === 'Network Error') {
    return 'Cannot reach the server. Make sure the backend is running.'
  }

  return fallback
}
