// This function allows me to scope down the possible
// number of IPs for testing purposes
export function IPBuilder(fieldNumber = 4) {
  const addressArr: number[] = []
  for (let i = 0; i < fieldNumber; i++) {
    addressArr.push(randomIPField())
  }
  return addressArr.join('.')
}

function randomIPField() {
  return Math.floor(Math.random() * 256)
}
