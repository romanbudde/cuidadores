const ngrok = require("ngrok");
const nodemon = require("nodemon");

ngrok
  .connect({
    proto: "http",
    addr: "5000",
  })
  .then((url) => {
    console.log(`ngrok tunnel opened at: ${url}`);
    console.log("Open the ngrok dashboard at: https://localhost:4040\n");

    nodemon({
      script: "./bin/www",
      exec: `NGROK_URL=${url} node`,
    }).on("start", () => {
      console.log("The application has started");
    }).on("restart", files => {
      console.group("Application restarted due to:")
      files.forEach(file => console.log(file));
      console.groupEnd();
    }).on("quit", () => {
      console.log("The application has quit, closing ngrok tunnel");
      ngrok.kill().then(() => process.exit(0));
    });
  })
  .catch((error) => {
    console.error("Error opening ngrok tunnel: ", error);
    process.exitCode = 1;
  });