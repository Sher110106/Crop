import { CropAnalysisResult } from "@/lib/utils";

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  description: string;
  icon: string;
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'planting' | 'analysis' | 'treatment' | 'harvest' | 'observation';
  imageData?: {
    url: string;
    analysis?: CropAnalysisResult;
  };
  metrics?: {
    health: number;
    soilMoisture?: number;
    temperature?: number;
    rainfall?: number;
  };
  notes: string;
}

export interface CropHistory {
  date: string;
  health: number;
}

export interface Treatment {
  date: string;
  type: string;
  details: string;
}

export interface GrowthStage {
  current: string;
  week: number;
  totalWeeks: number;
  progress: number;
}

export interface WaterCycle {
  date: string;
  time: string;
  amount: string;
  priority: "high" | "medium" | "low";
}

export interface EnvironmentalData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  sunlight: number;
}

export interface UpcomingTask {
  type: string;
  date: string;
  priority: "high" | "medium" | "low";
  details: string;
}

export interface Recommendation {
  category: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  fieldSize: string;
  plantingDate: string;
  expectedHarvest: string;
  health: number;
  type: string;
  status: "healthy" | "warning" | "critical";
  lastUpdated: string;
  alerts: number;
  image: string;
  history: CropHistory[];
  treatments: Treatment[];
  notes: string;
  timeline: TimelineEvent[];
  location: Location;
  weather?: WeatherData;
  growthStage?: GrowthStage;
  nextWaterCycle?: WaterCycle;
  environmentalData?: EnvironmentalData;
  upcomingTasks?: UpcomingTask[];
  recommendations?: Recommendation[];
}