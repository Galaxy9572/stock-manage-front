import request from '@/utils/request'

export function addUserInfo(data) {
  return request({
    url: '/api/system/user/info',
    method: 'put',
    data
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/api/system/user/info',
    method: 'post',
    data
  })
}

export function deleteUserInfo(data) {
  return request({
    url: '/api/system/user/info/' + data,
    method: 'delete'
  })
}

export function listUserInfo(data) {
  return request({
    url: '/api/system/user/info/list',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/api/system/user/info/login',
    method: 'post',
    data
  })
}

export function getInfo(userId) {
  return request({
    url: '/api/system/user/info/' + userId,
    method: 'get'
  })
}

export function listAllUserRoles() {
  return request({
    url: '/api/system/user/role/all',
    method: 'get'
  })
}

export function listAllModules() {
  return request({
    url: '/api/system/operation-log/module/list',
    method: 'get'
  })
}

export function listAllSubModulesByModule(data) {
  return request({
    url: '/api/system/operation-log/module/'+ data +'/sub-module/list',
    method: 'get'
  })
}

export function listAllOperationTypes() {
  return request({
    url: '/api/system/operation-log/operation-type/list',
    method: 'get'
  })
}

export function listOperationLogByPage(data) {
  return request({
    url: '/api/system/operation-log/list',
    method: 'post',
    data
  })
}
