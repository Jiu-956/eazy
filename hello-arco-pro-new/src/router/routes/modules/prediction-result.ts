import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PREDICTION_RESULT: AppRouteRecordRaw = {
  path: '/prediction-result',
  name: 'predictionResult',
  component: DEFAULT_LAYOUT,
  // ensure visiting /prediction-result redirects to index and menu doesn't show children
  redirect: '/prediction-result/index',
  meta: {
    locale: 'menu.predictionResult',
    requiresAuth: true,
    icon: 'icon-check-circle',
    hideChildrenInMenu: true,
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
