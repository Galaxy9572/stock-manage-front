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

export function modifyGoodsStockWarning(data) {
  return request({
    url: '/api/goods/stock/warning',
    method: 'put',
    data
  })
}
