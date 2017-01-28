'use strict'

// Import dependencies
const Discord = require('discord.js')
const log = require('lloogg')
const bot = new Discord.Client()
const token = process.env.token

// Do not proceed without a token
if (!token) {
  log.error('No bot token found')
  process.exit(1)
}

bot.on('message', message => {
  // Ping pong
  if (message.content.startsWith('ping')) {
    message.channel.sendMessage('pong!')
  }
})

bot.on('ready', () => {
  log.info(`${bot.user.username} is ready`)
})

bot.login(token)
