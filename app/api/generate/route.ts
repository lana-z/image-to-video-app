import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"

async function bufferToBase64(buffer: ArrayBuffer, mimeType: string) {
  const base64 = Buffer.from(buffer).toString("base64")
  return `data:${mimeType};base64,${base64}`
}

interface FalApiResponse {
  data: {
    video: {
      url: string;
      content_type: string;
      file_name: string;
      file_size: number;
    };
    seed: number;
  };
  requestId: string;
  metrics?: {
    inference_time: number;
  };
}

interface SuccessResponse {
  videoUrl: string;
  format: string;
  requestId: string;
  metrics: {
    fileSize: number;
    seed: number;
    inferenceTime?: number;
  };
}

interface ErrorResponse {
  error: string;
  details?: {
    message: string;
    body?: unknown;
    status?: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const text = formData.get("text") as string

    if (!image || !text) {
      return NextResponse.json<ErrorResponse>({
        error: "Image and text are required"
      }, { status: 400 })
    }

    // Configure fal.ai client
    fal.config({
      credentials: process.env.FAL_KEY
    })

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64Image = await bufferToBase64(bytes, image.type)

    console.log("Starting video transformation with prompt:", text)

    try {
      const result = await fal.subscribe<FalApiResponse>("fal-ai/minimax/video-01-subject-reference", {
        input: {
          image: base64Image,
          prompt: text.slice(0, 500), // Limit prompt length
          negative_prompt: "low quality, distorted, unnatural, blurry",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          seed: -1,
          width: 512, // 512 ÷ 64 = 8
          height: 384 // 384 ÷ 64 = 6
        },
        onQueueUpdate: (update) => {
          if (update.status === "IN_QUEUE") {
            console.log("Queue position:", update.position)
          } else if (update.status === "COMPLETED") {
            console.log("Transformation completed in", update.metrics?.inference_time, "seconds")
          }
        }
      })

      console.log("Video transformation completed:", JSON.stringify(result, null, 2))

      return NextResponse.json<SuccessResponse>({
        videoUrl: result.data.video.url,
        format: result.data.video.content_type,
        requestId: result.requestId,
        metrics: {
          fileSize: result.data.video.file_size,
          seed: result.data.seed,
          inferenceTime: result.metrics?.inference_time
        }
      })
    } catch (apiError: any) {
      console.error("API Error details:", {
        name: apiError.name,
        message: apiError.message,
        status: apiError.status,
        body: apiError.body
      })

      return NextResponse.json<ErrorResponse>({
        error: `API Error: ${apiError.message}`,
        details: {
          message: apiError.message,
          body: apiError.body,
          status: apiError.status
        }
      }, { status: apiError.status || 500 })
    }
  } catch (error: any) {
    console.error("Error in video transformation:", error)
    return NextResponse.json<ErrorResponse>({
      error: error.message || "Failed to transform video",
      details: error
    }, { status: 500 })
  }
}
