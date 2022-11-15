import request from '@/utils/request'

export function addModifyGoodsUnit(req) {
  return request({
    url: '/goods/unit',
    method: 'post',
    params: req
  })
}

export function listGoodsUnit(req) {
  return request({
    url: '/goods/unit/list',
    method: 'post',
    params: req
  })
}
