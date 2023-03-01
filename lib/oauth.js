import { AuthorizationCode } from 'simple-oauth2';
import { publicRuntimeConfig, serverRuntimeConfig } from 'next.config';

// Production OAuth2 endpoint and client config
let oauth_url = 'https://idp.wesaluteapis.com';
let clients = {
  "amazon": {id: 'b4e310d4-03b1-4332-9535-dd4e1fa432ab', secret: 'UuzLLnsIJA3iVgiujAA3XDAdnr'},
  "upsell": {id: 'db0aa28a-e95f-4e8b-9ae8-15b0e6c7587b', secret: '3kqPD7iqE-aIUjuT5NjqsQCpG1'},
  "verified-offer": {id: '122809bd-bcab-4a9d-911b-3817739de1c2', secret: 'RLd3ks5BcZQy29Vv4HUCGBCnz8'},
  "starbucks": {id: '305ce244-1f70-4c05-8e6f-37068bb1bd77', secret: '0nGO_x.3WN9jtNveDUu4xT6J18'},
  "cart": {id: '85950f8c-41eb-4559-a543-c2fbc3a19690', secret: '5IGNEM8FZrMWpGeP~l.WtsARrs'},
  "robinhood": {id: '95dab022-5d36-4793-8a47-a8b475a977a3', secret: 'Z.WmG4zGMnX7Sb_EC-W51Hb~a.'},
  "ourside": {id: 'ac5b84e7-9698-4338-b9f5-67e000f955d9', secret: '-XwerH50O5_ZgJHnct_ft4t9uF'},
}

// Allow OAuth2 endpoint and client config to be overridden for the dev environment
oauth_url = (serverRuntimeConfig.oauthUrl) ? serverRuntimeConfig.oauthUrl : oauth_url;
clients = (serverRuntimeConfig.clients) ? serverRuntimeConfig.clients : clients;

let oauth_config = {
  auth: {tokenHost: oauth_url, authorizePath: 'oauth2/auth', tokenPath: 'oauth2/token'},
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