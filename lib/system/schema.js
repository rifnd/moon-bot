module.exports = (m, env) => {
   const isNumber = x => typeof x === 'number' && !isNaN(x)
   let user = global.db.data.users[m.sender]
   if (user) {
      if (!isNumber(user.exp)) user.exp = 1000
      if (!isNumber(user.limit)) user.limit = env.limit
      if (!isNumber(user.money)) user.money = 1000
      if (!isNumber(user.afk)) user.afk = -1
      if (!('afkReason' in user)) user.afkReason = ''
      if (!('afkObj' in user)) user.afkObj = {}
      if (!('banned' in user)) user.banned = false
      if (!isNumber(user.ban_temporary)) user.ban_temporary = 0
      if (!isNumber(user.ban_times)) user.ban_times = 0
      if (!('premium' in user)) user.premium = false
      if (!isNumber(user.expired)) user.expired = 0
      if (!isNumber(user.lastseen)) user.lastseen = 0
      if (!isNumber(user.hit)) user.hit = 0
      if (!isNumber(user.spam)) user.spam = 0
      if (!isNumber(user.warning)) user.warning = 0
      if (!isNumber(user.level)) user.level = 0
      if (!('role' in user)) user.role = 'Warrior V'
      if (!('registered' in user)) user.registered = false
      if (!('name' in user)) user.name = m.name
      if (!isNumber(user.age)) user.age = 0
      if (!isNumber(user.regTime)) user.regTime = 0
      if (!isNumber(user.snlast)) user.snlast = 0
      if (!isNumber(user.lastclaim)) user.lastclaim = 0
      if (!isNumber(user.lastweekly)) user.lastweekly = 0
      if (!isNumber(user.lastmonthly)) user.lastmonthly = 0
   } else {
      global.db.data.users[m.sender] = {
         exp: 1000,
         limit: env.limit,
         money: 1000,
         afk: -1,
         afkReason: '',
         afkObj: {},
         banned: false,
         ban_temporary: 0,
         ban_times: 0,
         premium: false,
         expired: 0,
         lastseen: 0,
         hit: 0,
         spam: 0,
         warning: 0,
         level: 0,
         role: 'Warrior V',
         registered: false,
         name: m.name,
         age: 0,
         regTime: 0,
         snlast: 0,
         lastclaim: 0,
         lastweekly: 0,
         lastmonthly: 0
      }
   }

   if (m.isGroup) {
      let group = global.db.data.groups[m.chat]
      if (group) {
         if (!isNumber(group.activity)) group.activity = 0
         if (!('isBanned' in group)) group.isBanned = false
         if (!('welcome' in group)) group.welcome = false
         if (!('sWelcome' in group)) group.sWelcome = ''
         if (!('sBye' in group)) group.sBye = ''
         if (!('detect' in group)) group.detect = false
         if (!('sPromote' in group)) group.sPromote = ''
         if (!('sDemote' in group)) group.sDemote = ''
         if (!('antidelete' in group)) group.antidelete = false
         if (!('antilink' in group)) group.antilink = false
         if (!('antivirtex' in group)) group.antivirtex = false
         if (!('autosticker' in group)) group.autosticker = false
         if (!('antisticker' in group)) group.antisticker = false
         if (!('viewonce' in group)) group.viewonce = false
         if (!('filter' in group)) group.filter = false
         if (!('member' in group)) group.member = {}
         if (!isNumber(group.expired)) group.expired = 0
         if (!('stay' in group)) group.stay = {}
      } else {
         global.db.data.groups[m.chat] = {
            activity: 0,
            isBanned: false,
            welcome: false,
            sWelcome: '',
            sBye: '',
            detect: false,
            sPromote: '',
            sDemote: '',
            antidelete: false,
            antilink: false,
            antivirtex: false,
            autosticker: false,
            viewonce: false,
            filter: false,
            member: {},
            expired: 0,
            stay: false
         }
      }
   }

   let chat = global.db.data.chats[m.chat]
   if (chat) {
      if (!isNumber(chat.chat)) chat.chat = 0
      if (!isNumber(chat.lastchat)) chat.lastchat = 0
      if (!isNumber(chat.command)) chat.command = 0
   } else {
      global.db.data.chats[m.chat] = {
         chat: 0,
         lastchat: 0,
         command: 0
      }
   }

   let setting = global.db.data.setting
   if (setting) {
      if (!('anticall' in setting)) setting.anticall = false
      if (!('self' in setting)) setting.self = false
      if (!('online' in setting)) setting.online = false
      if (!('antispam' in setting)) setting.antispam = false
      if (!('debug' in setting)) setting.debug = false
      if (!('groupmode' in setting)) setting.groupmode = false
      if (!('privatemode' in setting)) setting.privatemode = false
      if (!('game' in setting)) setting.game = false
      if (!('rpg' in setting)) setting.rpg = false
      if (!('sk_pack' in setting)) setting.sk_pack = 'Sticker by'
      if (!('sk_author' in setting)) setting.sk_author = '© moon-bot'
      if (!('toxic' in setting)) setting.toxic = ['kontol', 'memek', 'jembot', 'peli', 'jembot', 'jancok', 'ancok', 'gancok', 'dancok', 'bajingan', 'tempek', 'kirek', 'raimu', 'bangsat', 'turok', 'pukimak', 'telaso', 'bawok', 'bacot', 'biadap', 'biadab', 'bego', 'fuck', 'bokep', 'coli', 'colmek', 'comli', 'kanjut', 'tolol']
      if (!('owners' in setting)) setting.owners = ['6281252848955']
      if (!('msg' in setting)) setting.msg = 'Hi +tag 🪸\nI am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.\n\n◦ *Database* : +db\n◦ *Library* : Baileys\n◦ *Rest API* : https://api.alyachan.dev\n◦ *Source* : https://github.com/rifnd/moon-bot\n\nIf you find an error or want to upgrade premium plan contact the owner.'
      if (!isNumber(setting.style)) setting.style = 1
      if (!('cover' in setting)) setting.cover = 'https://telegra.ph/file/d826ed4128ba873017479.jpg'
      if (!('link' in setting)) setting.link = 'https://chat.whatsapp.com/Dh1USlrqIfmJT6Ji0Pm2pP'
   } else {
      global.db.data.setting = {
         anticall: false,
         self: false,
         online: false,
         antispam: false,
         debug: false,
         groupmode: false,
         privatemode: false,
         game: false,
         rpg: false,
         sk_pack: 'Sticker by',
         sk_author: '© moon-bot',
         toxic: ['kontol', 'memek', 'jembot', 'peli', 'jembot', 'jancok', 'ancok', 'gancok', 'dancok', 'bajingan', 'tempek', 'kirek', 'raimu', 'bangsat', 'turok', 'pukimak', 'telaso', 'bawok', 'bacot', 'biadap', 'biadab', 'bego', 'fuck', 'bokep', 'coli', 'colmek', 'comli', 'kanjut', 'tolol'],
         owners: ['6281252848955'],
         msg: 'Hi +tag 🪸\nI am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.\n\n◦ *Database* : +db\n◦ *Library* : Baileys\n◦ *Rest API* : https://api.alyachan.dev\n◦ *Source* : https://github.com/rifnd/moon-bot\n\nIf you find an error or want to upgrade premium plan contact the owner.',
         style: 1,
         cover: 'https://telegra.ph/file/d826ed4128ba873017479.jpg',
         link: 'https://chat.whatsapp.com/Dh1USlrqIfmJT6Ji0Pm2pP'
      }
   }
}