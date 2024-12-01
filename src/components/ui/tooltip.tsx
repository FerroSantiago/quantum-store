"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>((
  { className, sideOffset = 4, ...props },
  ref
) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-black text-white px-3 py-1.5 text-sm",
      className
    )}
    {...props}
  />
))

TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }