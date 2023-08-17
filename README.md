### MOON-BOT
> Script ini gratis, menggunakan 99% api dari [AlyaChan-APIs](https://api.alyachan.biz.id)

### Yang dibutuhkan
- [x] Server
- [x] WhatsApp
- [x] ffmpeg
- [x] imagemagick

### Settings di config.js
```Javascript
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
  'https://api.alychan.biz.id', 'YOURKEY'
}

global.set = {
  link: 'https://chat.whatsapp.com/EIe1hJspvpj3pzXYckeHkh',
  thumbnail: 'https://i.ibb.co/gtr5L2k/Supermoon-2012.jpg',
  wm: 'ᴍᴏᴏɴ ʙᴏᴛ ᴏɴʟɪɴᴇ',
  footer: 'ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ʙʏ ᴍᴏᴏɴ',
  packname: 'Sticker By',
  author: '@naando.io'
}

global.multiplier = 7
global.max_upload = 70
global.intervalmsg = 1800
```

### Plugins
```Javascript
let handler = async (m, {
  usedPrefix,
  command,
  args
}) => {
  try {

  } catch (e) {
    console.log(e)
  }
}
handler.help = ['command']
handler.tags = ['category']
handler.command = /^(command)$/i
module.exports = handler

```

