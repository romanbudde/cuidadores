
const nodemon = require('nodemon')
// const ngrok = require('ngrok')
const localtunnel = require('localtunnel')

const port = process.env.PORT || 5000
const ngrok_auth_token = process.env.NGROK_TOKEN;

require('dotenv').config()

nodemon({
  script: 'index.js',
  ext: 'js',
  delay: 1500
})

let lt_url = null

nodemon.on('start', async () => {
  if (!lt_url) {
    tunnel = await localtunnel({
      // local_https: true,
      allow_invalid_cert: true,
      port: port
    });
    lt_url = tunnel.url;
    console.log('LOCALTUNNEL IS: ', tunnel);
    console.log(`At nodemon START`)
    console.log(`Localtunnel URL is now available at ${lt_url}`)
    process.env.LOCALTUNNEL_URL = lt_url;
  }
})
.on("restart", async () => {
  console.log(`At nodemon RESTART`);
  console.log("Server app restarted!:");
  // await ngrok.kill();
  // console.group("Tunnel killed!");
})
.on('quit', async () => {
  console.log(`At nodemon QUIT`)
  // await ngrok.kill()
  // console.log(`Ngrok forwarding has been killed... server restarting.`)
})

module.exports = { lt_url }