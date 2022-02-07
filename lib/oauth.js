import { AuthorizationCode } from 'simple-oauth2';
import { publicRuntimeConfig, serverRuntimeConfig } from 'next.config';

let oauth_url = 'https://k8s.veteransadvantage.com';
let clients = {
  "amazon": {id: 'amazon-dev', secret: 'FiHxEfSlvxzI~uoVXU.CQJ9BcC'},
  "upsell": {id: 'upsell', secret: 'BiBILWg5WJpbkeAnDr3iQT9muX'},
  "verified-offer": {id: 'verified-offer', secret: 'Uo7oXG_eDjr5BAeZc8g8uvE5vx'},
  "starbucks": {id: 'starbucks-dev', secret: 'EageW8YrdkAieWjLpdbwK57FTp'},
  "cart": {id: 'bluline-dev', secret: 'Fv~Dv2BqPvfKe_TerFul35dH4a'},
  "robinhood": {id: 'robinhood-dev', secret: 'WiBh5m~ixGearlvnxbmgpqKB.8'},
  "ourside": {id: 'paramount-dev', secret: 'RUu5brm6nH~nB-CKF8NQWma-nd'},
}

console.log(serverRuntimeConfig);
//Optionally allow the oauth server to be overridden for the dev environment
clients = (serverRuntimeConfig.clients) ? serverRuntimeConfig.clients : clients;
oauth_url = (serverRuntimeConfig.oauthUrl) ? serverRuntimeConfig.oauthUrl : oauth_url;

let oauth_config = {
  auth: {tokenHost: oauth_url, authorizePath: 'oauth/oauth2/auth', tokenPath: 'oauth/oauth2/token'},
  options: {bodyFormat: 'form', authorizationMethod: 'body'}
};
const state = random_string();
const scope = 'openid offline email profile consumer.audience consumer.tier consumer.household';

export function getRedirect(host, client_id, premium, verify) {
  oauth_config.client = clients[client_id];
  const client = new AuthorizationCode(oauth_config);
  let redirect_uri = `${publicRuntimeConfig.protocol}://${host}${publicRuntimeConfig.basePath}/api/oauth/callback?client_id=${client_id}`;
  
  if (premium) {
    redirect_uri = redirect_uri + '&premium=1'
  }

  if (verify) {
    redirect_uri = redirect_uri + '&verify=1'
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

  if (client_id === 'upsell') {
    tokenParams.redirect_uri += '&premium=1';
  }

  if (client_id === 'verified-offer') {
    tokenParams.redirect_uri += '&verify=1';
  }

  return client.getToken(tokenParams);
}

export async function refreshToken(client_id, access_token, refresh_token) {
  oauth_config.client = clients[client_id];
  const client = new AuthorizationCode(oauth_config);
  
  const oldAccessToken = client.createToken({
    //Todo: I'm not sure all of these properties are technically needed
    access_token,
    refresh_token,
    scope,
    token_type: 'bearer',
    id_token: ''
  });

  try {
    const newAccessToken = await oldAccessToken.refresh({scope});
    return newAccessToken.token;
  }
  catch(e) {
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