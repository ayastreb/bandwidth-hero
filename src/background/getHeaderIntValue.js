// @flow
import type { HttpHeader } from '../types'

export default (headers: HttpHeader[], header: string): boolean | number => {
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].name.toLowerCase() === header.toLowerCase()) {
      return parseInt(headers[i].value) || 0
    }
  }

  return false
}
