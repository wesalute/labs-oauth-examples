import { refreshAccessToken } from "lib/oauth";
import { getCookies, setCookie } from "cookies-next";
import getConfig from 'next/config';

// Handler for user information requests
export default async function handler(req, res) {
  const { serverRuntimeConfig } = getConfig();
  const user_info_url = serverRuntimeConfig.userInfoUrl || process.env.USER_INFO_URL;

  // Get the client ID from the query string
  const client_id = req.query.client_id;
  // Attempt to retrieve access and refresh tokens from cookies
  const cookies = getCookies({ req, res });
  let access_token = cookies[`${client_id}_access_token`] || null;
  let refresh_token = cookies[`${client_id}_refresh_token`] || null;

  // Function to fetch user information from the OAuth provider using the access token
  async function fetchUserInfo(access_token) {
    const response = await fetch(user_info_url, {
      headers: { "Authorization": `Bearer ${access_token}` }
    });
    return response.status === 200 ? response.json() : { error: await response.json() };
  }

  // Function to attempt refreshing the access token using the refresh token
  async function attemptTokenRefresh() {
    if (!refresh_token) return null; // Exit if no refresh token is available
    const newTokenData = await refreshAccessToken(client_id, refresh_token);
    if (newTokenData?.access_token && newTokenData?.refresh_token) {
      // Update tokens in cookies
      const cookie_options = { req, res, maxAge: 60 * 60 * 24 * 365 }; // Set cookies to expire in 1 year
      setCookie(`${client_id}_access_token`, newTokenData.access_token, cookie_options);
      setCookie(`${client_id}_refresh_token`, newTokenData.refresh_token, cookie_options);
      return newTokenData.access_token; // Return the new access token
    }
    return null; // Token refresh failed
  }

  // Main logic for handling user info requests
  //// If no access token is available but a refresh token is, use the refresh token to get a new access token
  if (!access_token && refresh_token) {
    console.log('No access token found, attempting to refresh...');
    access_token = await attemptTokenRefresh();
    if (!access_token) { // If still no access token, respond with an error message
      return res.json({ message: 'You must be logged in to view user info' });
    }
  }

  //// Attempt to fetch user info with the access token
  let user = await fetchUserInfo(access_token);
  // If fetching fails and a refresh token is available, use the refresh token to get a new access token
  if (user.error && refresh_token) {
    console.error('Error fetching user info with access token, attempting to refresh token...');
    access_token = await attemptTokenRefresh();
    if (!access_token) { // If still no access token, respond with an error message
      return res.json({ message: 'You must be logged in to view user info' });
    }
  }

  //// Fetch user info
  user = await fetchUserInfo(access_token);
  if (user.error) {
    console.log(user.error);
    return res.status(user.error.status || 500).json(user.error);
  } else {
    return res.json(user);
  }
}
