import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-gray-800",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 dark:bg-primary/80 dark:hover:bg-primary/70",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 dark:bg-red-900/80 dark:text-red-200 dark:hover:bg-red-900/70",
        outline: "text-foreground dark:text-gray-100",
        success: "border-transparent bg-green-500 text-white hover:bg-green-500/80 dark:bg-green-900/80 dark:text-green-200 dark:hover:bg-green-900/70",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80 dark:bg-yellow-900/80 dark:text-yellow-200 dark:hover:bg-yellow-900/70",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-500/80 dark:bg-blue-900/80 dark:text-blue-200 dark:hover:bg-blue-900/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
