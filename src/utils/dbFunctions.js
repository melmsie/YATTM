const r = require('rethinkdbdash')()

module.exports = {
  userTrack: async function userTrack (userID, channelID, guildID) {
    let user = await r.table('yattmUsers')
      .get(userID)
      .default({
        "id": userID,
        "total": 0,
        "channels": [
          {
            "channelID": channelID,
            "total": 0
          }
        ],
        "guilds": [
          {
            "guildID": guildID,
            "total": 0
          }
        ],
        "settings": {
          "opt": true
        }
      })

    if (user) {
      user.total += 1

      let channel = user.channels.find(x => x.channelID === channelID)
      if (channel) {
        channel.total += 1
      } else {
        newChannel = {
          "channelID": channelID,
          "total": 1
        }
        user.channels.push(newChannel)
      }

      let guild = user.guilds.find(x => x.guildID === guildID)
      if (guild) {
        guild.total += 1
      } else {
        newGuild = {
          "guildID": guildID,
          "total": 1
        }
        user.guilds.push(newGuild)
      }

      r.table('yattmUsers')
        .insert(user, { conflict: 'update' })
        .run()
    }

    return user
  },
  guildTrack: async function guildTrack (userID, channelID, guildID) {
    let guild = await r.table('yattmGuilds')
      .get(guildID)
      .default({
        "id": guildID,
        "total": 0,
        "channels": [
          {
            "channelID": channelID,
            "total": 0
          }
        ],
        "users": [
            {
              "userID": userID,
              "total": 0
            }
          ],
        "settings": {}
      })

    if (guild) {
      guild.total += 1

      let channel = guild.channels.find(x => x.channelID === channelID)
      if (channel) {
        channel.total += 1
      } else {
        newChannel = {
          "channelID": channelID,
          "total": 1
        }
        guild.channels.push(newChannel)
      }

      if (!guild.users) {
          guild.users = []
      }
      let user = guild.users.find(x => x.userID === userID)
      if (user) {
        user.total += 1
      } else {
        newUser = {
          "userID": userID,
          "total": 1
        }
        guild.users.push(newUser)
      }

      r.table('yattmGuilds')
        .insert(guild, { conflict: 'update' })
        .run()
    }

    return guild
  },
  chatterBoxes: async function chatterBoxes (channelID, guildID) {
    let test = await r.table('yattmGuilds')
      .getAll('users')
      .limit(3)
      .run()
    return test
  }
}