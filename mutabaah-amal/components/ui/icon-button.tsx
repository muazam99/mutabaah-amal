import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, icon, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={`flex justify-between items-center ${className}`}
        {...props}
      >
        <span>{children}</span>
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = "IconButton"

