import { getAccessToken } from 'lib/oauth';
import { setCookie } from 'cookies-next';
import getConfig from 'next/config';
import jwt_decode from "jwt-decode";

export default async function handler(req, res) {
  let token;
  const { publicRuntimeConfig } = getConfig();
  const basePath = publicRuntimeConfig.basePath;
  const destination = basePath ? `${publicRuntimeConfig.basePath}/${req.query.client_id}` : `/${req.query.client_id}`;

  console.log("Callback request received with query:", req.query);

  // Check for the code or error in the query string
  if (!req.query.code) {
    return res.redirect(302, destination);
  }

  // Step 2: Exchange Code for Access Token
  try {
    token = await getAccessToken(req.headers.host, req.query.code, req.query.client_id);
  }
  catch (e) {
    console.log(e);
    return res.status(500).send("An error occurred");
  }

  // Here is where you would typically store the access/refresh tokens in a database.
  // We'll store them as cookies for this demo application.
  const cookie_options = { req, res, maxAge: 60 * 60 * 24 * 365 };
  var decoded = jwt_decode(token.id_token);

  setCookie(`${req.query.client_id}_wesalute_id`, decoded.member_id, cookie_options);
  setCookie(`${req.query.client_id}_access_token`, token.access_token, cookie_options);
  setCookie(`${req.query.client_id}_refresh_token`, token.refresh_token, cookie_options);

  return res.redirect(302, destination);
}
