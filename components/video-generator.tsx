"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImagePreview } from "@/components/image-preview"
import { VideoPlayer } from "@/components/video-player"
import { generateVideo } from "@/lib/generate-video"

export function VideoGenerator() {
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [text, setText] = useState("")
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoFormat, setVideoFormat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!image) {
      setError("Please upload an image")
      return
    }

    if (!text) {
      setError("Please enter a text prompt")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setProgress("Generating video...")
      const result = await generateVideo(image, text)
      setVideoUrl(result.videoUrl)
      setVideoFormat(result.format)
      setProgress(null)
    } catch (error: any) {
      setError(error.message || "Failed to generate video")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setImagePreview(null)
    setText("")
    setVideoUrl(null)
    setVideoFormat(null)
    setError(null)
    setProgress(null)
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold mb-2">How it Works</h2>
        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <li>Upload an image</li>
          <li>Describe how you want to transform it</li>
          <li>Click Generate Video</li>
          <li>Wait for it</li>
          <li>Download it</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-2">
            Upload Image
          </label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
        </div>

        {imagePreview && (
          <ImagePreview src={imagePreview} alt="Preview" />
        )}

        <div>
          <label htmlFor="text" className="block text-sm font-medium mb-2">
            Prompt
          </label>
          <div className="mb-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              For best results:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Describe the transformation or action clearly (e.g., 'make the subject dance')</li>
              </ul>
            </p>
          </div>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: 'Twist off the lid on the jar' or 'Transform into a cartoon character'"
            disabled={loading}
            className="h-32"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {progress && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-md text-sm">
            {progress}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Generate Video"}
          </Button>
          {videoUrl && (
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </form>

      {videoUrl && (
        <div>
          <h2 className="text-lg font-medium mb-4">Generated Video</h2>
          <VideoPlayer src={videoUrl} format={videoFormat || undefined} />
        </div>
      )}
    </div>
  )
}
