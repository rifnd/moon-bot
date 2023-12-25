/** enter owner number */
global.owner = ['6281252848955']

/** Apikey https://api.alyachan.pro/pricing */
global.APIs = {
  alya: 'https://api.alyachan.pro'
}
global.APIKeys = {
  'https://api.alyachan.pro': 'Yourkey'
}

/** option setting */
global.set = {
  wm: `© moon-bot v${require('./package.json').version}`,
  footer: 'ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴍᴏᴏɴ',
  packname: 'Sticker By',
  author: 'moon-bot'
}
/** enter your bot number to login using the code */
global.pairingNumber = 6283862074769

/** enter your replit link, so it's active 24/7 */
global.replit_url = ''

/** other */
global.multiplier = 1000 // The bigger it gets the harder it is to level up
global.max_upload = 70 // Maximum limit to send files
global.intervalmsg = 1800 // To avoid spam on first login
global.ram_usage = 2100000000 // Maximum 2GB ram, do the math yourself

/** function and scraper to make it more practical */
global.Func = new (require('./lib/functions'))
global.scrap = new (require('./lib/scrape'))

/** status message */
global.status = {
  wait: 'Processing. . .',
  invalid: 'Invalid URL!',
  wrong: 'Wrong format!',
  error: 'Error occurred!',
  premium: 'This feature is only for premium users.',
  admin: 'This command is specific to Admins.',
  botAdmin: 'Make the bot admin to use this command.',
  owner: 'This command is for Owner only.',
  mod: 'This command is for Moderators only.',
  group: 'This command is Group specific.',
  private: 'This command is private chat only.',
  register: 'Please register first to use this command.',
  game: 'The game feature has not been activated.',
  rpg: 'The RPG feature has not been activated.'
}

/** rpg emoticon */
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()
    let emot = {
      exp: '✉️',
      money: '💵',
      potion: '🥤',
      diamond: '💎',
      common: '📦',
      uncommon: '🎁',
      mythic: '🗳️',
      legendary: '🗃️',
      pet: '🎁',
      trash: '🗑',
      armor: '🥼',
      sword: '⚔️',
      wood: '🪵',
      rock: '🪨',
      string: '🕸️',
      horse: '🐎',
      cat: '🐈',
      dog: '🐕',
      fox: '🦊',
      petFood: '🍖',
      iron: '⛓️',
      gold: '👑',
      emerald: '💚',
    }
    let results = Object.keys(emot).map((v) => [v, new RegExp(v, 'gi')]).filter((v) => v[1].test(string))
    if (!results.length) return ''
    else return emot[results[0][0]]
  },
}

/** reload file */
const fs = require('fs')
const chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})