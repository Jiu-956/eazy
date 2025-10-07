import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PREDICTION_RESULT: AppRouteRecordRaw = {
  path: '/prediction-result',
  name: 'predictionResult',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.predictionResult',
    requiresAuth: true,
    icon: 'icon-chart-pie',
    order: 5,
  },
  children: [
    {
      path: 'index',
      name: 'PredictionResultIndex',
      component: () => import('@/views/prediction-result/index.vue'),
      meta: {
        locale: 'menu.predictionResult.index',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default PREDICTION_RESULT;