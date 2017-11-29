export default url => {
  const parser = document.createElement('a')
  parser.href = url

  return {
    schema: parser.protocol,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    hash: parser.hash
  }
}
