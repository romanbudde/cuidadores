const ngrok = require("ngrok");
const nodemon = require("nodemon");

require('dotenv').config();
const ngrok_auth_token = process.env.NGROK_TOKEN;

(async function () {
  const url = await ngrok.connect({ authtoken: ngrok_auth_token });
  const api = ngrok.getApi();
  const tunnels = await api.listTunnels();
  console.log('tunnels: ', tunnels);

  if (tunnels.tunnels.length > 0) {
    // There is already an active ngrok tunnel
    const tunnel = tunnels.tunnels[0];
    console.log(`Existing ngrok tunnel found: ${tunnel.public_url}`);
    console.log("Open the ngrok dashboard at: https://localhost:4040\n");

    startNodemon(tunnel.public_url);
  } else {
    // No active ngrok tunnel, create a new one
    ngrok.connect({
      proto: "http",
      addr: "5000",
      port: "5000",
      authtoken: ngrok_auth_token
    })
      .then((url) => {
        console.log(`New ngrok tunnel opened at: ${url}`);
        console.log("Open the ngrok dashboard at: https://localhost:4040\n");

        startNodemon(url);
      })
      .catch((error) => {
        console.error("Error opening ngrok tunnel: ", error);
        process.exit(1);
      });
  }
})();

function startNodemon(ngrokUrl) {
  nodemon({
    script: "index.js",
    exec: `NGROK_URL=${ngrokUrl} node`,
  })
    .on("start", () => {
      console.log("The application has started");
    })
    .on("restart", (files) => {
      console.group("Application restarted due to:");
      // files.forEach(file => console.log(file));
      console.groupEnd();
    })
    .on("quit", () => {
      console.log("The application has quit, closing ngrok tunnel");
      ngrok.kill().then(() => process.exit(0));
    });
}
