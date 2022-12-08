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
      path: 'replenish-manage',
      component: () => import('@/views/order/ReplenishManage.vue'),
      name: '发货管理',
      meta: {
        title: '发货管理',
        roles: ['admin']
      }
    },
    {
      path: 'dispatch-manage',
      component: () => import('@/views/order/DispatchManage.vue'),
      name: '进货管理',
      meta: {
        title: '进货管理',
        roles: ['admin']
      }
    },
  ]
}
export default orderRouter
