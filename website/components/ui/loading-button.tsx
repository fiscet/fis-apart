import * as React from "react"
import { Button, type ButtonProps } from "./button"
import { cn } from "@/lib/utils"

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
  spinnerClassName?: string
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading = false, disabled, children, className, spinnerClassName, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(isLoading && "cursor-wait opacity-90", className)}
        disabled={isLoading || disabled}
        aria-busy={isLoading ? true : undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className={cn("mr-2 inline-block animate-spin", spinnerClassName)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="inline-flex items-center">{children}</span>
          </>
        ) : (
          children
        )}
      </Button>
    )
  }
)
LoadingButton.displayName = "LoadingButton"


