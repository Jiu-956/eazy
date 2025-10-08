import type { RouteRecordRaw } from 'vue-router';
// 导入所有需要的业务模块路由
import DASHBOARD from './modules/dashboard';
import DATASET from './modules/dataset';
import MODEL from './modules/model';
import UPLOAD from './modules/upload';
import PREDICTION from './modules/prediction';
import PREDICTION_RESULT from './modules/prediction-result';
import USER from './modules/user';

export const appRoutes: RouteRecordRaw[] = [
  DASHBOARD,
  DATASET,
  MODEL,
  UPLOAD,
  PREDICTION,
  PREDICTION_RESULT,
  USER,
];

export const appExternalRoutes: RouteRecordRaw[] = [];
