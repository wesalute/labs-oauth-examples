import { refreshAccessToken } from "lib/oauth";
import { getCookies, setCookie } from "cookies-next";
import getConfig from 'next/config';

// Handler for user information requests
export default async function handler(req, res) {
  // Extract server runtime configuration
  const { serverRuntimeConfig } = getConfig();
  // Retrieve cookies from the request
  const cookies = getCookies({ req, res });
  // Extract client ID from query parameters
  const client_id = req.query.client_id;
  // Attempt to retrieve access and refresh tokens from cookies
  let access_token = cookies[`${client_id}_access_token`] || null;
  let refresh_token = cookies[`${client_id}_refresh_token`] || null;
  // Determine user info URL from configuration or environment variable
  const user_info_url = serverRuntimeConfig.userInfoUrl || process.env.USER_INFO_URL;

  // Fetch user information using the provided access token
  async function fetchUserInfo(token) {
    const response = await fetch(user_info_url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.status === 200 ? response.json() : { error: await response.json() };
  }

  // Attempt to refresh the access token using the refresh token
  async function attemptTokenRefresh() {
    if (!refresh_token) return null; // Exit if no refresh token is available
    const newTokenData = await refreshAccessToken(client_id, refresh_token);
    if (newTokenData.access_token && newTokenData.refresh_token) {
      // Update tokens in cookies
      const cookie_options = { req, res, maxAge: 60 * 60 * 24 * 365 }; // Set cookies to expire in 1 year
      setCookie(`${client_id}_access_token`, newTokenData.access_token, cookie_options);
      setCookie(`${client_id}_refresh_token`, newTokenData.refresh_token, cookie_options);
      return newTokenData.access_token; // Return the new access token
    }
    return null; // Token refresh failed
  }

  // Main logic for handling user info requests
  if (!access_token) { // If no access token is available, attempt to refresh it
    console.log('No access token found, attempting to refresh...');
    access_token = await attemptTokenRefresh();
    console.log('Access token:', access_token);
    if (!access_token) { // If still no access token, respond with an error
      return res.json({ message: 'You must be logged in to view user info' });
    }
  }

  // Attempt to fetch user info with the access token
  let user = await fetchUserInfo(access_token);
  if (user.error && refresh_token) { // If fetching fails and a refresh token is available, attempt to refresh the token
    access_token = await attemptTokenRefresh();
    if (access_token) { // If the token was successfully refreshed, retry fetching user info
      user = await fetchUserInfo(access_token);
    }
  }

  // Respond with the user info or an error message
  if (user.error) {
    console.log(user.error);
    return res.status(user.error.status || 500).json(user.error);
  } else {
    return res.json(user);
  }
}
