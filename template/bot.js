'use strict'

// Import dependencies
const Discord = require('discord.js')
const bot = require('commander')
const log = require('lloogg')

// Check arguments for token and owner ID
bot
  .version(require('./package.json').version)
  .option('-t, --token <token>', 'Add bot token')
  .option('-o, --owner <id>', 'Add owner ID')
  .parse(process.argv)

// Do not proceed without a token
if (!bot.token) {
  log.error('Bot token required. Run:', 'node bot.js -t bot_token_here')
  process.exit(1)
}

// Create a Discord client instance
const client = new Discord.Client()

// Listen for messages
client.on('message', message => {
  // Do not proceed if this bot sent the message
  if (message.author.bot) return

  // Do not proceed without command prefix
  if (!message.content.startsWith(config.prefix)) return
})

// Log when the bot is ready to receive information from Discord
client.on('ready', () => {
  log.success('I am ready!')
})

// Log in to Discord
client.login(bot.token)
