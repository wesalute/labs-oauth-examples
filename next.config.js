/*
 * Gets the APP_BASE_PATH from the command used to start this app.
 * If APP_BASE_PATH is specified but it does not start with a "/"
 * then add it.
 */
function getBasePath() {
  var basePath = ''

  if (process.env.APP_BASE_PATH) {
    if (process.env.APP_BASE_PATH.startsWith("/")) {
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

// Override OAuth2 endpoint and client config in the dev environment
function getOAuthClients() {
  const clients_dev = {
    "cart": {
      id: 'a800a998-fac2-487a-a81d-4855b7906ee9', 
      secret: 'wQNWTzTBgKe4H1v0z3d8PU8GQc',
      scope: 'openid offline email profile consumer.audience consumer.tier'
     },
  }

  const clients_prod = {
    "cart": {
      id: '85950f8c-41eb-4559-a543-c2fbc3a19690', 
      secret: '5IGNEM8FZrMWpGeP~l.WtsARrs',
      scope: 'openid offline email profile consumer.audience consumer.tier'
    },
  }

  return (process.env.CLOUD_ENV === 'dev') ? clients_dev : clients_prod;
}

function getOAuthUrl() {
  const url_dev   = "https://fervent-dewdney-gqdkbt8xn7.projects.oryapis.com";
  const url_prod  = "https://idp.wesaluteapis.com";
  return (process.env.CLOUD_ENV === 'dev') ? url_dev : url_prod;
}

function getUserInfoUrl() {
  const url_dev   = "https://account-dev.wesaluteapis.com/userinfo";
  const url_prod  = "https://account.wesaluteapis.com/userinfo";
  return (process.env.CLOUD_ENV === 'dev') ? url_dev : url_prod;
}

function getwidgetUrl() {
  const url_dev   = "https://connections-dev.wesaluteapis.com/loader/bc.js";
  const url_prod  = "https://connections.wesaluteapis.com/loader/bc.js";
  return (process.env.CLOUD_ENV === 'dev') ? url_dev : url_prod;
}

module.exports = {
  reactStrictMode: true,
  basePath: getBasePath(),
  publicRuntimeConfig: {
    basePath: getBasePath(),
    protocol: getProtocol(),
  },
  //When this app runs in the WeSalute dev environment, we will connect
  //to the dev instance of all external services
  serverRuntimeConfig: {
    clients: getOAuthClients(),
    oauthUrl: getOAuthUrl(),
    userInfoUrl: getUserInfoUrl(),
    widgetUrl: getwidgetUrl()
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
