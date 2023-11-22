### MOON-BOT
> This script is 100% free, which uses the api from [AlyaChan-APIs](https://api.alyachan.pro)

### What is needed
- [x] Server
- [x] WhatsApp
- [x] Apikey

### Set in config.js
```Javascript
global.owner = [
    ['6281252848955'],
    ['6281252848955', 'owner', true]
]

global.mods = ['0']
global.prems = ['6285815700861', '6281252848955']

global.APIs = {
  alya: 'https://api.alyachan.pro'
}

global.APIKeys = {
  'https://api.alychan.pro', 'YOURKEY'
}

global.set = {
  link: 'https://chat.whatsapp.com/EIe1hJspvpj3pzXYckeHkh',
  thumbnail: 'https://i.ibb.co/gtr5L2k/Supermoon-2012.jpg',
  wm: 'ᴍᴏᴏɴ ʙᴏᴛ ᴏɴʟɪɴᴇ',
  footer: 'ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ʙʏ ᴍᴏᴏɴ',
  packname: 'Sticker By',
  author: '@naando.io'
}

global.pairingNumber = 6283862074769

global.multiplier = 7 
global.max_upload = 70
global.intervalmsg = 1800
```

### Plugins
```Javascript
let handler = async(m, {
  conn,
  usedPrefix,
  command,
  args,
  text,
  users,
  isOwner,
  isPrem
}) => {
  try {
    // di isi sembarang cok
  } catch {
    console.log(e)
    return conn.reply(m.chat, Func.jsonFormat(e), m)
  }
}
handler.help = ['command'] // anunya
handler.tags = ['category'] // category
handler.command = /^(command)$/i // command
handler.group = Boolean // for group
handler.limit = Boolean // use limit
handler.game = Boolean // game mode
handler.rpg = Boolean // rpg mode
handler.owner = Boolean // for owner
handler.admin = Boolean // for admin
handler.botAdmin = Boolean // bot harus jadi admin
handler.premium = Boolean // bot must be an admin
handler.private = Boolean // private chat only
```

### Install and run
```
$ npm install
$ npm start
```

use PM2

```
$ npm install pm2 -g
$ npm install
$ pm2 start index.js && pm2 save && pm2 logs
```

### Arguments `node . [--options]`

Example : node . --autoread

### `--self`

ignoring others

### `--autoread`

auto read chat

### `--db`

Example : `node . --db 'mongodburi'`
connects to the mongodb database

### `--pairing`

login using code, not scanning qr code


[![Nurutomo](https://github.com/Nurutomo.png?size=100)](https://github.com/Nurutomo) | [![Nando35](https://github.com/moonxxl.png?size=100)](https://github.com/moonxxl)
----|----
[Nurutomo](https://github.com/Nurutomo) | [Nando](https://github.com/moonxxl)
 Creator | Recoder