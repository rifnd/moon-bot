global.owner = [
    ['6281252848955'],
    ['6285815700861'],
    ['6281252848955', 'owner', true]
  ]
global.mods = ['0']
global.prems = ['6285815700861', '6281252848955']

global.APIs = {
  alya: 'https://api.alyachan.biz.id'
}
global.APIKeys = {
  'https://api.alyachan.biz.id': 'liyacomel'
}

global.set = {
  link: 'https://chat.whatsapp.com/IaXnDzbbhNfBfTv0nN7bJI',
  thumbnail: 'https://i.ibb.co/gtr5L2k/Supermoon-2012.jpg',
  wm: `© moon-bot v${require('./package.json').version}`,
  footer: 'ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴍᴏᴏɴ',
  packname: 'Sticker By',
  author: 'moon-bot'
}

global.multiplier = 50
global.max_upload = 70
global.intervalmsg = 1800

global.Func = new(require('./lib/functions'))
global.scrap = require('./lib/scrape')

global.status = {
  wait: 'Sedang diproses. . .',
  invalid: 'URL tidak valid.',
  wrong: 'Format salah.',
  error: 'Terjadi kesalahan.',
  premium: 'Fitur ini hanya untuk pengguna premium.',
  admin: 'Perintah ini khusus untuk Admin.',
  botAdmin: 'Jadikan bot admin untuk menggunakan perintah ini.',
  owner: 'Perintah ini hanya untuk Owner.',
  mod: 'Perintah ini hanya untuk Moderator.',
  group: 'Perintah ini khusus Grup.',
  private: 'Perintah ini khusus chat pribadi.',
  register: 'Silahkan daftar terlebih dahulu untuk menggunakan perintah ini.',
  game: 'Fitur game belum diaktifkan.',
  rpg: 'Fitur RPG belum diaktifkan.'
}

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
    let results = Object.keys(emot)
      .map((v) => [v, new RegExp(v, 'gi')])
      .filter((v) => v[1].test(string))
    if (!results.length) return ''
    else return emot[results[0][0]]
  },
}


const fs = require('fs')
const chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})