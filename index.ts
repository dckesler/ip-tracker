// This solution assumes that we don't need to order anything besides the top 100
// index-2 is a solution that orders the entire list of IPs

type IPType = {
  ip: string;
  requests: number;
  top100Index: number | null;
}

type IPTrackerType = {
  [IP: string]: IPType;
}

export let IPTracker: IPTrackerType = {}
export let topIPs: IPType[] = []

export function requestHandled(IPAddress: string) {
  // If the IP is not in the IPTracker, add a new entry for it
  if (!IPTracker[IPAddress]) {
    IPTracker[IPAddress] = { ip: IPAddress, requests: 0, top100Index: null }
  }

  // Increment the number of requests for the IP
  const IP = IPTracker[IPAddress]
  IP.requests += 1
  console.log(`${IPAddress} was incremented to ${IP.requests}`)

  // If topIPs is empty, start it with the first IP
  if (topIPs.length === 0) {
    topIPs.push(IP)
    IP.top100Index = 0
    return;
  }

  // If it's already the IP with the most requests then no more action needed
  if (IP.top100Index === 0) return

  // Find where this IP address would fit in the top 100
  const newIndex = findNewIndex(IP)

  // If it would be outside the top 100 or if there is no change, then no more action needed
  if (newIndex > 99 || newIndex === IP.top100Index) return

  // In order to prevent all of the array elements from needing to have their indices shifted
  // I've opted to use a swapping method
  const swap = topIPs[newIndex]

  if (swap) {
    swap.top100Index = IP.top100Index
    if (IP.top100Index !== null) {
      topIPs[IP.top100Index] = swap
    }
  }

  topIPs[newIndex] = IP
  IP.top100Index = newIndex

  topIPs = topIPs.slice(0, 100)
}

export function top100(): string[] {
  return topIPs.map(({ ip }) => ip)
}

export function clear() {
  IPTracker = {}
  topIPs = []
}

function findNewIndex(IP: IPType): number {
  let newIndex = 0;
  const start = IP.top100Index === null ? topIPs.length - 1 : IP.top100Index - 1
  for (let i = start; i >= 0; i--) {
    if (IP.requests <= topIPs[i].requests) {
      newIndex = i + 1;
      break;
    }
  }
  return newIndex;
}



