import request from '@/utils/request'

export function addModifyGoodsType(data) {
  return request({
    url: '/api/goods/type',
    method: 'post',
    data
  })
}

export function listGoodsTypes() {
  return request({
    url: '/api/goods/type/list',
    method: 'get'
  })
}

export function deleteGoodsType(data) {
  return request({
    url: '/api/goods/type/' + data,
    method: 'delete'
  })
}
