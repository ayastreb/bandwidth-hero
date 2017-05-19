// @flow
import type { HttpHeader } from '../types'

export default (headers: HttpHeader[]): boolean | number => {
  for (let i = 0; i < headers.length; i++) {
    if (/x-bytes-saved/i.test(headers[i].name)) {
      return parseInt(headers[i].value)
    }
  }

  return false
}
