/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const infoRouter = {
  path: '/information',
  component: Layout,
  redirect: '/information/index',
  name: 'InformationManage',
  meta: {
    title: '信息管理',
    icon: 'documentation'
  },
  children: [
    {
      path: 'customer-info',
      component: () => import('@/views/info/CustomerInfoManage.vue'),
      name: 'CustomerInfoManage',
      meta: {
        title: '客户信息管理',
        icon: 'peoples',
        roles: ['ADMIN', 'USER'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'supplier-info',
      component: () => import('@/views/info/SupplierInfoManage.vue'),
      name: 'SupplierInfoManage',
      meta: {
        title: '供应商信息管理',
        icon: 'international',
        roles: ['ADMIN', 'USER'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'shop-info',
      component: () => import('@/views/info/ShopInfoManage.vue'),
      name: 'ShopInfoManage',
      meta: {
        title: '门店信息管理',
        icon: 'guide',
        roles: ['ADMIN', 'USER'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'warehouse-info',
      component: () => import('@/views/info/WarehouseInfoManage.vue'),
      name: 'WarehouseInfoManage',
      meta: {
        title: '仓库信息管理',
        icon: 'component',
        roles: ['ADMIN', 'USER'] // or you can only set roles in sub nav
      }
    }
  ]
}
export default infoRouter
