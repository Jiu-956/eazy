import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MODEL: AppRouteRecordRaw = {
  path: '/model',
  name: 'model',
  component: DEFAULT_LAYOUT,
  // ensure visiting /model redirects to index and menu doesn't show children
  redirect: '/model/index',
  meta: {
    locale: 'menu.model',
    requiresAuth: true,
    icon: 'icon-robot',
    hideChildrenInMenu: true,
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
