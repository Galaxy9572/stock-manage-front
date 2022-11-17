import request from '@/utils/request'

export function addModifyGoodsUnit(req) {
  return request({
    url: '/api/goods/unit',
    method: 'post',
    req
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
