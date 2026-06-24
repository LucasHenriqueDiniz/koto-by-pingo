import { cn } from "@/lib/utils"
import { MaterialIcon } from "@/components/ui/MaterialIcon"

function Spinner({ className }: React.ComponentProps<"span">) {
  return (
    <MaterialIcon
      name="progress_activity"
      role="status"
      aria-label="Loading"
      className={cn("animate-spin", className)}
    />
  )
}

export { Spinner }
