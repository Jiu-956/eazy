import axios from 'axios';

export interface ModelRecord {
  id: string;
  name: string;
  type: 'lstm' | 'gru' | 'transformer';
  description: string;
  status: 'training' | 'ready' | 'error';
  accuracy: number;
  parameters: {
    inputLength: number;
    outputLength: number;
    hiddenSize: number;
    numLayers: number;
    dropout: number;
  };
  metrics: {
    mse: number;
    mae: number;
    r2: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ModelParams extends Partial<ModelRecord> {
  current: number;
  pageSize: number;
}

export interface ModelListRes {
  list: ModelRecord[];
  total: number;
}

export function queryModelList(params: ModelParams) {
  return axios.get<ModelListRes>('/api/v1/models', {
    params,
  });
}

export function getModelDetail(id: string) {
  return axios.get<ModelRecord>(`/api/v1/models/${id}`);
}

export interface ModelCreateParams {
  name: string;
  type: 'lstm' | 'gru' | 'transformer';
  description: string;
  parameters: {
    inputLength: number;
    outputLength: number;
    hiddenSize: number;
    numLayers: number;
    dropout: number;
  };
}

export function createModel(data: ModelCreateParams) {
  return axios.post<{ modelId: string; status: string }>(
    '/api/v1/models',
    data
  );
}

export function trainModel(id: string, data: { datasetId: string; epochs: number }) {
  return axios.post<{ taskId: string; status: string }>(
    `/api/v1/models/${id}/train`,
    data
  );
}

export function deleteModel(id: string) {
  return axios.delete(`/api/v1/models/${id}`);
}

export function downloadModel(id: string) {
  return axios.get(`/api/v1/models/${id}/download`, {
    responseType: 'blob',
  });
}
