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
function getClients() {
  const clients_dev = {
    "amazon": { id: 'd73055df-24a9-4313-9968-0cdc99934d9e', secret: 'QO3FBV9GdFnPvFXah6H1Oq3pk' },
    "starbucks": { id: '9f530122-b931-4e90-9776-f939d2af1218', secret: 'hEOv80fb1qvLTIOivKWDENeak.' },
    "cart": { id: 'a800a998-fac2-487a-a81d-4855b7906ee9', secret: 'wQNWTzTBgKe4H1v0z3d8PU8GQc' },
  }

  const clients_prod = {
    "amazon": { id: 'b4e310d4-03b1-4332-9535-dd4e1fa432ab', secret: 'UuzLLnsIJA3iVgiujAA3XDAdnr' },
    "starbucks": { id: '305ce244-1f70-4c05-8e6f-37068bb1bd77', secret: '0nGO_x.3WN9jtNveDUu4xT6J18' },
    "cart": { id: '85950f8c-41eb-4559-a543-c2fbc3a19690', secret: '5IGNEM8FZrMWpGeP~l.WtsARrs' },
  }

  return (process.env.CLOUD_ENV === 'dev') ? clients_dev : clients_prod;
}

function getOauthUrl() {
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
  assetPrefix: getBasePath(),
  publicRuntimeConfig: {
    basePath: getBasePath(),
    protocol: getProtocol(),
  },
  //When this app runs in the WeSalute dev environment, we will connect
  //to the dev instance of all external services
  serverRuntimeConfig: {
    clients: getClients(),
    oauthUrl: getOauthUrl(),
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
