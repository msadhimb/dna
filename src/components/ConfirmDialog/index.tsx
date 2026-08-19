"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConfirmStore } from "@/components/ConfirmDialog/store";

export const ConfirmDialog = () => {
  const { isOpen, options, onConfirm, onCancel } = useConfirmStore();
  const [current, setCurrent] = useState(options);

  useEffect(() => {
    if (options) setCurrent(options);
  }, [options]);

  if (!current) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="font-manrope w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-semibold text-white">
            {current.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {current.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="py-3">
          <AlertDialogCancel onClick={onCancel} variant="outline">
            {current.cancelText || "Batal"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-400 text-white hover:bg-red-500">
            {current.confirmText || "Ya, Lanjutkan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
