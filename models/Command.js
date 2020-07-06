class Command
{
  constructor(bot, names, commandArguments, admin, commandDescription)
  {
    this.bot = bot;
    this.names = names;
    this.admin = admin;
    this.commandArguments = commandArguments;
    this.commandDescription = commandDescription;
  }

  run() {}
}

module.exports = Command;
