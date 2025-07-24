"use client"

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
import { ReactNode, createContext, useContext, useState } from "react"
import { useTranslations } from "next-intl"

interface AlertOptions {
  title?: string
  description: string
  actionText?: string
  onAction?: () => void
  secondaryActionText?: string
  onSecondaryAction?: () => void
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void
  showError: (
    message: string,
    options?: { secondaryActionText?: string; onSecondaryAction?: () => void }
  ) => void
  showSuccess: (message: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({
    description: "",
  })

  const showAlert = (options: AlertOptions) => {
    setAlertOptions(options)
    setIsOpen(true)
  }

  const showError = (
    message: string,
    options?: { secondaryActionText?: string; onSecondaryAction?: () => void }
  ) => {
    showAlert({
      title: t("error"),
      description: message,
      actionText: t("ok"),
      secondaryActionText: options?.secondaryActionText,
      onSecondaryAction: options?.onSecondaryAction,
    })
  }

  const showSuccess = (message: string) => {
    showAlert({
      title: t("success"),
      description: message,
      actionText: t("ok"),
    })
  }

  const handleAction = () => {
    setIsOpen(false)
    alertOptions.onAction?.()
  }

  const handleSecondaryAction = () => {
    setIsOpen(false)
    alertOptions.onSecondaryAction?.()
  }

  return (
    <AlertContext.Provider value={{ showAlert, showError, showSuccess }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            {alertOptions.title && (
              <AlertDialogTitle>{alertOptions.title}</AlertDialogTitle>
            )}
            <AlertDialogDescription>
              {alertOptions.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertOptions.secondaryActionText && (
              <AlertDialogCancel onClick={handleSecondaryAction}>
                {alertOptions.secondaryActionText}
              </AlertDialogCancel>
            )}
            <AlertDialogAction onClick={handleAction}>
              {alertOptions.actionText || "OK"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}
