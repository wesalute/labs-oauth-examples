import { getRedirect } from 'lib/oauth';

export default function handler(req, res) {
  const redirect = getRedirect(req.headers.host, req.query.client_id, req.query.premium, req.query.verify);
  res.redirect(redirect);
}
