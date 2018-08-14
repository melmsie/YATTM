const db = require('../utils/dbFunctions.js')

exports.handle = async function (bot, msg) {
  // Return if it's a dm or if the message was sent by a bot
  if (!msg.channel.guild || msg.author.bot) { return }

  let me = await db.userTrack(msg.author.id, msg.channel.id, msg.channel.guild.id)
  let guild = await db.guildTrack(msg.author.id, msg.channel.id, msg.channel.guild.id)

  // Handle the prefix, including mention support
  const selfMember = msg.channel.guild.members.get(bot.user.id)
  const mention = `<@${selfMember.nick ? '!' : ''}${selfMember.id}>`
  const wasMentioned = msg.content.startsWith(mention)
  const triggerLength = (wasMentioned ? mention : bot.config.bot.prefix).length + 1
  const cleanTriggerLength = (wasMentioned ? `@${selfMember.nick || selfMember.username}` : bot.config.bot.prefix).length + 1

  // Return if the message was not a command
  if (!msg.content.toLowerCase().startsWith(bot.config.bot.prefix) && !wasMentioned) {
    return
  }

  let [command, ...args] = msg.content.slice(triggerLength).split(/ +/g)

  if (command === 'me') {
    let server = me.guilds.find(x => x.guildID === msg.channel.guild.id)
    let channel = me.channels.find(x => x.channelID === msg.channel.id)
    let mess = `${msg.author.username}'s Activity:\n**${me.total}** messages total\n**${server.total}** in this server\n**${channel.total}** in this channel`
    msg.channel.createMessage(mess)
  }

  if (command === 'server') {
    let user = guild.users.find(x => x.userID === msg.author.id)
    let channel = guild.channels.find(x => x.channelID === msg.channel.id)
    let mess = `${msg.channel.guild.name}'s Activity:\n**${guild.total}** messages total\n**${user.total}** by ${msg.author.username}\n**${channel.total}** in this channel`
    msg.channel.createMessage(mess)
  }
}
