import { AuthorizationCode } from 'simple-oauth2';
import getConfig from 'next/config';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

// OAuth2 endpoint and client config
// See next.config.js for the variable values
const oauth_url = serverRuntimeConfig.oauthUrl;
const clients = serverRuntimeConfig.clients;

let oauth_config = {
  auth: { tokenHost: oauth_url, authorizePath: 'oauth2/auth', tokenPath: 'oauth2/token' },
  options: { bodyFormat: 'form', authorizationMethod: 'body' }
};
let scope = 'openid offline email profile consumer.audience consumer.tier';
const state = random_string();

export function getRedirect(host, client_id) {
  oauth_config.client = clients[client_id];
  const client = new AuthorizationCode(oauth_config);
  let redirect_uri = `${publicRuntimeConfig.protocol}://${host}${publicRuntimeConfig.basePath}/api/oauth/callback?client_id=${client_id}`;

  // Request the consumer.household scope for specific clients
  switch (client_id) {
    case "amazon":
      scope += ' consumer.household';
      break;
  }

  return client.authorizeURL({
    redirect_uri,
    scope: scope,
    state: state
  });
}

export async function getToken(host, code, client_id) {
  oauth_config.client = clients[client_id];
  const client = new AuthorizationCode(oauth_config);

  const tokenParams = {
    code: code,
    grant_type: 'authorization_code',
    client_id: client.id,
    client_secret: client.secret,
    redirect_uri: `${publicRuntimeConfig.protocol}://${host}${publicRuntimeConfig.basePath}/api/oauth/callback?client_id=${client_id}`,
  };

  return client.getToken(tokenParams);
}

export async function refreshToken(client_id, access_token, refresh_token) {
  oauth_config.client = clients[client_id];
  const client = new AuthorizationCode(oauth_config);

  // Request the consumer.household scope for specific clients
  switch (client_id) {
    case "amazon":
      scope += ' consumer.household';
      break;
  }

  const oldAccessToken = client.createToken({
    //Todo: I'm not sure all of these properties are technically needed
    access_token,
    refresh_token,
    scope,
    token_type: 'bearer',
    id_token: ''
  });

  try {
    const newAccessToken = await oldAccessToken.refresh({ scope });
    return newAccessToken.token;
  }
  catch (e) {
    console.log(e);
    return {};
  }
}

function random_string() {
  return part() + part() + part();
  function part() {
    return Math.random().toString(36).substring(2, 15);
  }
}
