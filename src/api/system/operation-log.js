import request from "@/utils/request";

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
