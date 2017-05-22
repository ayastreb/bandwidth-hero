// @flow
export default (
  url: string
): {
  schema: string,
  hostname: string,
  port: string,
  pathname: string,
  search: string,
  hash: string
} => {
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
