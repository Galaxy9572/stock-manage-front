import request from '@/utils/request'

export function addModifyCustomerInfo(data) {
  return request({
    url: '/api/customer/info',
    method: 'post',
    data
  })
}

export function listCustomerInfo(data) {
  return request({
    url: '/api/customer/info/list',
    method: 'post',
    data
  })
}

export function getCustomerInfoDetail(data) {
  return request({
    url: '/api/customer/info/' + data + "/detail",
    method: 'get'
  })
}

export function deleteCustomerInfo(data) {
  return request({
    url: '/api/customer/info/' + data,
    method: 'delete'
  })
}
