/*
 * Gets the BASE_PATH from the command used to start this app.
 * If BASE_PATH is specified but it does not start with a "/" 
 * then add it. 
 */
function getBasePath() {
  var basePath = ''

  if (process.env.BASE_PATH) {
      if (process.env.BASE_PATH.startsWith("/") ) {
          basePath = process.env.BASE_PATH;
      } else {
          basePath = "/" + process.env.BASE_PATH;
      }
  } 

  return basePath
}
function getProtocal() {
  return (process.env.PROTOCAL && process.env.PROTOCAL == 'https') ? 'https' : 'http';
}

module.exports = {
  reactStrictMode: true,
  basePath: getBasePath(),
  assetPrefix: getBasePath(),
  publicRuntimeConfig: {
    basePath: getBasePath(),
    protocal: getProtocal()
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
