import { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Gemini API with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { imageData, cropType } = req.body

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' })
    }

    // Convert base64 to binary data
    const imageBytes = Buffer.from(imageData.split(',')[1], 'base64')

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Prepare the prompt based on crop type
    const prompt = cropType 
      ? `Analyze this ${cropType} plant image and provide a detailed health assessment. Include:
         1. Overall health status (Healthy/Moderate/Unhealthy)
         2. Specific issues or diseases identified
         3. Severity of any problems
         4. Recommended actions
         5. Preventive measures
         Format the response in a clear, structured way.`
      : `Analyze this plant image and provide a detailed health assessment. Include:
         1. Overall health status (Healthy/Moderate/Unhealthy)
         2. Specific issues or diseases identified
         3. Severity of any problems
         4. Recommended actions
         5. Preventive measures
         Format the response in a clear, structured way.`

    // Generate content
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBytes.toString('base64')
        }
      }
    ])

    const response = await result.response
    const text = response.text()

    // Parse the response to extract structured data
    const healthStatus = text.match(/Overall health status:?\s*(Healthy|Moderate|Unhealthy)/i)?.[1] || 'Unknown'
    const issues = text.match(/Specific issues or diseases identified:?\s*([^]*?)(?=Severity|Recommended|$)/i)?.[1]?.trim() || 'None identified'
    const severity = text.match(/Severity:?\s*([^]*?)(?=Recommended|$)/i)?.[1]?.trim() || 'Unknown'
    const recommendations = text.match(/Recommended actions:?\s*([^]*?)(?=Preventive|$)/i)?.[1]?.trim() || 'No specific recommendations'
    const preventive = text.match(/Preventive measures:?\s*([^]*?)$/i)?.[1]?.trim() || 'No preventive measures specified'

    return res.status(200).json({
      success: true,
      analysis: {
        healthStatus,
        issues,
        severity,
        recommendations,
        preventive,
        fullText: text
      }
    })

  } catch (error) {
    console.error('Error processing image:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to process image',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
