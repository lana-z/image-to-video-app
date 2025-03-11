interface VideoGenerationMetrics {
  fileSize: number;
  seed: number;
  inferenceTime?: number;
}

interface VideoGenerationResponse {
  videoUrl: string;
  format: string;
  requestId: string;
  metrics?: VideoGenerationMetrics;
}

interface VideoGenerationError {
  error: string;
  details?: {
    message: string;
    body?: unknown;
    status?: number;
  };
}

export type GenerationProgress = {
  step: "editing" | "animating" | "completed";
  message: string;
};

export async function generateVideo(
  image: File, 
  text: string,
  onProgress?: (progress: GenerationProgress) => void
): Promise<VideoGenerationResponse> {
  try {
    // Create a FormData object to send the image and text
    const formData = new FormData()
    formData.append("image", image)
    formData.append("text", text)

    // Notify progress
    onProgress?.({ 
      step: "editing",
      message: "Step 1: Editing image based on prompt..."
    })

    // Send the request to our API route
    const response = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      const error = data as VideoGenerationError
      throw new Error(error.error || "Failed to generate video")
    }

    // Notify completion
    onProgress?.({ 
      step: "completed",
      message: "Video generation completed!"
    })

    // Validate response data
    if (!data.videoUrl || !data.format || !data.requestId) {
      console.error("Invalid response data:", data)
      throw new Error("Invalid response from server")
    }

    return {
      videoUrl: data.videoUrl,
      format: data.format,
      requestId: data.requestId,
      metrics: data.metrics
    }
  } catch (error) {
    console.error("Error in generateVideo:", error)
    throw error
  }
}
