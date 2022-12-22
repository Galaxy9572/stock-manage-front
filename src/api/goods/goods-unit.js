import request from '@/utils/request'

export function addModifyGoodsUnit(data) {
  return request({
    url: '/api/goods/unit',
    method: 'post',
    data
  })
}

export function listGoodsUnit(data) {
  return request({
    url: '/api/goods/unit/list',
    method: 'post',
    data
  })
}

export function deleteGoodsUnit(data) {
  return request({
    url: '/api/goods/unit/' + data,
    method: 'delete'
  })
}
