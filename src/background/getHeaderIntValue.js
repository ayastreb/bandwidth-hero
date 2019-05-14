export default (headers, header) => {
  if(headers && typeof header === 'string')
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].name.toLowerCase() === header.toLowerCase()) {
      return parseInt(headers[i].value) || 0
    }
  }

  return false
}
