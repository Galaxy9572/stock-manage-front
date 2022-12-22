import request from '@/utils/request'

export function addModifyWarehouseInfo(data) {
  return request({
    url: '/api/info/warehouse',
    method: 'post',
    data
  })
}

export function listWarehouseInfo(data) {
  return request({
    url: '/api/info/warehouse/list',
    method: 'post',
    data
  })
}

export function getWarehouseInfoDetail(data) {
  return request({
    url: '/api/info/warehouse/' + data + "/detail",
    method: 'get'
  })
}

export function deleteWarehouseInfo(data) {
  return request({
    url: '/api/info/warehouse/' + data,
    method: 'delete'
  })
}
