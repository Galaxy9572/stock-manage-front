/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/index',
  name: 'SystemManage',
  meta: {
    title: '系统管理',
    icon: 'component'
  },
  children: [
    {
      path: 'user-info',
      component: () => import('@/views/system/UserInfoManage.vue'),
      name: 'UserInfoManage',
      meta: {
        title: '用户管理',
        icon: 'user',
        roles: ['ADMIN', 'USER'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'operation-log',
      component: () => import('@/views/system/OperationLog.vue'),
      name: 'OperationLog',
      meta: {
        title: '操作记录',
        icon: 'edit',
        roles: ['ADMIN', 'USER'] // or you can only set roles in sub nav
      }
    }
  ]
}
export default userRouter
