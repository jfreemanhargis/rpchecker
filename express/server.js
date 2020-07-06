const http = require('http');
const express = require('express');
const app = express();

// Listener
const listener = app.listen(process.env.PORT, function() 
{ 
	console.log('Your app is listening on port ' + listener.address().port);
});

// Auto-ping interval
setInterval(() => {
	http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

// Example of hello world
app.get('/', (req, res) => 
{
	console.log(new Date() + ' OK!');  
	res.status(200).send('OK!');
})

// Example of API from your client (discord.js)
module.exports = bot => 
{
  // get all guilds the bot is logged in
	app.get('/api/guild/all', (req, res) => 
  {
		let guilds = bot.guilds.array();
		res.status(200).send(guilds);
	});
}