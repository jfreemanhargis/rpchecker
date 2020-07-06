// channelDelete
/* Emitted whenever a channel is deleted.
PARAMETER   TYPE      DESCRIPTION
channel     Channel   The channel that was deleted    */
module.exports = (channel,bot) => 
{
  //Get server / channel id from message
  var guildData = bot.channelManager.getItemField("id",channel.guild.id);

  //Check config to see if we have a matching channel and use it to get the paired channel(s)
  var channelID = channel.id;
  var destList  = guildData.channels[channelID];
  if (destList !== undefined)
  {
    console.log(guildData.channels[channelID]);
    console.log("... deleting: " + channelID);
    delete guildData.channels[channelID];

    var details = {
      name: channel.guild.name,
      id: channel.guild.id,
      channels: guildData.channels
    };
    
    bot.channelManager.setItem(channel.guild.name, details);
    bot.channelManager.saveConfig();   
  }
    
  console.log("channelDelete: " + channel.name);
};