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
      name: '商品信息管理',
      meta: {
        title: '商品信息管理',
        roles: ['admin']
      }
    },
    {
      path: 'goods-stock',
      component: () => import('@/views/goods/GoodsStockManage'),
      name: '商品库存管理',
      meta: {
        title: '商品库存管理',
        roles: ['admin']
      }
    },
    {
      path: 'stock-warning',
      component: () => import('@/views/goods/StockWarningManage'),
      name: '库存告警管理',
      meta: {
        title: '库存告警管理',
        roles: ['admin']
      }
    },
    {
      path: 'goods-type',
      component: () => import('@/views/goods/GoodsTypeManage'),
      name: '商品类型管理',
      meta: {
        title: '商品类型管理',
        roles: ['admin']
      }
    },
    {
      path: 'goods-unit',
      component: () => import('@/views/goods/GoodsUnitManage'),
      name: '商品计量单位管理',
      meta: {
        title: '商品计量单位管理',
        roles: ['admin']
      }
    },
  ]
}
export default goodsRouter
