import Image from "next/image"

interface ImagePreviewProps {
  src: string
  alt: string
}

export function ImagePreview({ src, alt }: ImagePreviewProps) {
  return (
    <div className="relative w-full h-full rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
      <Image src={src || "/placeholder.svg?height=128&width=128"} alt={alt} fill className="object-cover" />
    </div>
  )
}

