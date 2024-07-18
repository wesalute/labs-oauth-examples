import { authorizeURL } from 'lib/oauth';

export default function handler(req, res) {
  const redirect = authorizeURL(req.headers.host, req.query.client_id);
  res.redirect(redirect);
}
