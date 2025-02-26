"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="relative overflow-hidden rounded-lg border border-zinc-800 backdrop-blur-xs bg-neutral-950/60 p-4 shadow-sm">
            <div className="flex gap-2">
              <div className="flex flex-col">
                {title && <ToastTitle className="text-sm body text-zinc-200">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-sm body-light text-zinc-500">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
