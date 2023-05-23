import { getToken } from 'lib/oauth';
import { setCookies } from 'cookies-next';
import { publicRuntimeConfig } from 'next.config';
import jwt_decode from "jwt-decode";

export default async function handler(req, res) {
  let token;
  const basePath = publicRuntimeConfig.basePath;
  const destination = basePath ? `${publicRuntimeConfig.basePath}/${req.query.client_id}` : `/${req.query.client_id}`;

  try {
    if (!req.query.code) {
      return res.redirect(302, destination);
    }
    token = await getToken(req.headers.host, req.query.code, req.query.client_id);
  }
  catch (e) {
    console.log(e);
  }
  if (!token) {
    return res.status(500).send("An error occurred");
  }

  // Here is where you would typically store the access token in a database.
  // We'll store them as cookies for this demo application.
  const cookie_options = { req, res, maxAge: 60 * 60 * 24 * 365 };
  var decoded = jwt_decode(token.token.id_token);

  setCookies(`${req.query.client_id}_wesalute_id`, decoded.member_id, cookie_options);
  setCookies(`${req.query.client_id}_access_token`, token.token.access_token, cookie_options);
  setCookies(`${req.query.client_id}_refresh_token`, token.token.refresh_token, cookie_options);

  return res.redirect(302, destination);
}
