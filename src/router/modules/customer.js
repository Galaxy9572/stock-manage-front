/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const customerRouter = {
  path: '/customer',
  component: Layout,
  redirect: '/customer/index',
  name: 'CustomerManage',
  meta: {
    title: '客户管理',
    icon: 'peoples'
  },
  children: [
    {
      path: 'customer-info',
      component: () => import('@/views/customer/CustomerInfoManage'),
      name: 'CustomerInfoManage',
      meta: {
        title: '客户信息管理',
        roles: ['admin', 'user'] // or you can only set roles in sub nav
      }
    }
  ]
}
export default customerRouter
