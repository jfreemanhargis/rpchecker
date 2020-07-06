//Stay Alive
// const http = require('http');
// const express = require('express');
// const app = express();
// app.get("/", (request, response) => {
//   console.log(Date.now() + " Ping Received");
//   response.sendStatus(200);
// });
// app.listen(process.env.PORT);
// setInterval(() => {
//   http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
// }, 280000);


//Instantiate the bot
var Bot = require('./models/Bot.js');
console.log("Starting bot.")
var bot = new Bot();
var Server = require('./express/server.js')(bot.client);