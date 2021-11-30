import { AuthorizationCode } from 'simple-oauth2';
import { publicRuntimeConfig } from 'next.config';

const clients = {
  "amazon": {id: 'amazon-dev', secret: 'ERJV0XsNclYs._2lSNunue1_70'},
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


export function getRedirect(host, client_id) {

  oauth_config.client = clients[client_id];
  const client = new AuthorizationCode(oauth_config);

  return client.authorizeURL({
    redirect_uri: `${publicRuntimeConfig.protocol}://${host}${publicRuntimeConfig.basePath}/api/oauth/callback?client_id=${client_id}`,
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
  //todo: handle error;
  return client.getToken(tokenParams);
}

function random_string() {
  return part() + part() + part();
  function part() {
    return Math.random().toString(36).substring(2, 15);
  }
}