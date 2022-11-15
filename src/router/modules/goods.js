/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const goodsRouter = {
  path: '/goods',
  component: Layout,
  redirect: '/goods/index',
  name: '商品管理',
  meta: {
    title: '商品管理',
    icon: 'shopping'
  },
  children: [
    {
      path: 'goods-type',
      component: () => import('@/views/goods/GoodsTypeManage'),
      name: '商品类型管理',
      meta: {
        title: '商品类型管理',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'goods-unit',
      component: () => import('@/views/goods/GoodsUnitManage'),
      name: '商品计量单位管理',
      meta: {
        title: '商品计量单位管理',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    },
  ]
}
export default goodsRouter
