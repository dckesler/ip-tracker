import { requestHandled, top100, topIPs } from './index-2'
import { IPBuilder } from './utils'

const NUMBER_OF_REQUESTS = 200_000
let worstTimes: number[] = []
for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
  const ip = IPBuilder(2)
  const requestStart = performance.now()
  requestHandled(ip)
  const requestTime = performance.now() - requestStart
  console.log(`Request ${i} took ${requestTime}ms`);
  if (requestTime >= 10) {
    worstTimes.push(requestTime)
  }
}

console.log('Number of slow requests: ', worstTimes.length)

const topStart = performance.now()
console.log(top100())
const topTime = performance.now() - topStart
if (topTime >= 300) {
  throw new Error('top100 too slow')
}

console.log(topIPs)
