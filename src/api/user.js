import request from '@/utils/request'

export function addUserInfo(data) {
  return request({
    url: '/api/user/info',
    method: 'put',
    data
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/api/user/info',
    method: 'post',
    data
  })
}

export function deleteUserInfo(data) {
  return request({
    url: '/api/user/info/' + data,
    method: 'delete'
  })
}

export function listUserInfo(data) {
  return request({
    url: '/api/user/info/list',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/api/user/info/login',
    method: 'post',
    data
  })
}

export function getInfo(userId) {
  return request({
    url: '/api/user/info/' + userId,
    method: 'get'
  })
}

export function listAllUserRoles() {
  return request({
    url: '/api/user/role/all',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
