import request from '@/utils/request'

export function modifyGoodsStockWarning(data) {
  return request({
    url: '/api/goods/stock/warning',
    method: 'put',
    data
  })
}
