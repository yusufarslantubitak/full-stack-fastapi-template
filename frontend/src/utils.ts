export interface ApiError {
  detail?: string | Array<{ msg?: string; [key: string]: unknown }>
  message?: string
  status?: number
  [key: string]: unknown
}

function extractErrorMessage(err: unknown): string {
  if (!err) return 'Something went wrong.'
  if (typeof err === 'string') return err
  if (typeof err === 'object') {
    const anyErr = err as Record<string, any>
    const errDetail =
      anyErr.detail || anyErr.body?.detail || anyErr.response?.data?.detail
    if (Array.isArray(errDetail) && errDetail.length > 0) {
      return (
        errDetail[0].msg || errDetail[0].message || JSON.stringify(errDetail[0])
      )
    }
    if (typeof errDetail === 'string') {
      return errDetail
    }
    if (anyErr.message && typeof anyErr.message === 'string') {
      return anyErr.message
    }
  }
  return 'Something went wrong.'
}

export const handleError = function (
  this: (msg: string) => void,
  err: unknown,
) {
  const errorMessage = extractErrorMessage(err)
  this(errorMessage)
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
