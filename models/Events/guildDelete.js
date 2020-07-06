// guildDelete
/* Emitted whenever a guild is deleted/left.
PARAMETER    TYPE         DESCRIPTION
guild        Guild        The guild that was deleted    */
module.exports = (guild,bot) => 
{
  //Get server / channel id from message
  var guildData = bot.channelManager.getItemField("id",guild.id);

  bot.channelManager.removeItemField("id",guild.id);
  bot.channelManager.saveConfig();   
    
  console.log("Guild Delete: " + guild.name);
};