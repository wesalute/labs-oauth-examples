//Todo: get userinfo endpoint from environment variable
import { refreshToken } from "lib/oauth";
import { getCookies, setCookies } from "cookies-next";

export default async function handler(req, res) {
  //Todo: refresh if expired
  const cookies = getCookies({req, res});
  const client_id = req.query.client_id;
  const access_token = cookies[`${client_id}_access_token`];
  const refresh_token = cookies[`${client_id}_refresh_token`];

  let user = {};

  if (access_token) {
    user = await fetchUserInfo(access_token);
  }
  else {
    return res.json({message: 'You must be logged in to view user info'});
  }

  if (!user.error) {
    return res.json(user);
  }
  else if (refresh_token) {
    const newToken = await refreshToken(client_id, access_token, refresh_token);
    user = await fetchUserInfo(newToken.access_token);
    if (!user.error) {
      const cookie_options = { req, res, maxAge: 60 * 60 * 24 * 365 };
      setCookies(`${req.query.client_id}_access_token`, newToken.access_token, cookie_options);
      setCookies(`${req.query.client_id}_refresh_token`, newToken.refresh_token, cookie_options);
    }
    return res.json(user);
  }
  else {
    console.log(user);
    return res.json(user);
  }

  async function fetchUserInfo(token) {
    const userinfo_raw = await fetch('https://checkout-dev.veteransadvantage.com/api/partner/member', {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    let userinfo;
    if (userinfo_raw.status !== 200) {
      userinfo = {error: await userinfo_raw.json()}
    }
    else {
      userinfo = await userinfo_raw.json();
    }
    return userinfo;
  }
  
}
