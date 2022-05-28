export function lzDecompress (data) {
  let plain = ''
  for (let i = 0; i < data.length;) {
    const literalLength = data.charCodeAt(i) - 0x30
    if (literalLength < 0 || literalLength > 9 || i + 1 + literalLength > data.length) {
      return null
    }
    plain += data.substring(i + 1, i + 1 + literalLength)
    i += 1 + literalLength
    if (i >= data.length) {
      break
    }
    const backrefLength = data.charCodeAt(i) - 0x30
    if (backrefLength < 0 || backrefLength > 9) {
      return null
    } else if (backrefLength === 0) {
      ++i
    } else {
      if (i + 1 >= data.length) {
        return null
      }
      const backrefOffset = data.charCodeAt(i + 1) - 0x30
      if ((backrefLength > 0 && (backrefOffset < 1 || backrefOffset > 9)) || backrefOffset > plain.length) {
        return null
      }
      for (let j = 0; j < backrefLength; ++j) {
        plain += plain[plain.length - backrefOffset]
      }
      i += 2
    }
  }
  return plain
}
