"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

interface HalalFilterToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function HalalFilterToggle({ enabled, onToggle }: HalalFilterToggleProps) {
  return (
    <Button variant={enabled ? "default" : "outline"} onClick={() => onToggle(!enabled)} className="gap-2">
      <Filter className="h-4 w-4" />
      Halal Filter
      {enabled && (
        <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-0">
          ON
        </Badge>
      )}
    </Button>
  )
}
