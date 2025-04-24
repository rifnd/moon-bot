module.exports = (m, env) => {
   const isNumber = x => typeof x === 'number' && !isNaN(x)
   let user = global.db.users[m.sender]
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
      if (!isNumber(user.unreglast)) user.unreglast = 0
      if (!isNumber(user.lasthourly)) user.lasthourly = 0
      if (!isNumber(user.lastclaim)) user.lastclaim = 0
      if (!isNumber(user.lastweekly)) user.lastweekly = 0
      if (!isNumber(user.lastmonthly)) user.lastmonthly = 0
      if (!isNumber(user.lastyearly)) user.lastyearly = 0
      if (!('cai' in user)) user.cai = ''
   } else {
      global.db.users[m.sender] = {
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
         unreglast: 0,
         lasthourly: 0,
         lastclaim: 0,
         lastweekly: 0,
         lastmonthly: 0,
         lastyearly: 0,
         cai: ''
      }
   }

   if (m.isGroup) {
      let group = global.db.groups[m.chat]
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
         if (!('antiporn' in group)) group.antiporn = false
         if (!('viewonce' in group)) group.viewonce = false
         if (!('filter' in group)) group.filter = false
         if (!('antitagsw' in group)) group.antitagsw = false
         if (!('member' in group)) group.member = {}
         if (!isNumber(group.expired)) group.expired = 0
         if (!('stay' in group)) group.stay = {}
      } else {
         global.db.groups[m.chat] = {
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
            antisticker: false,
            antiporn: false,
            viewonce: false,
            filter: false,
            antitagsw: false,
            member: {},
            expired: 0,
            stay: false
         }
      }
   }

   let chat = global.db.chats[m.chat]
   if (chat) {
      if (!isNumber(chat.chat)) chat.chat = 0
      if (!isNumber(chat.lastchat)) chat.lastchat = 0
      if (!isNumber(chat.command)) chat.command = 0
   } else {
      global.db.chats[m.chat] = {
         chat: 0,
         lastchat: 0,
         command: 0
      }
   }

   let setting = global.db.setting
   if (setting) {
      if (!('anticall' in setting)) setting.anticall = false
      if (!('chatbot' in setting)) setting.chatbot = false
      if (!('levelup' in setting)) setting.levelup = false
      if (!('self' in setting)) setting.self = false
      if (!('online' in setting)) setting.online = true
      if (!('antispam' in setting)) setting.antispam = false
      if (!('debug' in setting)) setting.debug = false
      if (!('autodownload' in setting)) setting.autodownload = false
      if (!('groupmode' in setting)) setting.groupmode = false
      if (!('privatemode' in setting)) setting.privatemode = false
      if (!('game' in setting)) setting.game = false
      if (!('rpg' in setting)) setting.rpg = false
      if (!('noprefix' in setting)) setting.noprefix = false
      if (!('onlyprefix' in setting)) setting.onlyprefix = '.'
      if (!('prefix' in setting)) setting.prefix = ['.', '/', '#', '!']
      if (!('hidden' in setting)) setting.hidden = []
      if (!('error' in setting)) setting.error = []
      if (!('pluginDisable' in setting)) setting.pluginDisable = []
      if (!isNumber(setting.lastReset)) setting.lastReset = 0
      if (!('sk_pack' in setting)) setting.sk_pack = 'Sticker by'
      if (!('sk_author' in setting)) setting.sk_author = '© moon-bot'
      if (!('toxic' in setting)) setting.toxic = ['jancok', 'bajingan']
      if (!('owners' in setting)) setting.owners = ['6281252848955']
      if (!('msg' in setting)) setting.msg = '+greeting +tag👋\nI am moon, a versatile WhatsApp bot ready to help you.\n\n◦  *Database* : +db\n◦  *Source* : https://github.com/rifnd/moon-bot\n◦  *Rest API* : https://api.alyachan.dev\n\nIf there is a mistake or error, contact the owner.'
      if (!isNumber(setting.style)) setting.style = 1
      if (!('cover' in setting)) setting.cover = 'https://telegra.ph/file/214d09bfb0e5c9b772e8a.jpg'
      if (!('link' in setting)) setting.link = 'https://whatsapp.com/channel/0029Va9dXn43mFY0QpulQ60K'
   } else {
      global.db.setting = {
         anticall: false,
         chatbot: false,
         levelup: false,
         self: false,
         online: true,
         antispam: false,
         debug: false,
         autodownload: false,
         groupmode: false,
         privatemode: false,
         game: false,
         rpg: false,
         noprefix: false,
         onlyprefix: '.',
         prefix: ['.', '/', '#', '!'],
         hidden: [],
         error: [],
         pluginDisable: [],
         lastReset: 0,
         sk_pack: 'Sticker by',
         sk_author: '© moon-bot',
         toxic: ['jancok', 'bajingan'],
         owners: ['6281252848955'],
         msg: '+greeting +tag👋\nI am moon, a versatile WhatsApp bot ready to help you.\n\n◦  *Database* : +db\n◦  *Source* : https://github.com/rifnd/moon-bot\n◦  *Rest API* : https://api.alyachan.dev\n\nIf there is a mistake or error, contact the owner.',
         style: 1,
         cover: 'https://telegra.ph/file/214d09bfb0e5c9b772e8a.jpg',
         link: 'https://whatsapp.com/channel/0029Va9dXn43mFY0QpulQ60K'
      }
   }
}