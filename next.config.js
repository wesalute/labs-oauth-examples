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
// Override OAuth2 endpoint and client config in the dev environment
function getClients() {
  const clients = {
    "amazon": {id: 'd73055df-24a9-4313-9968-0cdc99934d9e', secret: 'wAYeR6rLrpR-e7Tq_ikwH8.pkW'},
    "upsell": {id: 'c103bd6b-c1bf-4973-9383-7a23b2bb460a', secret: 'LTodDiMpa4OnAMUCN-Rb1vyUWf'},
    "verified-offer": {id: '3666c2f0-9ed6-496d-b108-7d012c17cc3f', secret: 'JT7OhDc1XfILWuzt0-GCMmTvAq'},
    "starbucks": {id: '9f530122-b931-4e90-9776-f939d2af1218', secret: 'hEOv80fb1qvLTIOivKWDENeak.'},
    "cart": {id: 'a800a998-fac2-487a-a81d-4855b7906ee9', secret: 'wQNWTzTBgKe4H1v0z3d8PU8GQc'},
    "robinhood": {id: '99976afe-84d9-45d1-81c0-786acacca1cc', secret: '5Tf3zsXD2oeELQAojYKbOqjsE6'},
    "ourside": {id: 'd739e52a-2c81-4585-bf43-426694cc566b', secret: 'u4DRjS6Ksx.uo0yPO9U2hG8Iu.'},
  }
  return (process.env.CLOUD_ENV === 'dev') ? clients : null;
}
function getUserInfoUrl() {
  const url = "https://account-dev.wesaluteapis.com/userinfo";
  return (process.env.CLOUD_ENV === 'dev') ? url : null;
}
function getOauthUrl() {
  const url = "https://fervent-dewdney-gqdkbt8xn7.projects.oryapis.com";
  return (process.env.CLOUD_ENV === 'dev') ? url : null;
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
