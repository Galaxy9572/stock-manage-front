import request from '@/utils/request'

export default function getDashboardStatistic() {
  return request({
    url: '/api/dashboard/statistic',
    method: 'get'
  })
}
