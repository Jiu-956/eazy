import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PREDICTION: AppRouteRecordRaw = {
  path: '/prediction',
  name: 'prediction',
  component: DEFAULT_LAYOUT,
  // ensure visiting /prediction redirects to index and menu doesn't show children
  redirect: '/prediction/index',
  meta: {
    locale: 'menu.prediction',
    requiresAuth: true,
    icon: 'icon-file',
    hideChildrenInMenu: true,
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
