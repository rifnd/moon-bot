### MOON-BOT
> This script is 100% free, which uses the api from [AlyaChan-APIs](https://api.alyachan.pro)

### What is needed
- [x] Server
- [x] WhatsApp
- [x] Apikey

### Set in config.js
```Javascript
global.owner = ['6281252848955']

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

## Install & Run use PM2

```
$ npm install pm2 -g
$ npm install
$ pm2 start index.js && pm2 save && pm2 logs
```

### Argument node . [--options]

+ ```node . --pairing``` : For those of you who login using a code, use this command in the terminal
+ ```node . --db 'mongodb uri'``` : If you want to connect the database to mongodb use this command


[![Nurutomo](https://github.com/Nurutomo.png?size=100)](https://github.com/Nurutomo) | [![Rifnd](https://github.com/rifnd.png?size=100)](https://github.com/moonxxl) | [![Neoxr](https://github.com/neoxr.png?size=100)](https://github.com/neoxr) | [![Alya](https://github.com/alya-tok.png?size=100)](https://github.com/alya-tok)
----|----
[Nurutomo](https://github.com/Nurutomo) | [Nando](https://github.com/rifnd) | [Neoxr](https://github.com/neoxr) | [Alya](https://github.com/alya-tok)
 Creator | Orang Orangan | Orang Baik | Si Cantik