import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

export interface DatasetRecord {
  id: string;
  name: string;
  description: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  size: number;
  recordCount: number;
  format: 'csv' | 'json' | 'xlsx' | 'tfb';
  createdAt: string;
  updatedAt: string;
}

export interface DatasetParams extends Partial<DatasetRecord> {
  current: number;
  pageSize: number;
}

export interface DatasetListRes {
  list: DatasetRecord[];
  total: number;
}

export function queryDatasetList(params: DatasetParams) {
  return axios.get<DatasetListRes>('/api/v1/datasets', {
    params,
  });
}

export function getDatasetDetail(id: string) {
  return axios.get<DatasetRecord>(`/api/v1/datasets/${id}`);
}

export interface DatasetUploadParams {
  file: File;
  name: string;
  description: string;
  format: 'csv' | 'json' | 'xlsx' | 'tfb';
}

export function uploadDataset(data: DatasetUploadParams) {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('format', data.format);
  
  return axios.post<{ datasetId: string; uploadId: string; status: string }>(
    '/api/v1/datasets/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export interface DatasetConvertParams {
  targetFormat: 'tfb' | 'csv' | 'json' | 'xlsx';
  options: {
    timeColumn: string;
    valueColumns: string[];
  };
}

export function convertDatasetFormat(id: string, data: DatasetConvertParams) {
  return axios.post<{ convertedDatasetId: string; status: string }>(
    `/api/v1/datasets/${id}/convert`,
    data
  );
}

export function deleteDataset(id: string) {
  return axios.delete(`/api/v1/datasets/${id}`);
}

export function downloadDataset(id: string) {
  return axios.get(`/api/v1/datasets/${id}/download`, {
    responseType: 'blob',
  });
}
