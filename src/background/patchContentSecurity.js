export default (headers, proxyUrl) =>
  headers.map(header => {
    return /content-security-policy/i.test(header.name)
      ? {
          name: header.name,
          value: header.value.replace('img-src', `img-src ${proxyUrl}`)
        }
      : header
  })
