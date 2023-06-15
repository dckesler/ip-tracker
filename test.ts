import { requestHandled, top100, topIPs } from './index'
import { IPBuilder } from './utils'

const NUMBER_OF_REQUESTS = 200_000
let worstTimes: number[] = []
for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
  const ip = IPBuilder()
  const requestStart = performance.now()
  requestHandled(ip);
  const requestTime = performance.now() - requestStart
  if (requestTime >= 10) {
    worstTimes.push(requestTime)
  }

  const newTop = topIPs.slice().sort((a, b) => b.requests - a.requests)
  newTop.forEach((IP, index) => {
    if (topIPs[index].ip !== IP.ip) {
      throw new Error('not sorted')
    }
  });
}

console.log('Number of slow requests: ', worstTimes.length)

const topStart = performance.now()
top100()
const topTime = performance.now() - topStart
if (topTime >= 300) {
  throw new Error('top100 too slow')
}
