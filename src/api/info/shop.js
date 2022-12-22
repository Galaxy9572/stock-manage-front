import request from '@/utils/request'

export function addModifyShopInfo(data) {
  return request({
    url: '/api/info/shop',
    method: 'post',
    data
  })
}

export function listShopInfo(data) {
  return request({
    url: '/api/info/shop/list',
    method: 'post',
    data
  })
}

export function getShopInfoDetail(data) {
  return request({
    url: '/api/info/shop/' + data + "/detail",
    method: 'get'
  })
}

export function deleteShopInfo(data) {
  return request({
    url: '/api/info/shop/' + data,
    method: 'delete'
  })
}

export function modifyDefaultShop(data) {
  return request({
    url: '/api/info/shop/default-shop',
    method: 'put',
    data
  })
}
