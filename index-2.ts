// This solution sorts all of the IPs by requests

// Just some types to start with
type IPObjectType = {
  ip: string;
  requests: number;
}

type IPTrackerType = {
  [IP: string]: IPObjectType;
}

type TopIPs = {
  [requestCount: number]: string[]
}

// Here we group the IPs by request count
export let topIPs: TopIPs = {}

// This object tracks all of the IPs and their request counts mapped by address
export let IPTracker: IPTrackerType = {}

export function requestHandled(IPAddress: string) {
  // If the IP is not in the IPTracker, add a new entry for it
  if (!IPTracker[IPAddress]) {
    IPTracker[IPAddress] = { ip: IPAddress, requests: 0 }
  }

  const IPObject = IPTracker[IPAddress]

  // If there has been at least one previous request from this IP then
  // it needs to be removed from its previous request count group before
  // being added to the next one up
  if (IPObject.requests > 0) {
    addressRemove(IPObject)
  }

  // Increment the requests after removing it from the previous request count group
  IPObject.requests += 1

  // Now add the IP to the next request count group
  addressPlace(IPObject)
}

export function top100() {
  // Order the request count groups in descending order
  const topRequestCounts = Object.keys(topIPs).map(Number).sort((a, b) => b - a)

  let topIPAddresses: string[] = []
  for (let i = 0; i < topRequestCounts.length; i++) {
    const requestsCount = topRequestCounts[i]

    // If we can fit all of the IPs from this request count group into the top 100, then add them all
    if (topIPAddresses.length + topIPs[requestsCount].length < 100) {
      topIPAddresses = [...topIPAddresses, ...topIPs[requestsCount]]
    } else {
      // Else we fit as many from the group as we can and then break out of the loop
      const remaining = 100 - topIPAddresses.length
      topIPAddresses = [...topIPAddresses, ...topIPs[requestsCount].slice(0, remaining)]
      break;
    }
  }
  return topIPAddresses
}

export function clear() {
  // Reset the two tracking objects back to their initial state
  topIPs = {}
  IPTracker = {}
}

// This function is for placing an IP address alphabetically into a list
function addressPlace(IPObject: IPObjectType) {
  const IPList = topIPs[IPObject.requests]
  // If the list is empty or non-existant then add the IP as the only entry
  if (!IPList || IPList.length === 0) {
    topIPs[IPObject.requests] = [IPObject.ip]
  } else  {
    const index = search(IPObject.ip, IPList)
    IPList.splice(index, 0, IPObject.ip)
  }
}

// This function is for finding and removing an IP address from a list
function addressRemove(IPObject: IPObjectType) {
  const IPList = topIPs[IPObject.requests]
  const index = search(IPObject.ip, IPList)
  IPList.splice(index, 1)
}


// This is my binary insertion search
function search(item: string, list: string[]) {
  // Start at the first and last index
  let smallestIPIndex = 0;
  let biggestIPIndex = list.length - 1;

  // As long as their is still some space between the first and last index
  // keep searching
  while (smallestIPIndex < biggestIPIndex) {

    // This is halves the distance between the start and end index rounding down
    const target = (smallestIPIndex + biggestIPIndex) >> 1;

    // Compare the item to the element at the target index
    const result = compare(item, list[target]);

    // Item is the target
    if (result === 0) {
      return target;
    }
    // Item is alphabetically before the target
    if (result === -1) {
      biggestIPIndex = target - 1;
    }

    // Item is alphabetically after than the target
    if (result === 1) {
      smallestIPIndex = target + 1;
    }
  }

  // If we didn't find the item then we need to figure out where to insert it
  if (item > list[smallestIPIndex]) {
    return smallestIPIndex + 1
  }
  return smallestIPIndex;
}

// Really simple string comparison function
function compare(item: string, target: string) {
  if (item === target) return 0;
  return item < target ? -1 : 1;
}
