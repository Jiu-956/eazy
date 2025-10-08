import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const UPLOAD: AppRouteRecordRaw = {
  path: '/upload',
  name: 'upload',
  component: DEFAULT_LAYOUT,
  // ensure visiting /upload redirects to index and menu doesn't show children
  redirect: '/upload/index',
  meta: {
    locale: 'menu.upload',
    requiresAuth: true,
    icon: 'icon-upload',
    hideChildrenInMenu: true,
    order: 3,
  },
  children: [
    {
      path: 'index',
      name: 'UploadIndex',
      component: () => import('@/views/upload/index.vue'),
      meta: {
        locale: 'menu.upload.index',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default UPLOAD;
