import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DATASET: AppRouteRecordRaw = {
  path: '/dataset',
  name: 'dataset',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.dataset',
    requiresAuth: true,
    icon: 'icon-storage',
    order: 1,
  },
  children: [
    {
      path: 'index',
      name: 'DatasetIndex',
      component: () => import('@/views/dataset/index.vue'),
      meta: {
        locale: 'menu.dataset.index',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DATASET;
