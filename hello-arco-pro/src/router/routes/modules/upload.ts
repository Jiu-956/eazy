import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const UPLOAD: AppRouteRecordRaw = {
  path: '/upload',
  name: 'upload',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.upload',
    requiresAuth: true,
    icon: 'icon-upload',
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