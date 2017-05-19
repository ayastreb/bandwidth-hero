// @flow
export type AppState = {
  enabled: boolean,
  statistics: {
    filesProcessed: number,
    bytesSaved: number
  },
  whitelist: string[],
  proxyUrl: string
}

export type HttpHeader = {
  name: string,
  value: string
}
