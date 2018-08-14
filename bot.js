// Private stuff/variable stuff goes in config.json
const config = require('./config.json')

// Initiate Eris
const Eris = require('eris')
const bot = new Eris(config.bot.token)

// Load event handlers
const msgHandler = require('./src/handlers/msgHandler.js')
const guildHandler = require('./src/handlers/guildHandler')

// Bind some stuff because I'm lazy
bot.config = config

// Handle events
bot.on('ready', () => {
  console.log(`${bot.user.username}#${bot.user.discriminator} is ready.`)
})
bot.on('messageCreate', (msg) => {
  msgHandler.handle(bot, msg)
})

bot.on('guildCreate', (guild) => {
  guildHandler(bot, guild)
})

bot.on('guildDelete', (guild) => {
  guildHandler(bot, guild)
})

bot.on('error', (error) => {
  console.log(error.stack, 'error')
})

bot.connect()
