"use client"

import Image from "next/image"
import type { Mineral } from "@/lib/types"

interface MineralImageProps {
  mineral: Mineral
  className?: string
  priority?: boolean
}

export function MineralImage({ mineral, className = "", priority = false }: MineralImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={mineral.image}
        alt={`Especimen de ${mineral.name}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        className="object-cover"
        priority={priority}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
    </div>
  )
}
