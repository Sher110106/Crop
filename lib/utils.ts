import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { config } from "./config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Types for crop disease analysis
export interface CropAnalysisResult {
  status: "healthy" | "warning" | "critical";
  confidence: number;
  diseaseName: string | null;
  description: string;
  recommendations: string[];
  preventiveMeasures: string[];
  expectedRecoveryTime: string;
  potentialYieldImpact: string;
}

export interface ProcessImageResult {
  success: boolean;
  analysisResult?: CropAnalysisResult;
  rawAnalysis?: string;
  error?: string;
  message?: string;
}

export async function processImageWithNebius(imageData: string, cropType: string = 'unknown', fieldName: string = 'unknown'): Promise<ProcessImageResult> {
  try {
    const base64Image = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')
    
    // Validate image size
    const sizeInBytes = Buffer.from(base64Image, 'base64').length
    if (sizeInBytes > config.image.maxSize) {
      return {
        success: false,
        error: `Image size exceeds maximum allowed size of ${config.image.maxSize / 1024 / 1024}MB`
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch('/api/process-image/route', { // Updated endpoint path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: `data:image/jpeg;base64,${base64Image}`,
          cropType,
          fieldName
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response:', text);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      return data as ProcessImageResult;
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
        throw new Error('Request timed out - please try again');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process image'
    }
  }
}
