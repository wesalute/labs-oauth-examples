import { AuthorizationCode } from 'simple-oauth2';
import { publicRuntimeConfig } from 'next.config';

const clients = {
  "amazon": {id: 'amazon-dev', secret: 'ERJV0XsNclYs._2lSNunue1_70'},
  "upsell": {id: 'upsell', secret: '8-RBdv~-A19ENyituvK8MHI8Ax'},
  "verified-offer": {id: 'verified-offer', secret: 'tBB1sD00i0S7VdZ03af1H8_d7l'},
  "starbucks": {id: 'starbucks-dev', secret: 'd1Xbue_2sh~Q.s.ezZVMSrzcLz'},
  "cart": {id: 'bluline-dev', secret: '3FOD7Umt~dLCIQNIH4mXByvzV2'},
  "robinhood": {id: 'robinhood-dev', secret: 'GwiTYSBfWCz1VqZkjk0zHg_RoP'},
  "ourside": {id: 'paramount-dev', secret: 's-3CerDpR~YF4Q6erVnvKjk8ns'},
}
let oauth_config = {
  //todo: get url from environment variable
  auth: {tokenHost: 'https://k8s-dev.veteransadvantage.com', authorizePath: 'hydra/oauth2/auth', tokenPath: 'hydra/oauth2/token'},
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