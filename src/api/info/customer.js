import request from '@/utils/request'

export function addModifyCustomerInfo(data) {
  return request({
    url: '/api/info/customer',
    method: 'post',
    data
  })
}

export function listCustomerInfo(data) {
  return request({
    url: '/api/info/customer/list',
    method: 'post',
    data
  })
}

export function getCustomerInfoDetail(data) {
  return request({
    url: '/api/info/customer/' + data + "/detail",
    method: 'get'
  })
}

export function deleteCustomerInfo(data) {
  return request({
    url: '/api/info/customer/' + data,
    method: 'delete'
  })
}
