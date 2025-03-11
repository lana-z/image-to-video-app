# Image to Video Transformer

A Next.js application that transforms static images into videos based on text prompts using AI models from fal.ai.


## 🌟 Features

- Upload images
- Transform images into videos using text prompts
- Real-time processing status updates
- Download generated videos in MP4 format

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with TypeScript and React
- **Styling**: Tailwind CSS with custom components
- **API Integration**: fal.ai for AI video generation
- **Deployment**: Vercel [TODO]

## 📋 Prerequisites

- Node.js 18.0 or later
- npm or yarn
- fal.ai API key ([Get one here](https://fal.ai))

## 🔧 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/image-to-video-app.git
   cd image-to-video-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your fal.ai API key
   ```
   FAL_KEY=your_fal_ai_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser


## 🧪 API Parameters

Current model parameters (can be adjusted in `app/api/generate/route.ts`):

```typescript
{
  prompt: text.slice(0, 500),
  negative_prompt: "low quality, distorted, unnatural, blurry",
  num_inference_steps: 30,
  guidance_scale: 7.5,
  seed: -1,
  width: 512,
  height: 384
}
```

## 📝 Version History

### v0.2 - Subject Transformation Model (Current)
**Branch**: `feat/minimax-video-01-subject-reference`  
**Model**: `fal-ai/minimax/video-01-subject-reference`  
**Features**:
- Direct image transformations using text prompts
- Optimized for subject modifications (e.g., object state changes)
- Parameters:
  ```yaml
  num_inference_steps: 30
  guidance_scale: 7.5
  resolution: 512x384
  ```
**Note**: Untested and may require adjustments for optimal results.

### v0.1 - Initial Motion Model 
**Model**: Stable Video Diffusion (`110602490-svd`)   
**Features**:
- Add subtle motion to static images

