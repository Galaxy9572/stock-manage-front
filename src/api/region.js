import request from '@/utils/request'

export function listRegions(data) {
  return request({
    url: '/api/region/info/list',
    method: 'post',
    data
  })
}
