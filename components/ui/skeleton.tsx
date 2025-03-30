import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60 dark:bg-gray-800/60",
        "after:absolute after:inset-0 after:content-[''] after:bg-gradient-to-r after:from-transparent after:via-muted-foreground/10 after:to-transparent after:animate-[shimmer_2s_infinite]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
