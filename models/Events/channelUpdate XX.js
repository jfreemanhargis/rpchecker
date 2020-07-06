// channelUpdate
/* Emitted whenever a channel is updated - e.g. name change, topic change.
PARAMETER        TYPE        DESCRIPTION
oldChannel       Channel     The channel before the update
newChannel       Channel     The channel after the update    */
module.exports = (oldChannel, newChannel, bot) => 
{
  //Get server / channel id from message
  var guildData = bot.channelManager.getItemField("id",newChannel.guild.id);

  //Check config to see if we have a matching channel and use it to get the paired channel(s)
  var channelID = newChannel.id;
  var destList  = guildData.channels[channelID];
  if (destList !== undefined)
  {
    console.log(guildData.channels[channelID]);
    console.log("... updating: " + channelID);
    guildData.channels[channelID].name = newChannel.name;

    var details = {
      name: newChannel.guild.name,
      id: newChannel.guild.id,
      channels: guildData.channels
    };
    
    bot.channelManager.setItem(newChannel.guild.name, details);
    bot.channelManager.saveConfig();   
  }
    
  console.log("channelUpdate: " + newChannel.name);  
  
  //bot.UpdateChannelCount(newChannel.guild);
};