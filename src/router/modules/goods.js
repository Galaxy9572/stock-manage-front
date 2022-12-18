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
      path: 'goods-info',
      component: () => import('@/views/goods/GoodsInfoManage'),
      name: 'GoodsInfoManage',
      meta: {
        title: '商品信息管理',
        icon: 'list',
        roles: ['admin', 'user']
      }
    },
    {
      path: 'stock-warning',
      component: () => import('@/views/goods/StockWarningManage'),
      name: 'StockWarningManage',
      meta: {
        title: '库存告警管理',
        icon: 'chart',
        roles: ['admin', 'user']
      }
    },
    {
      path: 'goods-type',
      component: () => import('@/views/goods/GoodsTypeManage'),
      name: 'GoodsTypeManage',
      meta: {
        title: '商品类型管理',
        icon: 'tree',
        roles: ['admin', 'user']
      }
    },
    {
      path: 'goods-unit',
      component: () => import('@/views/goods/GoodsUnitManage'),
      name: 'GoodsUnitManage',
      meta: {
        title: '商品计量单位管理',
        icon: 'tree-table',
        roles: ['admin', 'user']
      }
    },
  ]
}
export default goodsRouter
