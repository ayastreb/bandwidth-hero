// @flow
export type AppState = {
  enabled: boolean,
  statistics: {
    filesProcessed: number,
    bytesProcessed: number,
    bytesSaved: number
  },
  whitelist: string[],
  proxyUrl: string
}

export type AppProps = {
  currentUrl: string,
  enabled: boolean,
  statistics: {
    filesProcessed: number,
    bytesProcessed: number,
    bytesSaved: number
  },
  whitelist: string[],
  proxyUrl: string
}

export type HttpHeader = {
  name: string,
  value: string
}
