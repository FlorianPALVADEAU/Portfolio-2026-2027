# Spotify now playing

The footer shows the track playing on the owner's Spotify account, or the last one played. A route
handler (`/api/now-playing`) trades a long-lived refresh token for a short access token on the
server, so no credential ever reaches the browser. Without the three variables below the route
answers `204` and the footer shows nothing.

## One-time setup

1. Create an app at <https://developer.spotify.com/dashboard>. Add the redirect URI
   `http://127.0.0.1:3000/callback` (it is only used once, to read a code from the address bar).
   Copy the client ID and the client secret.
2. Open this address in a browser, with your client ID, and accept:

   ```
   https://accounts.spotify.com/authorize?client_id=<CLIENT_ID>&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-currently-playing%20user-read-recently-played
   ```

   The browser then lands on a page that fails to load. Copy the `code` value from its address.
3. Exchange the code for a refresh token:

   ```sh
   curl -s -X POST https://accounts.spotify.com/api/token \
     -H "Authorization: Basic $(printf '<CLIENT_ID>:<CLIENT_SECRET>' | base64)" \
     -d grant_type=authorization_code \
     -d code=<CODE> \
     -d redirect_uri=http://127.0.0.1:3000/callback
   ```

4. Put `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` and the `refresh_token` from the answer into
   `SPOTIFY_REFRESH_TOKEN`, locally in `.env` and in the Vercel project settings.

The refresh token does not expire unless the access is revoked at
<https://www.spotify.com/account/apps/>.
