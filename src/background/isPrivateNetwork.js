import { Netmask } from 'netmask'

/**
 * Check if an URL is localhost or part of a private IP. If it is private we
 * can't reach it with our proxy. So we should skip compressing those URLs.
 */
export default (url) => {
  if (url === 'localhost' || /^https?:\/\/(localhost|127.0.0.1).*/i.test(url)) {
    return true;
  }

  const ipAddress = url.match(/^https?:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}).*/)
  if (ipAddress) {
    const privateBlocks = [
      new Netmask('10.0.0.0/8'),
      new Netmask('172.16.0.0/12'),
      new Netmask('192.168.0.0/16')
    ]
    for (const block of privateBlocks) {
      if (block.contains(ipAddress[1])) return true
    }
  }

  return false
}
