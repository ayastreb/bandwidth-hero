export default (proxyUrl) =>
{
    proxyUrl = new URL(proxyUrl) || proxyUrl;
    return proxyUrl.protocol === "https:";
}
