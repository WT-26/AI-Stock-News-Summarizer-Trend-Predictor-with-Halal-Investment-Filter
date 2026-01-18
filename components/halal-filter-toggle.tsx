"use client"

import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HalalFilterToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function HalalFilterToggle({ enabled, onToggle }: HalalFilterToggleProps) {
  return (
    <Button
      onClick={() => onToggle(!enabled)}
      className={`halal-filter-toggle transition-all duration-300 ${
        enabled ? "active" : ""
      }`}
      variant={enabled ? "default" : "outline"}
    >
      <Leaf
        className={`h-4 w-4 mr-2 transition-all duration-300 ${
          enabled ? "text-white" : "text-[var(--success)]"
        }`}
      />
      <span className={enabled ? "text-white" : "text-[var(--success)]"}>
        {enabled ? "Halal Certified" : "Halal Filter"}
      </span>
    </Button>
  )
}
