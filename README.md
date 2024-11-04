### MOON-BOT
> This script is 100% free, which uses the api from [AlyaChan-APIs](https://api.alyachan.pro)

### To install this script you need
- [x] Server vCPU/RAM 1/1GB (Min)
- [x] NodeJS
- [x] FFMPEG
- [x] WhatsApp 
- [x] Apikey (buy at api.alyachan.dev/pricing)

**Creator / Group** : [Nando](https://wa.me/6281252848955) / [Community](https://chat.whatsapp.com/G57unQZ7saFIq2rdpVw0Tu)

### Set in config.js
```Javascript
/** enter owner number */
global.owner = ['6281252848955']
/** https://api.alyachan.pro/pricing */
global.APIs = {
  alya: 'https://api.alyachan.dev'
}
global.APIKeys = {
  'https://api.alyachan.dev': 'yourkey'
}
/** option setting */
global.set = {
  wm: `© moon-bot v${require('./package.json').version}`,
  footer: 'ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴍᴏᴏɴ',
  packname: 'Sticker By',
  author: 'moon-bot'
}
/** enter your bot number to login using the code */
global.pairingNumber = 6283867587556
/** enter your replit link, so it's active 24/7 */
global.replit_url = ''
/** the bigger it gets the harder it is to level up */
global.multiplier = 1000
/** maximum limit to send files */
global.max_upload = 70
/** maximum 2GB ram, do the math yourself */
global.ram_usage = 2100000000
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
    // Create your imagination
  } catch {
    console.log(e)
    return conn.reply(m.chat, Func.jsonFormat(e), m)
  }
}
handler.help = ['command'] // display in the menu
handler.tags = ['category'] // category
handler.command = /^(command)$/i // command
handler.group = Boolean // for group
handler.limit = Boolean // use limit
handler.game = Boolean // game mode
handler.rpg = Boolean // rpg mode
handler.owner = Boolean // for owner
handler.admin = Boolean // for admin
handler.botAdmin = Boolean // bot must be an admin
handler.premium = Boolean // premium only
handler.private = Boolean // private chat only
```

### Plugins Event
```Javascript
let handler = (m) => m
handler.before = async (m, {
  conn
}) {
  try {
    // Create your imagination
  } catch (error) {
    console.log(error)
  }
  return !0
}
module.exports = handler
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

## Heroku Buildpack

```
heroku/nodejs
```
```
https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
```
```
https://github.com/DuckyTeam/heroku-buildpack-imagemagick.git
```

### Argument node . [--options]

+ ``` node . --pairing ``` : For those of you who login using a code, use this command in the terminal
+ ``` node . --db 'mongodb uri' ``` : If you want to connect the database to mongodb use this command
+ ``` node . --server ``` : if you want to use replit

### Thanks To
<a href="https://api.alyachan.dev"><img src="https://telegra.ph/file/8ee315efa49035e1c5e94.jpg" width="100" height="100"></a> | [![Nurutomo](https://github.com/Nurutomo.png?size=100)](https://github.com/Nurutomo) | [![Nando](https://github.com/rifnd.png?size=100)](https://github.com/rifnd)
----|----|----|----|----
[ALYACHAN](https://api.alyachan.dev/) | [Nurutomo](https://github.com/Nurutomo) | [Nando](https://github.com/rifnd)
APIs Provider | Author / Creator