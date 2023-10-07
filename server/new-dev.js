
const nodemon = require('nodemon')
const ngrok = require('ngrok')

const port = process.env.PORT || 5000
const ngrok_auth_token = process.env.NGROK_TOKEN;

require('dotenv').config()

nodemon({
  script: 'index.js',
  ext: 'js',
  delay: 1500
})

let ngrok_url = null

nodemon.on('start', async () => {
  if (!ngrok_url) {
    ngrok_url = await ngrok.connect({
      port: port,
      addr: port,
      authtoken: ngrok_auth_token
    })
    console.log(`At nodemon START`)
    console.log(`Ngrok URL is now available at ${ngrok_url}`)
    process.env.NGROK_URL = ngrok_url;
  }
})
.on("restart", async () => {
  console.log(`At nodemon RESTART`)
  console.group("Server app restarted!:");
  // await ngrok.kill();
  // console.group("Tunnel killed!");
})
.on('quit', async () => {
  console.log(`At nodemon QUIT`)
  await ngrok.kill()
  console.log(`Ngrok forwarding has been killed... server restarting.`)
})

module.exports = { ngrok_url }