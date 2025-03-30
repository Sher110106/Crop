import mongoose from 'mongoose';
import type { CropRecord } from '@/types/crop';

const imageAnalysisSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  analysisResults: {
    diseaseDetection: {
      detectedDisease: String,
      confidence: Number,
      affectedArea: String,
      severity: { type: String, enum: ['low', 'medium', 'high'] }
    },
    growthMetrics: {
      plantHeight: Number,
      leafColor: String,
      leafCondition: String,
      estimatedMaturity: Number
    },
    soilAnalysis: {
      soilColor: String,
      moistureLevel: String,
      visibleIssues: [String]
    },
    generalHealth: {
      score: Number,
      observations: [String],
      concerns: [String]
    }
  },
  aiRecommendations: [String],
  weatherConditions: {
    temperature: Number,
    humidity: Number,
    lightLevel: String
  }
});

const timelineEntrySchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  type: { 
    type: String, 
    enum: ['sowing', 'inspection', 'treatment', 'harvest', 'other'],
    required: true 
  },
  data: {
    imageAnalysis: imageAnalysisSchema,
    notes: String,
    measurements: {
      soilPH: Number,
      temperature: Number,
      humidity: Number
    },
    treatments: [{
      type: String,
      product: String,
      quantity: String
    }]
  },
  contextualInsights: {
    comparisonWithPrevious: {
      healthTrend: { 
        type: String, 
        enum: ['improving', 'declining', 'stable'] 
      },
      significantChanges: [String]
    },
    seasonalContext: {
      expectedCondition: String,
      deviationsFromNormal: [String]
    }
  }
});

const cropSchema = new mongoose.Schema<CropRecord>({
  name: { type: String, required: true },
  variety: { type: String, required: true },
  fieldLocation: {
    name: { type: String, required: true },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  sowingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date, required: true },
  timeline: [timelineEntrySchema],
  currentHealth: { type: Number, required: true, min: 0, max: 100 },
  status: { 
    type: String, 
    enum: ['active', 'harvested', 'failed'],
    required: true
  },
  healthTrends: {
    lastUpdate: { type: Date, required: true },
    weeklyScores: [Number],
    majorEvents: [{
      date: Date,
      event: String,
      impact: { 
        type: String,
        enum: ['positive', 'negative', 'neutral']
      }
    }]
  }
});

export const Crop = mongoose.models.Crop || mongoose.model<CropRecord>('Crop', cropSchema);