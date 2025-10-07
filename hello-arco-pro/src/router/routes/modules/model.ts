import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MODEL: AppRouteRecordRaw = {
  path: '/model',
  name: 'model',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.model',
    requiresAuth: true,
    icon: 'icon-robot',
    order: 2,
  },
  children: [
    {
      path: 'index',
      name: 'ModelIndex',
      component: () => import('@/views/model/index.vue'),
      meta: {
        locale: 'menu.model.index',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default MODEL;
