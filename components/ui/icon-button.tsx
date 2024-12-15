import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"

interface IconButtonProps extends ButtonProps {
  children: React.ReactNode
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={`flex justify-between items-center ${className}`}
        {...props}
      >
        <span>{children}</span>
      </Button>
    )
  }
)
IconButton.displayName = "IconButton"

