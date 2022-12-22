import request from '@/utils/request'

export function addModifyGoodsInfo(data) {
  return request({
    url: '/api/goods/info',
    method: 'post',
    data
  })
}

export function listGoodsInfo(data) {
  return request({
    url: '/api/goods/info/list',
    method: 'post',
    data
  })
}

export function deleteGoodsInfo(data) {
  return request({
    url: '/api/goods/info/' + data,
    method: 'delete'
  })
}

export function getGoodsInfoDetail(data) {
  return request({
    url: '/api/goods/info/' + data + "/detail",
    method: 'get'
  })
}

