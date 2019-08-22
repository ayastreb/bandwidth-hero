export default (proxyUrl) =>
{
    try{
        proxyUrl = new URL(proxyUrl)
    }catch{
        return null
    }
    return proxyUrl.protocol === "https:"
}
