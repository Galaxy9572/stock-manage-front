import request from '@/utils/request'

export function addModifySupplierInfo(data) {
  return request({
    url: '/api/info/supplier',
    method: 'post',
    data
  })
}

export function listSupplierInfo(data) {
  return request({
    url: '/api/info/supplier/list',
    method: 'post',
    data
  })
}

export function getSupplierInfoDetail(data) {
  return request({
    url: '/api/info/supplier/' + data + "/detail",
    method: 'get'
  })
}

export function deleteSupplierInfo(data) {
  return request({
    url: '/api/info/supplier/' + data,
    method: 'delete'
  })
}
