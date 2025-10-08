import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DATASET: AppRouteRecordRaw = {
  path: '/dataset',
  name: 'dataset',
  component: DEFAULT_LAYOUT,
  // ensure visiting /dataset redirects to index and menu doesn't show children
  redirect: '/dataset/index',
  meta: {
    locale: 'menu.dataset',
    requiresAuth: true,
    icon: 'icon-storage',
    hideChildrenInMenu: true,
    order: 1,
  },
  children: [
    {
      path: 'index',
      name: 'DatasetIndex',
      component: () => import('@/views/visualization/data-analysis/index.vue'),
      meta: {
        locale: 'menu.dataset.index',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DATASET;
