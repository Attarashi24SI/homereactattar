import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        success: "border-transparent bg-teal-100 text-teal-700 dark:bg-emerald-500/20 dark:text-emerald-300",
        warning: "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        destructive: "border-transparent bg-red-100 text-red-700 dark:bg-rose-500/20 dark:text-rose-300",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({ className, variant, ...props }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
