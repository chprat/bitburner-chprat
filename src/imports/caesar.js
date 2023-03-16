export function caesar (data) {
  const plain = data[0].toUpperCase()
  const plainLength = plain.length
  const shift = data[1]

  let ret = ''
  for (let i = 0; i < plainLength; i++) {
    if (plain[i] === ' ') {
      ret += ' '
      continue
    }
    let encryptedCharCode = plain[i].charCodeAt() - shift
    if (encryptedCharCode < 'A'.charCodeAt()) {
      encryptedCharCode = 'Z'.charCodeAt() - ('A'.charCodeAt() - encryptedCharCode - 1)
    }
    ret += String.fromCharCode(encryptedCharCode)
  }
  return ret
}
