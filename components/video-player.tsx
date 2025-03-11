interface VideoPlayerProps {
  src: string;
  format?: string;
}

export function VideoPlayer({ src, format = "video/mp4" }: VideoPlayerProps) {
  const isGif = format.includes("gif");

  return (
    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800">
      {isGif ? (
        <img 
          src={src} 
          alt="Generated animation" 
          className="w-full h-full object-contain"
        />
      ) : (
        <video 
          src={src} 
          controls 
          className="w-full h-full" 
          poster="/placeholder.svg?height=480&width=854" 
        />
      )}
    </div>
  )
}
