/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const supplierRouter = {
  path: '/supplier',
  component: Layout,
  redirect: '/supplier/index',
  name: '供应商管理',
  meta: {
    title: '供应商管理',
    icon: 'international'
  },
  children: [
    {
      path: 'supplier-info',
      component: () => import('@/views/supplier/SupplierInfoManage'),
      name: '供应商管理',
      meta: {
        title: '供应商管理',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }
  ]
}
export default supplierRouter
