import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/index',
  name: '订单管理',
  meta: {
    title: '订单管理',
    icon: 'money'
  },
  children: [
    {
      path: 'order-record',
      component: () => import('@/views/order/OrderRecordManage'),
      name: '订单记录管理',
      meta: {
        title: '订单记录管理',
        roles: ['admin']
      }
    }
  ]
}
export default orderRouter
