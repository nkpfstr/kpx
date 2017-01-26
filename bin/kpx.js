#!/usr/bin/env node

'use strict'

// Import dependencies
const ask = require('inquirer')
const exeq = require('exeq')
const fs = require('fs-extra')
const kpx = require('commander')
const log = require('lloogg')
const opn = require('opn')

kpx
  .version(require('../package').version)

// kpx create
kpx
  .command('create')
  .alias('c')
  .description('Scaffold a functioning bot with basic commands')
  .option('-i, --client_id <id>', 'Client ID')
  .option('-t, --token <token>', 'Bot token')
  .action(options => {
    let id = options.client_id
    let token = options.token

    // Set client ID environment variable
    if (id) {
      process.env.client_id = id
    }

    // Set bot token environment variable
    if (token) {
      process.env.bot_token = token
    }

    // Ask for not name
    ask.prompt({
      type: 'input',
      name: 'bot_name',
      message: 'Enter bot name'
    }).then(answers => {
      // Copy boilerplate files to cwd/[bot_name]
      fs.copy(`${__dirname}/../boilerplate`, answers.bot_name, err => {
        if (err) return log.error(err)

        // Install dependencies
        log.success('Starter files copied successfully')
        log.info('Installing dependencies...')
        exeq(`cd ${process.cwd()}/${answers.bot_name} && yarn`).then(results => {
          // Setup is complete
          log.success(`Your bot is ready. Happy coding!`)
          log.info(`Tip: Run 'kpx auth' when you're ready to add the bot to your server.`)
        })
      })
    })
  })

// kpx auth
kpx
  .command('auth')
  .alias('a')
  .description('Authorize your bot to join a server')
  .action(() => {
    ask.prompt({
      type: 'input',
      name: 'client_id',
      message: 'Enter client ID'
    }).then(answers => {
      log.success(`Got it!`)
      log.info('Opening auth page...')
      // Set client ID env var
      process.env.client_id = answers.client_id
      // Open bot auth page in default browser
      opn(`https://discordapp.com/oauth2/authorize?client_id=${answers.client_id}&scope=bot`)
        .then(() => {
          ask.prompt({
            type: 'confirm',
            name: 'bot_token',
            message: 'Fetch bot token'
          }).then(answers => {
            if (answers.bot_token) {
              // If yes, open bot info page in default browser
              log.info('Opening bot info page...')
              opn(`https://discordapp.com/developers/applications/me/${process.env.client_id}`)
            }

            // Instruct user to set bot token as env var
            log.info(
              'Set your token as an environment variable:',
              'set bot_token=your_token_here',
              '',
              'Run your bot:',
              'node bot.js'
            )
          })
        })
    })
  })

// Parse arguments
kpx.parse(process.argv)

// Print help if no arguments are found
if (!kpx.args.length) kpx.help()
