/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const infoRouter = {
  path: '/information',
  component: Layout,
  redirect: '/information/index',
  name: 'InformationManage',
  meta: {
    title: '资料管理',
    icon: 'peoples'
  },
  children: [
    {
      path: 'customer-info',
      component: () => import('@/views/info/CustomerInfoManage.vue'),
      name: 'CustomerInfoManage',
      meta: {
        title: '客户信息管理',
        icon: 'peoples',
        roles: ['admin', 'user'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'supplier-info',
      component: () => import('@/views/info/SupplierInfoManage.vue'),
      name: 'SupplierInfoManage',
      meta: {
        title: '供应商管理',
        icon: 'international',
        roles: ['admin', 'user'] // or you can only set roles in sub nav
      }
    }
  ]
}
export default infoRouter
