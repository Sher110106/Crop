import * as tf from '@tensorflow/tfjs-node';

const MODEL_PATHS = {
  'disease-detection': 'models/disease-detection/model.json',
  'growth-assessment': 'models/growth-assessment/model.json',
  'health-assessment': 'models/health-assessment/model.json'
};

const modelCache = new Map<string, tf.LayersModel>();

export async function loadModel(modelName: keyof typeof MODEL_PATHS): Promise<tf.LayersModel> {
  if (modelCache.has(modelName)) {
    return modelCache.get(modelName)!;
  }

  try {
    const model = await tf.loadLayersModel(`file://${MODEL_PATHS[modelName]}`);
    modelCache.set(modelName, model);
    return model;
  } catch (error) {
    console.error(`Error loading model ${modelName}:`, error);
    throw new Error(`Failed to load model ${modelName}`);
  }
}