import { getToken } from 'lib/oauth';
import { setCookies } from 'cookies-next';
import jwt_decode from "jwt-decode";

export default async function handler(req, res) {
  const token = await getToken(req.headers.host, req.query.code, req.query.client_id);
  
  // Here is where you would typically store the access token in a database.
  // We'll store them as cookies for this demo application.
  const cookie_options = { req, res, maxAge: 60 * 60 * 24 };
  var decoded = jwt_decode(token.token.id_token);
  setCookies('wesalute_id', decoded.member_id, cookie_options);
  setCookies('access_token', token.token.access_token, cookie_options);
  setCookies('refresh_token', token.token.refresh_token, cookie_options);
  
  return res.redirect(302, `/${req.query.client_id}`);
}
