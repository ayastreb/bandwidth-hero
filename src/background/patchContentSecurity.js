// @flow
import type { HttpHeader } from '../types'

export default (headers: HttpHeader[], proxyUrl: string): HttpHeader[] =>
  headers.map(header => {
    return /content-security-policy/i.test(header.name)
      ? {
          name: header.name,
          value: header.value.replace('img-src', `img-src ${proxyUrl}`)
        }
      : header
  })
