import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { config } from '@/lib/config'
import type { CropAnalysisResult } from '@/lib/utils'

// Maximum time for the entire process
const PROCESS_TIMEOUT = 30000; // 30 seconds

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let timeoutId: NodeJS.Timeout | undefined;
  
  try {
    console.log('API route handler started');
    
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        console.log('Request timed out');
        reject(new Error('Processing timeout - please try with a smaller image or try again'));
      }, PROCESS_TIMEOUT);
    });

    const processPromise = (async () => {
      try {
        console.log('Starting request processing');
        
        const { imageData, cropType, fieldName } = req.body;

        if (!imageData) {
          console.error('Image data is missing from request');
          throw new Error('No image data provided');
        }

        // Log image data size for debugging
        const imageSize = imageData.length;
        console.log(`Image data size: ${Math.round(imageSize / 1024)}KB`);

        if (!config.nebius.apiKey || !config.nebius.endpoint) {
          console.error('API configuration missing:', {
            hasApiKey: !!config.nebius.apiKey,
            hasEndpoint: !!config.nebius.endpoint
          });
          throw new Error('API configuration is missing');
        }

        console.log('Initializing OpenAI client with Nebius configuration');
        // Initialize OpenAI client with Nebius configuration
        const client = new OpenAI({
          apiKey: config.nebius.apiKey,
          baseURL: config.nebius.endpoint,
          timeout: 25000, // 25 second timeout for OpenAI calls
        });

        // First Vision Analysis for Disease Detection
        console.log('Starting crop disease analysis...');
        try {
          const visionResponse = await client.chat.completions.create({
            model: 'Qwen/Qwen2-VL-7B-Instruct',
            temperature: 0.2,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `Analyze this crop image for disease detection. The crop type is: ${cropType || 'unknown'}.

Please provide a detailed assessment including:
1. Whether the crop appears healthy or diseased
2. If diseased, identify the specific disease with high confidence
3. Visible symptoms present in the image (spots, wilting, discoloration, etc.)
4. Severity level of the disease or issue (mild, moderate, severe)
5. Growth stage of the crop

Format your response as a structured analysis that can be parsed, including:
- Health Status: (healthy/warning/critical)
- Confidence Level: (percentage)
- Disease Name: (if applicable)
- Symptoms: (detailed list)
- Severity: (mild/moderate/severe)
- Growth Stage: (description)
- Additional Notes: (any other relevant observations)`
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: imageData
                    }
                  }
                ]
              }
            ]
          });

          console.log('Vision API response received:', {
            hasChoices: !!visionResponse.choices,
            choicesLength: visionResponse.choices?.length,
            hasContent: !!visionResponse.choices?.[0]?.message?.content
          });

          if (!visionResponse.choices?.[0]?.message?.content) {
            console.error('Vision API returned empty response');
            throw new Error('No analysis could be generated from image');
          }

          const analysisText = visionResponse.choices[0].message.content.trim();
          console.log('Initial analysis:', analysisText.substring(0, 200) + '...');

          // Get detailed recommendations based on the analysis
          console.log('Requesting detailed recommendations...');
          const recommendationsResponse = await client.chat.completions.create({
            model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
            temperature: 0.3,
            messages: [
              {
                role: 'user',
                content: `Based on this crop analysis, provide detailed treatment recommendations and management strategies:

Analysis: ${analysisText}
Crop Type: ${cropType || 'unknown'}

Return your response as a JSON object with this exact structure:
{
  "status": "healthy" | "warning" | "critical",
  "confidence": <number 0-100>,
  "diseaseName": "<disease name or null if healthy>",
  "description": "<detailed description>",
  "recommendations": ["<action item 1>", "<action item 2>", ...],
  "preventiveMeasures": ["<preventive measure 1>", "<preventive measure 2>", ...],
  "expectedRecoveryTime": "<time estimate>",
  "potentialYieldImpact": "<impact description>"
}

Be specific and practical with the recommendations.`
              }
            ]
          });

          console.log('Recommendations response received:', {
            hasChoices: !!recommendationsResponse.choices,
            choicesLength: recommendationsResponse.choices?.length,
            hasContent: !!recommendationsResponse.choices?.[0]?.message?.content
          });

          if (!recommendationsResponse.choices?.[0]?.message?.content) {
            console.error('Recommendations API returned empty response');
            throw new Error('Failed to generate recommendations');
          }

          const recommendationsText = recommendationsResponse.choices[0].message.content;
          console.log('Raw recommendations:', recommendationsText.substring(0, 200) + '...');

          // Parse the recommendations JSON
          let analysisResult: CropAnalysisResult;
          try {
            // Extract JSON from the response
            const jsonMatch = recommendationsText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              console.error('No JSON object found in recommendations response');
              throw new Error('No valid JSON found in recommendations');
            }
            console.log('Attempting to parse JSON response');
            analysisResult = JSON.parse(jsonMatch[0]);
            console.log('Successfully parsed analysis result:', {
              status: analysisResult.status,
              confidence: analysisResult.confidence,
              hasDisease: !!analysisResult.diseaseName
            });
          } catch (error) {
            console.error('Error parsing recommendations:', error);
            // Log the failed parsing attempt
            console.log('Failed to parse text:', recommendationsText);
            
            // Provide a fallback result
            console.log('Using fallback analysis result');
            analysisResult = {
              status: 'warning',
              confidence: 70,
              diseaseName: null,
              description: "The analysis detected potential issues but couldn't provide a definitive diagnosis.",
              recommendations: [
                "Consult with a local agricultural expert",
                "Monitor the affected areas closely",
                "Ensure proper irrigation and nutrition"
              ],
              preventiveMeasures: [
                "Maintain good field hygiene",
                "Practice crop rotation",
                "Use disease-resistant varieties when possible"
              ],
              expectedRecoveryTime: "Unknown without specific diagnosis",
              potentialYieldImpact: "Impact uncertain - monitor closely"
            };
          }

          console.log('Preparing successful response');
          return res.status(200).json({
            success: true,
            analysisResult,
            rawAnalysis: analysisText
          });

        } catch (visionError) {
          console.error('Error during vision analysis:', visionError);
          throw visionError;
        }

      } catch (error) {
        console.error('Process error:', error);
        // Log the full error details
        if (error instanceof Error) {
          console.error({
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause: error.cause
          });
        }
        throw error;
      }
    })();

    console.log('Waiting for process or timeout');
    // Race between timeout and processing
    await Promise.race([processPromise, timeoutPromise]);
    console.log('Request completed successfully');
    clearTimeout(timeoutId);

  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      console.error({
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
    }
    clearTimeout(timeoutId);
    
    return res.status(error instanceof Error && error.message.includes('timeout') ? 504 : 500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      details: error instanceof Error ? error.stack : undefined
    });
  }
}
