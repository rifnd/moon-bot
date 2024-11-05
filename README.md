### MOON-BOT
> This script is 100% free, which uses the api from [AlyaChan-APIs](https://api.alyachan.pro)

### To install this script you need
- [x] Server vCPU/RAM 1/1GB (Min)
- [x] NodeJS
- [x] FFMPEG
- [x] WhatsApp 
- [x] Apikey

**Group** : [Community](https://chat.whatsapp.com/G57unQZ7saFIq2rdpVw0Tu)

<br><hr><br>

<details>
<summary><b>Setting Options</b></summary>

### Set in .env
```.env
API_ENDPOINT = 'https://api.alyachan.dev/'
API_KEY = 'yourkey'
```

### Set in config.json
```JSON
{
   "owner": "6281252848955",
   "owner_name": "Contact Support",
   "limit": "10",
   "multiplier": "250",
   "min_reward": 100000,
   "max_reward": 500000,
   "ram_limit": "1.2GB",
   "max_upload": 150,
   "max_upload_free": 40,
   "timer": 180000,
   "timeout": 1800000,
   "evaluate_chars": ["=>", ">", "$", "~>", "!", "+", "/", "#", "."],
   "pairing": {
     "state": false,
     "number": 62000
   },
   "databaseurl": ""
}
```
</details><br>

<details>
<summary><b>Database</b></summary>

There are 2 databases, mongoDB and postgreSQL, but I recommend using mongoDB instead.
> - MongoDB ~ [https://www.mongodb.com]
> - PostgreSQL ~ [https://supabase.com]

</details><br>

<details>
<summary><b>Plugins</b></summary>

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
</details><br>

<details>
<summary><b>Install</br></summary>

### Install and run
```sh
$ npm install
$ npm start
```

## Install & Run use PM2

```sh
$ npm install pm2 -g
$ npm install
$ pm2 start index.js && pm2 save && pm2 logs
```

## Heroku Buildpack
> - heroku/nodejs
> - https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
> - https://github.com/DuckyTeam/heroku-buildpack-imagemagick.git
</details>
