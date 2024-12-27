### MOON BOT
> This script is 100% free, which uses the api from [AlyaChan-APIs](https://api.alyachan.dev)


**Group** : [Community](https://chat.whatsapp.com/G57unQZ7saFIq2rdpVw0Tu)


### Requirements

- [x] Server vCPU/RAM 1/1GB (Min)
- [x] NodeJS
- [x] FFMPEG
- [x] WhatsApp 
- [x] Apikey


### Server

- [x] [Heroku](https://heroku.com/) (Recommended)
- [x] VPS/RDP [DigitalOcean](https://digitalocean.com/)
- [x] VPS NAT [HostData](https://hostdata.id/)
- [x] Panel [Optiklink](https://optiklink.com/)

Note : 
- Do not use fake panels, usually have bocil JB, use trusted panels, there is a price there is quality
- Jangan menggunakan panel abal abal, biasanya punya bocil JB, gunakanlah panel yang terpercaya, ada harga ada kualitas

### Database

- [x] [MongoDB](https://mongodb.com) (Recommended)
- [x] PostgreSQL [Supebase](https://supebase.com)
- [x] PostgreSQL / MongoDB [Railway](https://railway.app) (For testing)


### Configuration

There are 3 files that can be changed [.env](/.env), [config.json](/config.json) and [config.js](/lib/system/config.js)


```.env
DATABASE_URL = ''
API_ENDPOINT = 'https://api.alyachan.dev/'
API_KEY = 'yourkey'
```
```json
{
   "owner": "6281252848955",
   "owner_name": "Contact Support",
   "limit": "10",
   "multiplier": "250",
   "min_reward": 5000,
   "max_reward": 20000,
   "ram_limit": "1.2GB",
   "max_upload": 150,
   "max_upload_free": 40,
   "timer": 120000,
   "timeout": 1800000,
   "evaluate_chars": ["=>", ">", "$", "~>", "!", "+", "/", "#", "."],
   "pairing": {
     "state": false,
     "number": 62000
   }
}
```

```Javascript
global.header = `moon-bot v${require('../../package.json').version}`
global.footer = Func.Styles('simple whatsapp bot made by moon')
```

### For Heroku users

Install buildpack

- Heroku/Nodejs
- https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
- https://github.com/DuckyTeam/heroku-buildpack-imagemagick.git

### For Windows / RDP users

- Download and install Git [here](https://git-scm.com/downloads)
- Download and install NodeJS [here](https://nodejs.org/en/download)
- Download and install FFMPEG [here](https://ffmpeg.org/download.html)
- Download and install ImageMagick [here](https://imagemagick.org/script/download.php)

### Installation & Run

```bash
$ bash install.sh
$ git clone https://github.com/rifnd/moon-bot
$ cd moon-bot
$ npm install
$ node .
```

### Use PM2

```bash
$ pm2 start index.js --name "mybot"
```

### Pairing Code

```Json
{
   "pairing": {
     "state": false, /** true to enable, false to disable */
     "number": 62000 /** here's the bot number */
   },
}
```

### Plugins

Note :
- Works with old and new plugins
- Bisa untuk plugin lama dan plugin baru

```Javascript
module.exports = {
   help: ['display'],
   tags: ['category'],
   command: ['command'],
   run: async (m, {
      conn,
      usedPrefix,
      prefixes,
      command,
      args,
      text,
      body,
      plugins,
      Scraper,
      Func
   }) => {
      const raimu = require('jancok')
      console.log(raimu.asu)
   },
   limit: Boolean,
   premium: Boolean,
   group: Boolean,
   private: Boolean,
   owner: Boolean,
   admin: Boolean,
   botAdmin: Boolean,
   register: Boolean
}
```

### Plugins Events

```Javascript
module.exports = {
   async before(m, {
      conn,
      Scraper,
      Func
   }) {
      try {
         const raimu = require('jancok')
         console.log(raimu.ancok)
      } catch (e) {
         console.log(e)
      }
      return true
   }
}
```

<p align="center">This script is still in development and will continue to be updated, keep an eye on this repository, don't forget to give stars and forks</p>

<p align="center">Adios.....</p>