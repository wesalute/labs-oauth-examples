//Todo: get userinfo endpoint from environment variable
import { getCookies } from "cookies-next";

export default async function handler(req, res) {
  //Todo: refresh if expired
  const cookies = getCookies({req, res});
  const access_token = cookies[`${req.query.client_id}_access_token`];
  
  const userinfo_raw = await fetch('https://k8s-dev.veteransadvantage.com/hydra/userinfo', {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  });
  const userinfo = await userinfo_raw.json();
  return res.json(userinfo);
}
