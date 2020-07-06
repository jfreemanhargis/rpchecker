const Command = require('../Command.js');

class CommandCheck extends Command
{
  constructor(bot)
  {
    super(bot, ["check"], [], false, "Check RP");
  }
  
  baseline(channel)
  {
    // Fetch last message.
    channel.fetchMessages({ limit: 1 },false)
           .then((msgCollection) => 
            { // Resolve promise
              var details = {
                              name: channel.id,
                              displayname: channel.name,
                              msg: 0
                            };

              
              if (msgCollection.size > 0)
              {
                details.msg = msgCollection.first().id
                console.log(channel.name + ": " + details.msg);
              }
              this.bot.channelManager.setItem(channel.id, details);
            });
  }
  
  analyze(channel, results)
  {
    var updated = false;
    // var channelData = this.bot.channelManager.getItem(channel.id);
    // var criteria = (null == channelData ? {} : { after: channelData.message });
    // const oneday = 60 * 60 * 24 * 1000;
    // var newMessageTime = Date.now() - oneday;

    var criteria = {};
    var newMessageTime = this.bot.channelManager.getItem("time").time;
    
    channel.fetchMessages(criteria,false).then((msgCollection) => 
    { // Resolve promise
        msgCollection.forEach((msg) =>   
        { // forEach on message collection
            var recent = msg.createdTimestamp > newMessageTime;
                
            if (recent)  // || null != channelData)
            {
                console.log (channel.name + ": " + msg.createdTimestamp + ": " + msg.content);   
                updated = true;
            }          
        })
      
        // if (msgCollection.size <= 0)
        //   console.log(channel.name + ": Has no new messages");
    });
    return updated;
  }
  
  async run(message, contents, args, comment="")
  {
    args.shift();
    var cmd = args[0];
    var results = {};
    
    //Run through all channels
    var guild = message.guild;
    message.delete();
    guild.channels.forEach(channel => 
    { 
      //Limit it to RP channels that start with 🗣
      if(channel.name.startsWith("🗣") || channel.name.startsWith("💬"))
      {
        this.analyze(channel, results)
        //this.baseline(channel);
      }
    });
    
    console.log(this.bot.channelManager.items);
  }
}

module.exports = CommandCheck;
