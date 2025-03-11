import { VideoGenerator } from "@/components/video-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-slate-900 dark:text-slate-50">AI Video Generator</h1>
          <p className="text-center mb-8 text-slate-600 dark:text-slate-400">
            Upload an image and add text to generate an AI video
          </p>

          <VideoGenerator />
        </div>
      </div>
    </main>
  )
}

