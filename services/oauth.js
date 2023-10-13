const google = require('googleapis').google;

const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI } = process.env;

module.exports = {
  getUserInfo
};

async function getUserInfo(code) {
  try {
    const OAuth2 = google.auth.OAuth2;

    const oauth2Client = new OAuth2(OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials({ access_token: tokens.access_token });
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    return oauth2.userinfo.get();
  } catch (error) {
    console.log(error);
  }
}
