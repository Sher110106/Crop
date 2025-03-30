# Crop Lifecycle Implementation

## 1. Database Schema (MongoDB)

Create `models/crop.ts`:
```typescript
import mongoose from 'mongoose';

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

const cropSchema = new mongoose.Schema({
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

export const Crop = mongoose.models.Crop || mongoose.model('Crop', cropSchema);
```

## 2. API Implementation

Create `pages/api/crops/[id]/timeline.ts`:
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { Crop } from '@/models/crop';
import { connect } from '@/lib/mongodb';
import { getSession } from 'next-auth/react';
import { processImage } from '@/lib/image-processor';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  await connect();

  if (req.method === 'POST') {
    try {
      const crop = await Crop.findById(id);
      if (!crop) {
        return res.status(404).json({ error: 'Crop not found' });
      }

      const { type, data } = req.body;
      const timelineEntry = {
        timestamp: new Date(),
        type,
        data
      };

      if (data.image) {
        // Process image and get analysis
        const imageAnalysis = await processImage(data.image);
        timelineEntry.data.imageAnalysis = imageAnalysis;
        
        // Update crop health based on analysis
        crop.currentHealth = imageAnalysis.analysisResults.generalHealth.score;
        crop.healthTrends.lastUpdate = new Date();
        crop.healthTrends.weeklyScores.push(crop.currentHealth);
        
        // Add significant events if detected
        if (imageAnalysis.analysisResults.diseaseDetection?.severity === 'high') {
          crop.healthTrends.majorEvents.push({
            date: new Date(),
            event: `Disease detected: ${imageAnalysis.analysisResults.diseaseDetection.detectedDisease}`,
            impact: 'negative'
          });
        }
      }

      crop.timeline.push(timelineEntry);
      await crop.save();

      res.status(200).json(timelineEntry);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add timeline entry' });
    }
  } else if (req.method === 'GET') {
    try {
      const crop = await Crop.findById(id);
      if (!crop) {
        return res.status(404).json({ error: 'Crop not found' });
      }

      const { startDate, endDate, type } = req.query;
      let timeline = crop.timeline;

      if (startDate && endDate) {
        timeline = timeline.filter(entry => 
          entry.timestamp >= new Date(startDate as string) &&
          entry.timestamp <= new Date(endDate as string)
        );
      }

      if (type) {
        timeline = timeline.filter(entry => entry.type === type);
      }

      res.status(200).json(timeline);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch timeline' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```

## 3. Image Processing Implementation

Create `lib/image-processor.ts`:
```typescript
import { ImageAnalysis } from '@/types/crop';
import * as tf from '@tensorflow/tfjs-node';
import { loadModel } from '@/lib/ml-models';

export async function processImage(imageBuffer: Buffer): Promise<ImageAnalysis> {
  // Load ML models
  const [
    diseaseModel,
    growthModel,
    healthModel
  ] = await Promise.all([
    loadModel('disease-detection'),
    loadModel('growth-assessment'),
    loadModel('health-assessment')
  ]);

  // Convert image to tensor
  const imageTensor = tf.node.decodeImage(imageBuffer);
  
  // Run disease detection
  const diseaseResults = await runDiseaseDetection(diseaseModel, imageTensor);
  
  // Run growth assessment
  const growthResults = await runGrowthAssessment(growthModel, imageTensor);
  
  // Run health assessment
  const healthResults = await runHealthAssessment(healthModel, imageTensor);

  // Get current weather data
  const weather = await getCurrentWeather();

  const analysis: ImageAnalysis = {
    timestamp: new Date(),
    analysisResults: {
      diseaseDetection: diseaseResults,
      growthMetrics: growthResults,
      generalHealth: healthResults
    },
    aiRecommendations: generateRecommendations({
      diseaseResults,
      growthResults,
      healthResults,
      weather
    }),
    weatherConditions: weather
  };

  return analysis;
}

async function runDiseaseDetection(model: tf.LayersModel, image: tf.Tensor3D) {
  const predictions = await model.predict(image);
  // Process predictions and return disease detection results
  return {
    detectedDisease: 'leaf_blight', // Example
    confidence: 0.85,
    affectedArea: 'upper_leaves',
    severity: 'medium'
  };
}

async function runGrowthAssessment(model: tf.LayersModel, image: tf.Tensor3D) {
  const predictions = await model.predict(image);
  // Process predictions and return growth metrics
  return {
    plantHeight: 45,
    leafColor: 'healthy_green',
    leafCondition: 'normal',
    estimatedMaturity: 65
  };
}

async function runHealthAssessment(model: tf.LayersModel, image: tf.Tensor3D) {
  const predictions = await model.predict(image);
  // Process predictions and return health assessment
  return {
    score: 75,
    observations: ['Good leaf density', 'Normal coloration'],
    concerns: ['Minor stress signs in new growth']
  };
}

function generateRecommendations(data: any) {
  // Generate AI recommendations based on all available data
  return [
    'Consider increasing irrigation frequency',
    'Monitor for early signs of disease spread',
    'Plan preventive fungicide application within 7 days'
  ];
}
```

## 4. Component Implementation

Create `components/CropTimeline.tsx`:
```typescript
import { useState } from 'react';
import { TimelineEntry } from '@/types/crop';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface CropTimelineProps {
  entries: TimelineEntry[];
  onEntryClick: (entry: TimelineEntry) => void;
}

export function CropTimeline({ entries, onEntryClick }: CropTimelineProps) {
  const [filter, setFilter] = useState('all');

  const filteredEntries = entries.filter(entry => 
    filter === 'all' ? true : entry.type === filter
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crop Timeline</CardTitle>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('inspection')}
            className={`px-3 py-1 rounded ${filter === 'inspection' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            Inspections
          </button>
          <button 
            onClick={() => setFilter('treatment')}
            className={`px-3 py-1 rounded ${filter === 'treatment' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            Treatments
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredEntries.map((entry, index) => (
            <div
              key={entry.id}
              className="flex gap-4 p-4 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => onEntryClick(entry)}
            >
              <div className="flex-shrink-0 w-16 text-sm text-gray-500">
                {format(new Date(entry.timestamp), 'MMM d')}
              </div>
              <div>
                <div className="font-medium">{entry.type}</div>
                {entry.data.imageAnalysis && (
                  <div className="mt-2 space-y-2">
                    <div className="text-sm">
                      Health Score: {entry.data.imageAnalysis.analysisResults.generalHealth.score}
                    </div>
                    {entry.data.imageAnalysis.aiRecommendations.map((rec, i) => (
                      <div key={i} className="text-sm text-gray-600">
                        • {rec}
                      </div>
                    ))}
                  </div>
                )}
                {entry.data.treatments?.map((treatment, i) => (
                  <div key={i} className="mt-2 text-sm">
                    {treatment.type}: {treatment.product} ({treatment.quantity})
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 5. Integration in Crop Detail Page

Update `pages/dashboard/crop/[id].tsx`:
```typescript
// Import the CropTimeline component and add it to the layout
import { CropTimeline } from '@/components/CropTimeline';

// Add to the existing CropDetailPage component:
const [selectedEntry, setSelectedEntry] = useState(null);

// Add this section in the JSX:
<div className="mt-6">
  <CropTimeline 
    entries={crop.timeline} 
    onEntryClick={entry => setSelectedEntry(entry)} 
  />
</div>

{selectedEntry && (
  <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Timeline Entry Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        {/* Render detailed entry information */}
      </div>
    </DialogContent>
  </Dialog>
)}
```

## 6. Package Dependencies

Add to `package.json`:
```json
{
  "dependencies": {
    "@tensorflow/tfjs-node": "^4.15.0",
    "date-fns": "^2.30.0",
    "mongoose": "^8.0.0"
  }
}
```

## Next Steps

1. Set up MongoDB connection
2. Train and deploy ML models
3. Implement image upload in the frontend
4. Add error handling and loading states
5. Implement caching for timeline data
6. Add data export functionality
