import axios from 'axios';

export interface PredictionTaskRecord {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  datasetId: string;
  modelId: string;
  progress: number;
  parameters: {
    predictionLength: number;
    confidence: number;
  };
  createdAt: string;
  completedAt?: string;
}

export interface PredictionParams extends Partial<PredictionTaskRecord> {
  current: number;
  pageSize: number;
}

export interface PredictionListRes {
  list: PredictionTaskRecord[];
  total: number;
}

export function queryPredictionList(params: PredictionParams) {
  return axios.get<PredictionListRes>('/api/v1/predictions', {
    params,
  });
}

export function getPredictionDetail(id: string) {
  return axios.get<PredictionTaskRecord>(`/api/v1/predictions/${id}`);
}

export interface PredictionCreateParams {
  name: string;
  datasetId: string;
  modelId: string;
  parameters: {
    predictionLength: number;
    confidence: number;
  };
}

export function createPrediction(data: PredictionCreateParams) {
  return axios.post<{ predictionId: string; status: string; estimatedTime: number }>(
    '/api/v1/predictions',
    data
  );
}

export interface PredictionResult {
  predictionId: string;
  status: 'completed' | 'failed';
  results: {
    predictions: Array<{
      timestamp: string;
      value: number;
      confidence: number;
      upperBound: number;
      lowerBound: number;
    }>;
    metrics: {
      rmse: number;
      mape: number;
    };
  };
  visualization: {
    chartData: string; // base64 encoded image
  };
}

export function getPredictionResults(id: string) {
  return axios.get<PredictionResult>(`/api/v1/predictions/${id}/results`);
}

export function deletePrediction(id: string) {
  return axios.delete(`/api/v1/predictions/${id}`);
}

export function downloadPredictionResults(id: string) {
  return axios.get(`/api/v1/predictions/${id}/download`, {
    responseType: 'blob',
  });
}
