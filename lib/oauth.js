import getConfig from 'next/config';
import { AuthorizationCode } from 'simple-oauth2';
import crypto from 'crypto';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

// OAuth2 endpoint and client config
// See next.config.js for the variable values
const oauth_url = serverRuntimeConfig.oauthUrl;
const oauth_config = {
  auth: { tokenHost: oauth_url, authorizePath: 'oauth2/auth', tokenPath: 'oauth2/token' },
  options: { bodyFormat: 'form', authorizationMethod: 'body' },
  client: {}
};
const clients = serverRuntimeConfig.clients;
const state = crypto.randomBytes(16).toString('hex');

// Step 2: Generate authorization request URL
export function authorizeURL(host, client_id) {
  oauth_config.client.id = clients[client_id].id;
  const client = new AuthorizationCode(oauth_config);

  console.log("Getting authorization URL for client_id:", clients[client_id].id);

  const props = {
    // id: clients[client_id].id,
    scope: clients[client_id].scope,
    redirect_uri: `${publicRuntimeConfig.protocol}://${host}${publicRuntimeConfig.basePath}/api/oauth/callback?client_id=${client_id}`,
    state: state
  };
  console.log("Props:", props);

  try {
    const authorizationUrl = client.authorizeURL(props);
    console.log("Authorization URL:", authorizationUrl);
    return authorizationUrl;
  }
  catch (e) {
    console.log(e);
    return;
  }
}

// Step 3: Exchange Code for Access Token
export async function getAccessToken(host, code, client_id) {
  oauth_config.client.id = clients[client_id].id;
  oauth_config.client.secret = clients[client_id].secret;
  const client = new AuthorizationCode(oauth_config);

  console.log("Exchanging code for token for client_id:", clients[client_id].id);

  const props = {
    // id: clients[client_id].id,
    // secret: clients[client_id].secret,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: `${publicRuntimeConfig.protocol}://${host}${publicRuntimeConfig.basePath}/api/oauth/callback?client_id=${client_id}`,
  };
  console.log("Request props:", props);

  try {
    const token = await client.getToken(props);
    console.log("Received token:", token);
    return token;
  }
  catch (e) {
    console.log(e);
    return;
  }
}

export async function refreshToken(client_id, access_token, refresh_token) {
  oauth_config.client.id = clients[client_id].id;
  const client = new AuthorizationCode(oauth_config);
  const scope = clients[client_id].scope;

  console.log("Refreshing token for client_id: ", client_id);

  const oldAccessToken = client.createToken({
    //Todo: I'm not sure all of these properties are technically needed
    access_token,
    refresh_token,
    scope: scope,
    token_type: 'bearer',
    id_token: ''
  });
  console.log("Old Access Token:", oldAccessToken);

  try {
    const newAccessToken = await oldAccessToken.refresh({ scope });
    console.log("New Access Token:", newAccessToken.token);
    return newAccessToken.token;
  }
  catch (e) {
    console.log(e);
    return;
  }
}
