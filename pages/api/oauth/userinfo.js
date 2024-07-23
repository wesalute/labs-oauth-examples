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
  async function fetchUserInfo(accessToken) {
    const response = await fetch(user_info_url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.ok) {
      return response.json();
    } else {
      const errorResponse = await response.json();
      return { error: errorResponse };
    }
  }

  // Function to attempt refreshing the access token using the refresh token
  async function attemptTokenRefresh() {
    if (!refresh_token) return; // Exit if no refresh token is available
    const newTokenData = await refreshAccessToken(client_id, refresh_token);
    if (newTokenData?.access_token && newTokenData?.refresh_token) {
      // Update tokens in cookies
      const cookie_options = { req, res, maxAge: 60 * 60 * 24 * 365 }; // Set cookies to expire in 1 year
      setCookie(`${client_id}_access_token`, newTokenData.access_token, cookie_options);
      setCookie(`${client_id}_refresh_token`, newTokenData.refresh_token, cookie_options);
      return newTokenData.access_token; // Return the new access token
    }
    return; // Token refresh failed
  }

  // Main logic for handling user info requests
  // Attempt to fetch user info with the access token
  let user = await fetchUserInfo(access_token);

  // Return the user info if it was fetched successfully
  if (!user.error) {
    console.log('User info fetched successfully:', user);
    return res.json(user);
  }
  
  // If we got here, the access token was invalid, clear the access token, we will attempt to refresh it
  access_token = null;
  console.error('Error fetching user info:', user.error);

  // Attempt to refresh the access token if a refresh token is available
  if (refresh_token) {
    console.log('Attempting to refresh access token...');
    access_token = await attemptTokenRefresh();
  }

  // Token refresh failed, there is nothing more we can do, respond with an error
  if (!access_token) {
    return res.status(401).json({ message: 'You must be logged in to view user info' });
  }

  // Attempt to fetch user info again with the new access token
  user = await fetchUserInfo(access_token);

  // If the user info was fetched successfully, respond with the user info
  if (!user.error) {
    console.log('User info fetched successfully:', user);
    return res.json(user);
  } else {
    // Respond with the user info or an error
    console.error('Error fetching user info with refreshed access token:', user.error);
    return res.status(401).json({ message: user.error });
  }
}
