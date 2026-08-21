"use client"

import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useConfirmStore } from "@/components/ConfirmDialog/store"

export const ConfirmDialog = () => {
  const { isOpen, options, onConfirm, onCancel } = useConfirmStore()
  const [current, setCurrent] = useState(options)

  useEffect(() => {
    if (options) setCurrent(options)
  }, [options])

  if (!current) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent size="lg">
        <AlertDialogHeader className="flex flex-col gap-5 py-3">
          <AlertDialogTitle className="text-muted font-bold dark:text-secondary text-2xl">
            {current.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {current.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="py-3 border-border bg-muted dark:bg-border">
          <AlertDialogCancel
            onClick={onCancel}
            variant={"destructive"}
            className="outline-0 cursor-pointer"
          >
            {current.cancelText || "Batal"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="cursor-pointer">
            {current.confirmText || "Ya, Lanjutkan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
