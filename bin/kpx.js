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

kpx
  .command('new')
  .alias('n')
  .description('Create a new bot')
  .action(() => {
    // Initialize questions
    let questions = [
      {
        type: 'input',
        name: 'bot_name',
        message: 'Enter bot name:'
      },
      {
        type: 'input',
        name: 'bot_prefix',
        message: 'Enter bot command prefix:'
      }
    ]

    // Ask questions
    ask.prompt(questions).then(answers => {
      // Copy boilerplate files
      fs.copy(`${__dirname}/../template`, answers.bot_name, err => {
        // Handle errors
        if (err) return log.error(err)

        // Initialize bot config
        let config = {
          name: answers.bot_name,
          prefix: answers.bot_prefix
        }

        // Write bot config to file
        fs.writeJson(`${answers.bot_name}/config.json`, config, err => {
          // Handle errors
          if (err) log.error(err)
        })

        // Install dependencies
        log.success('Project files created')
        log.info('Installing dependencies...')
        exeq(`cd ${process.cwd()}/${answers.bot_name} && yarn`).then(results => {
          // Setup is complete
          log.success(`Your bot is ready. Happy coding! ♥`)
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
      // Ask for client ID
      type: 'input',
      name: 'client_id',
      message: 'Enter client ID'
    }).then(answers => {
      // Make sure the client ID only contains numbers
      if (answers.client_id.match(/^\d+$/)) {
        // Open bot auth page in default browser
        opn(`https://discordapp.com/oauth2/authorize?client_id=${answers.client_id}&scope=bot`)
      } else {
        log.error('Error: Client ID should only contain numbers')
      }
    })
  })

// Parse arguments
kpx.parse(process.argv)

// Print help if no arguments are found
if (!kpx.args.length) kpx.help()
