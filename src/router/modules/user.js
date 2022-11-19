/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/index',
  name: '用户管理',
  meta: {
    title: '用户管理',
    icon: 'user'
  },
  children: [
    {
      path: 'user-info',
      component: () => import('@/views/user/UserInfoManage'),
      name: '用户管理',
      meta: {
        title: '用户管理',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }
  ]
}
export default userRouter
