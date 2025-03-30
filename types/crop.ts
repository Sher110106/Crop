export interface ImageAnalysis {
  timestamp: Date;
  analysisResults: {
    diseaseDetection?: {
      detectedDisease: string;
      confidence: number;
      affectedArea: string;
      severity: 'low' | 'medium' | 'high';
    };
    growthMetrics?: {
      plantHeight?: number;
      leafColor: string;
      leafCondition: string;
      estimatedMaturity: number;
    };
    soilAnalysis?: {
      soilColor: string;
      moistureLevel: string;
      visibleIssues: string[];
    };
    generalHealth: {
      score: number;
      observations: string[];
      concerns: string[];
    };
  };
  aiRecommendations: string[];
  weatherConditions?: {
    temperature: number;
    humidity: number;
    lightLevel: string;
  };
}

export interface TimelineEntry {
  id: string;
  timestamp: Date;
  type: 'sowing' | 'inspection' | 'treatment' | 'harvest' | 'other';
  data: {
    imageAnalysis?: ImageAnalysis;
    notes?: string;
    measurements?: {
      soilPH?: number;
      temperature?: number;
      humidity?: number;
    };
    treatments?: {
      type: string;
      product: string;
      quantity: string;
    }[];
  };
  contextualInsights: {
    comparisonWithPrevious?: {
      healthTrend: 'improving' | 'declining' | 'stable';
      significantChanges: string[];
    };
    seasonalContext: {
      expectedCondition: string;
      deviationsFromNormal: string[];
    };
  };
}

export interface CropRecord {
  id: string;
  name: string;
  variety: string;
  fieldLocation: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  sowingDate: Date;
  expectedHarvestDate: Date;
  timeline: TimelineEntry[];
  currentHealth: number;
  status: 'active' | 'harvested' | 'failed';
  healthTrends: {
    lastUpdate: Date;
    weeklyScores: number[];
    majorEvents: {
      date: Date;
      event: string;
      impact: 'positive' | 'negative' | 'neutral';
    }[];
  };
}