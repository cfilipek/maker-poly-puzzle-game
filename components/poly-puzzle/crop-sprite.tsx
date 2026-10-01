import Image from 'next/image'
import { cn } from '@/lib/utils'
import { CROPS, type CropId } from '@/lib/game'

export function CropSprite({ crop, className, sizes = '120px' }: { crop: CropId; className?: string; sizes?: string }) {
  const def = CROPS[crop]
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={def.sprite || '/placeholder.svg'}
        alt=""
        fill
        sizes={sizes}
        draggable={false}
        className="pixelated scale-125 object-cover"
      />
    </div>
  )
}

export function Stars({ count, className }: { count: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${count} base yield`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} aria-hidden="true" className="inline-block size-2 bg-accent ring-1 ring-foreground" />
      ))}
    </span>
  )
}
