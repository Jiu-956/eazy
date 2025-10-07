import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PREDICTION: AppRouteRecordRaw = {
  path: '/prediction',
  name: 'prediction',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.prediction',
    requiresAuth: true,
    icon: 'icon-trend-chart',
    order: 3,
  },
  children: [
    {
      path: 'index',
      name: 'PredictionIndex',
      component: () => import('@/views/prediction/index.vue'),
      meta: {
        locale: 'menu.prediction.index',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default PREDICTION;
