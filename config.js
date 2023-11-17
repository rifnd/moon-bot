// Owner
global.owner = [
  ['6281252848955'],
  ['6281252848955', 'Owner', true]
]
// Moderator
global.mods = ['6281252848955']
// Web Api
global.APIs = {
  alya: 'https://api.alyachan.pro'
}
// APikey register di https://api.alyachan.pro
global.APIKeys = {
  'https://api.alyachan.pro': 'yourkey'
}
// Option
global.set = {
  link: 'https://chat.whatsapp.com/IaXnDzbbhNfBfTv0nN7bJI',
  thumbnail: 'https://telegra.ph/file/749c6b7544efeff028487.jpg',
  wm: `© moon-bot v${require('./package.json').version}`,
  footer: 'ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴍᴏᴏɴ',
  packname: 'Sticker By',
  author: 'moon-bot'
}
// number 
global.pairingNumber = 6283862074769
// Lain lain
global.multiplier = 1000 // Semakin besar semakin sulit naik level
global.max_upload = 70 // Batas maks mengirim file
global.intervalmsg = 1800 // Agar tidak spam
global.ram_usage = 2100000000 // 2GB, hitung sendiri
// Function & Scrape
global.Func = new (require('./lib/functions'))
global.scrap = require('./lib/scrape')
// Message
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
// Emoticon RPG
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
const fs = require('fs')
const chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})