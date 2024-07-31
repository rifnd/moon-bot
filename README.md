### MOON-BOT (CJS)
> - This script is 100% free, which uses the api from [AlyaChan-APIs](https://api.alyachan.pro)
> - Using the module from [@moonr/func](https://www.npmjs.com/package/@moonr/func)
> - I edited this bot like neoxr-bot, so it's kind of the same but different

### To install this script you need
- [x] Server vCPU/RAM 1/1GB (Min)
- [x] NodeJS
- [x] FFMPEG
- [x] WhatsApp 
- [x] Apikey

**Group** : [Community](https://chat.whatsapp.com/G57unQZ7saFIq2rdpVw0Tu)

### Set in .env
```
API_ENDPOINT = 'https://api.alyachan.dev/'
API_KEY = 'yourkey'
```

### Set in config.js
```Javascript
module.exports = {
   owner: 6281252848955, // Owner Number
   owner_name: 'Contact Support', // Owner Name
   limit: '10', // Limit Default
   multiplier: '250', // Rpg
   min_reward: 100000, // Minimal Reward Game
   max_reward: 500000, // Max Reward Game
   ram_limit: '1.2GB', // Ram Limit Server
   max_upload: 150, // Max upload bot
   max_upload_free: 40, // Max upload bot free users
   timer: 180000, // Timer other
   timeout: 1800000, // Timeout other
   evaluate_chars: ['=>', '>', '$', '~>'], // Includes
   pairing: {
      state: true, // True or False
      number: 6281252848955 // Bot Number
   },
   databaseurl: '' // Database use mongodb
}
```

### Plugins 1
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
handler.use = 'example' // display example in the menu
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

### Plugins Event 1
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
  return true
}
module.exports = handler
```

### Plugins 2
```Javascript
module.exports = {
   run: async (m, {
      conn,
      text,
      participants,
      Func
   }) => {
      try {
         // your code
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   help: ['command'],
   use: 'example',
   tags: ['category'],
   command: /^(command)$/i,
   group: Boolean,
   admin: Boolean
}
```

### Plugins Event 2
```Javascript
module.exports = {
   async before(m, {
      conn,
      body,
      isOwner,
      groupSet,
      Func
   }) {
      try {
         // your code
      } catch (e) {
         console.log(e)
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
      return true
   }
}
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

### Thanks To
<a href="https://api.alyachan.dev"><img src="https://telegra.ph/file/8ee315efa49035e1c5e94.jpg" width="100" height="100"></a> | [![Nurutomo](https://github.com/Nurutomo.png?size=100)](https://github.com/Nurutomo) | [![Nando](https://github.com/rifnd.png?size=100)](https://github.com/rifnd) | [![Alya](https://github.com/alya-tok.png?size=100)](https://github.com/alya-tok) | [![Neoxr](https://github.com/neoxr.png?size=100)](https://github.com/neoxr)
----|----|----|----|----
[ALYACHAN](https://api.alyachan.dev/) | [Nurutomo](https://github.com/Nurutomo) | [Nando](https://github.com/rifnd) | [Alya](https://github.com/alya-tok) | [Neoxr](https://github.com/neoxr)
APIs Provider | Author / Creator | Decoder | Support System | All Functions