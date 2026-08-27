import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  type ItemCreate,
  type ItemUpdate,
  itemsCreateItem,
  itemsDeleteItem,
  itemsReadItems,
  itemsUpdateItem,
} from '@/client'
import useCustomToast from '@/hooks/useCustomToast'
import { handleError } from '@/utils'

export const itemsQueryOptions = {
  queryKey: ['items'] as const,
  queryFn: () => itemsReadItems({ query: { skip: 0, limit: 100 } }),
}

export const useItemsSuspenseQuery = () => {
  return useSuspenseQuery(itemsQueryOptions)
}

export const useCreateItemMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (data: ItemCreate) => itemsCreateItem({ body: data }),
    onSuccess: () => {
      showSuccessToast(t('items.successCreated'))
      options?.onSuccess?.()
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: itemsQueryOptions.queryKey })
    },
  })
}

export const useUpdateItemMutation = (
  id: string,
  options?: { onSuccess?: () => void },
) => {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (data: ItemUpdate) =>
      itemsUpdateItem({ path: { id }, body: data }),
    onSuccess: () => {
      showSuccessToast(t('items.successUpdated'))
      options?.onSuccess?.()
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: itemsQueryOptions.queryKey })
    },
  })
}

export const useDeleteItemMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => itemsDeleteItem({ path: { id } }),
    onSuccess: () => {
      showSuccessToast(t('items.successDeleted'))
      options?.onSuccess?.()
    },
    onError: handleError.bind(showErrorToast),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: itemsQueryOptions.queryKey })
    },
  })
}
