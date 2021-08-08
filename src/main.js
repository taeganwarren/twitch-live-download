require('dotenv').config();

const { ApiClient } = require('twitch');
const { ClientCredentialsAuthProvider } = require('twitch-auth');
const { online_subscription } = require('./utils/subscription');

const main = async () => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const authProvider = new ClientCredentialsAuthProvider(
    clientId,
    clientSecret
  );
  const apiClient = new ApiClient({ authProvider });

  await online_subscription('saruei', 122863474, apiClient);
};

main();
