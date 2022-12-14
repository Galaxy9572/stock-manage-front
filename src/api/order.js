import request from '@/utils/request'

export function listAllOrderTypeList() {
  return request({
    url: '/api/order/type/list',
    method: 'get'
  })
}

export function listOrderRecordsByPage(data) {
  return request({
    url: '/api/order/record/list',
    method: 'post',
    data
  })
}
