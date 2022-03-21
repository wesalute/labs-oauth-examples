/*
 * Gets the APP_BASE_PATH from the command used to start this app.
 * If APP_BASE_PATH is specified but it does not start with a "/" 
 * then add it. 
 */
function getBasePath() {
  var basePath = ''

  if (process.env.APP_BASE_PATH) {
      if (process.env.APP_BASE_PATH.startsWith("/") ) {
          basePath = process.env.APP_BASE_PATH;
      } else {
          basePath = "/" + process.env.APP_BASE_PATH;
      }
  } 

  return basePath
}
function getProtocol() {
  return (process.env.PROTOCOL && process.env.PROTOCOL == 'https') ? 'https' : 'http';
}
function getClients() {
  // Fallback list (dev)
  const fallback_clients = {
    "amazon": {id: 'amazon-dev', secret: 'ERJV0XsNclYs._2lSNunue1_70'},
    "upsell": {id: 'upsell', secret: '8-RBdv~-A19ENyituvK8MHI8Ax'},
    "verified-offer": {id: 'verified-offer', secret: 'tBB1sD00i0S7VdZ03af1H8_d7l'},
    "starbucks": {id: 'starbucks-dev', secret: 'd1Xbue_2sh~Q.s.ezZVMSrzcLz'},
    "cart": {id: 'bluline-dev', secret: '3FOD7Umt~dLCIQNIH4mXByvzV2'},
    "robinhood": {id: 'robinhood-dev', secret: 'GwiTYSBfWCz1VqZkjk0zHg_RoP'},
    "ourside": {id: 'paramount-dev', secret: 's-3CerDpR~YF4Q6erVnvKjk8ns'},
  }
  // Get value from runtime environment (json)
  return (process.env.OAUTH_CLIENTS) ? JSON.parse(process.env.OAUTH_CLIENTS) : fallback_clients;
}
function getUserInfoUrl() {
  // Fallback URL (dev)
  const fallback_url = "https://account-dev.veteransadvantage.com/api/partner/member";
  // Get value from runtime environment
  return (process.env.USERINFO_ENDPOINT) ? process.env.USERINFO_ENDPOINT : fallback_url;
}
function getOauthUrl() {
  // Fallback URL (dev)
  const fallback_url = "https://idp-dev.wesaluteapis.com";
  // Get value from runtime environment
  return (process.env.OAUTH_ENDPOINT) ? process.env.OAUTH_ENDPOINT : fallback_url;
}

module.exports = {
  reactStrictMode: true,
  basePath: getBasePath(),
  assetPrefix: getBasePath(),
  publicRuntimeConfig: {
    basePath: getBasePath(),
    protocol: getProtocol(),
  },
  //When this app runs in the WeSalute dev environment, we will connect
  //to the dev instance of all external services
  serverRuntimeConfig: {
    clients: getClients(),
    userInfoUrl: getUserInfoUrl(),
    oauthUrl: getOauthUrl()
  },
  // Path rewrites config
  async rewrites() {
    return [
      // Standard healthcheck endpoint (/healthz)
      {
        source: '/healthz',
        destination: '/api/healthz',
      },
    ]
  },
}
