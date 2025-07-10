"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ComponentProps } from "react"

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  pending?: boolean
}

export default function LoadingButton({
  children,
  pending = false,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={pending || disabled} data-loading={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
