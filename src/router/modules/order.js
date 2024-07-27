import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/index',
  name: 'OrderManage',
  meta: {
    title: '订单管理',
    icon: 'money'
  },
  children: [
    {
      path: 'dispatch-order-manage',
      component: () => import('@/views/order/DispatchOrderManage.vue'),
      name: 'DispatchOrderManage',
      meta: {
        title: '发货订单管理',
        roles: ['ADMIN', 'USER']
      }
    },
    {
      path: 'replenish-order-manage',
      component: () => import('@/views/order/ReplenishOrderManage.vue'),
      name: 'ReplenishOrderManage',
      meta: {
        title: '进货订单管理',
        roles: ['ADMIN', 'USER']
      }
    }
  ]
}
export default orderRouter
