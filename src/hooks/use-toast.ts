"use client"

import { useCallback, useEffect, useState } from "react"

export type Toast = {
  id: string
  title?: string
  description?: string
}

type ToastInput = Omit<Toast, "id">

let toasts: Toast[] = []
const listeners = new Set<(value: Toast[]) => void>()

function emit() {
  listeners.forEach((listener) => listener([...toasts]))
}

export function toast(input: ToastInput) {
  const id = crypto.randomUUID()
  toasts = [...toasts, { ...input, id }]
  emit()
  return {
    id,
    dismiss: () => {
      toasts = toasts.filter((item) => item.id !== id)
      emit()
    },
  }
}

export function useToast() {
  const [items, setItems] = useState<Toast[]>(toasts)

  useEffect(() => {
    listeners.add(setItems)
    return () => {
      listeners.delete(setItems)
    }
  }, [])

  const dismiss = useCallback((id: string) => {
    toasts = toasts.filter((item) => item.id !== id)
    emit()
  }, [])

  return { toasts: items, toast, dismiss }
}
