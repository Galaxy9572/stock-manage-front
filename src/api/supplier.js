import request from '@/utils/request'

export function addModifySupplierInfo(data) {
  return request({
    url: '/api/supplier/info',
    method: 'post',
    data
  })
}

export function listSupplierInfo(data) {
  return request({
    url: '/api/supplier/info/list',
    method: 'post',
    data
  })
}

export function getSupplierInfoDetail(data) {
  return request({
    url: '/api/supplier/info/' + data + "/detail",
    method: 'get'
  })
}

export function deleteSupplierInfo(data) {
  return request({
    url: '/api/supplier/info/' + data,
    method: 'delete'
  })
}
