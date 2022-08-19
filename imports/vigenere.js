export function vigenere (data) {
  const plain = data[0].toUpperCase()
  const plainLength = plain.length
  const key = data[1].toUpperCase()
  const keyLength = key.length
  let cypher = key
  if (plainLength < keyLength) {
    cypher = key.substring(0, plainLength)
  }
  if (plainLength > keyLength) {
    const rem = plainLength % keyLength
    const quo = (plainLength - rem) / keyLength
    for (let i = 0; i < quo - 1; i++) {
      cypher += key
    }
    cypher += key.substring(0, rem)
  }
  const cypherLength = cypher.length
  if (plainLength !== cypherLength) {
    return ''
  }
  let ret = ''
  for (let i = 0; i < plainLength; i++) {
    const offset = cypher[i].charCodeAt() - 'A'.charCodeAt()
    let encryptedCharCode = plain[i].charCodeAt() + offset
    if (encryptedCharCode > 'Z'.charCodeAt()) {
      encryptedCharCode = 'A'.charCodeAt() + (encryptedCharCode - 'Z'.charCodeAt() - 1)
    }
    ret += String.fromCharCode(encryptedCharCode)
  }
  return ret
}
