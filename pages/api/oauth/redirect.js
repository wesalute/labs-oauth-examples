import { authorizeURL } from 'lib/oauth';

export default function handler(req, res) {
  // Step 1: Redirect to OAuth Provider
  const redirect = authorizeURL(req.headers.host, req.query.client_id);
  res.redirect(redirect);
}
