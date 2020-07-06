const Discord = require("discord.js");
const Fs = require("fs");
const ConfigManager = require('./ConfigManager.js');

class Bot 
{
  constructor() 
  {
    this.client = new Discord.Client();
    this.configManager = new ConfigManager(this,"config");
    this.timeManager = new ConfigManager(this,"time");
    this.loadConfig();
    this.loadCommands();
    this.runBot();
  }

  loadCommands() 
  {
    this.commands = [];
    console.log("Loading commands.");
    var files;
    try 
    {
      files = Fs.readdirSync("./models/Commands/");
    }
    catch (error) 
    {
      console.log("Failed to load Discord commands: " + error);
      process.exit(1);
    }

    files.forEach(file => 
    {
      console.log(" - Command: " + file);
      const CommandClass = require("./Commands/" + file);
      if (CommandClass != undefined) this.commands.push(new CommandClass(this));
    });
    
		// files = Fs.readdirSync("./models/Events");
		// files.forEach(file => {
		// 	this.client.on(file.slice(0,-3), (...args) => require("./Events/"+file)(...args,this));
		// });
  }
  
  loadEvents()
  {
    // debug
    /* Emitted for general debugging information.
    PARAMETER    TYPE         DESCRIPTION
    info         string       The debug information    */
    this.client.on("debug", function(info){
        console.log(`debug -> ${info}`);
    });

    // error
    /* Emitted whenever the client's WebSocket encounters a connection error.
    PARAMETER    TYPE     DESCRIPTION
    error        Error    The encountered error    */
    this.client.on("error", function(error){
        console.error(`client's WebSocket encountered a connection error: ${error}`);
    });

    // warn
    /* Emitted for general warnings. 
    PARAMETER    TYPE       DESCRIPTION
    info         string     The warning   */
    this.client.on("warn", function(info){
        console.log(`warn: ${info}`);
    });
  }
  
  loadConfig()
  {
    //TODO: Replace this with a per-server configuration
    //TODO: Put discord_character into the config, too.
    this.config = require("../config/config.json");
  }
  
  runBot() 
  {
    if (process.env.PROJECT_DOMAIN.includes("-dev"))
    {
      this.config.discord_token = process.env.DEVTOKEN;
      this.config.discord_character = this.config.dev_character;
    }
    else
    {
      this.config.discord_token = process.env.TOKEN;
      this.config.discord_character = this.config.prod_character;
    }

    /*-------------------------------------------*\
    | Log in & disco                              |
    \*-------------------------------------------*/        
    this.client.login(this.config.discord_token).then(() => 
    {
      console.log("Bot logged in.");
      this.runJobs();
    })
    .catch(console.error);
    
    this.client.on("disconnect", () => setTimeout(() => 
    {
      console.log("Bot Disconnected from Discord.");
      this.client.destroy().then(() => 
      {
        this.runBot();
      });
    }, 10000));
    
    /*-------------------------------------------*\
    | Check commands                              |
    \*-------------------------------------------*/    
    this.client.on("message", message => { this.processMessage(message); });
    
    this.loadEvents();    
  }
  
  processMessage(message) 
  {
    //Don't respond to a bot or if there is no command
    if (message.author.bot) return;
    
    //If it starts with the command character, process it as command
    //TODO: Check person's admin privs and/or if they ar specified in config as someone allowed to run commands
    if (message.content.startsWith(this.config.discord_character) && message.member.hasPermission("ADMINISTRATOR"))
    {
      var args = message.content.substring(1).split(/ /g); //message.content.substring(1).split(/ [^a-zA-Z\d\s](.*)/);
      var content = args[0].trim().split(" ");
      var comment = (args[1] || "").trim();
      var command = this.getCommand(content[0]);

      if (command)
      {
        try 
        {
          command.run(message, content, args, comment).then(
            this.updateTime(message.guild.id, Date.now())
          );
          // if (false === command.run(message, content, args, comment)) 
          //   return message.reply("Usage is `" + this.config.discord_character + command.names[0] + " " + command.commandArguments.join(" ") + "`");
        }
        catch (err) 
        {
          console.log("BOT ERROR: " + err.message);
          throw err;
        }      
        return;
      }      
    }
  }
  
  getCommand(name) 
  {
    for (var command of this.commands) 
    {
      if (command.names.includes(name)) 
      {
        return command;
      }
    }
    return false;
  }
  
  updateTime(id, time)
  {
    var details = {
      name: id,
      time: time
    };
    this.channelManager.setItem(id,details);
    this.channelManager.saveItems();
  }
  
  runJobs()
  { 
    setInterval(() =>
    {
      var lastTime = parseInt(this.timeManager.getItem("time").time);
      var now = Date.now();
      var n = now.toString();      

      var timeSince = now - lastTime;
      var minutes = parseInt((timeSince / (1000 * 60)) % 60);
      var hours = parseInt((timeSince / (1000 * 60 * 60)) % 24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;

      timeSince = hours + ":" + minutes;
      this.client.user.setActivity(""+timeSince, { type: "WATCHING"})
    }, 1000);
  }
}

module.exports = Bot;