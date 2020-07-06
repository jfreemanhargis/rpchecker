// messageDelete
/* Emitted whenever a message is deleted.
PARAMETER      TYPE           DESCRIPTION
message        Message        The deleted message    */
module.exports = (message, bot) => 
{  
  //Get server / channel id from message
  var guildData = bot.channelManager.getItemField("id", message.guild.id);
    
  //Check config to see if we have a matching channel and use it to get the paired channel(s)
  var channelID = message.channel.id;
  var destList = guildData.channels[channelID];
  if (destList !== undefined)
  {
    destList = destList.links;
    //If we do, process the message and send it to the other channel    
    destList.forEach(dest=>
    {                        
      dest = message.guild.channels.get(dest.id);
      bot.deleteBotMessage(dest, message);
    });      
  }
};