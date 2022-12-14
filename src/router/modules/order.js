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
      path: 'dispatch-manage',
      component: () => import('@/views/order/OrderManage.vue'),
      name: '订单管理',
      meta: {
        title: '订单管理',
        roles: ['admin']
      }
    },
  ]
}
export default orderRouter
