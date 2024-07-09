let fs = require('fs')
let path = require('path')
let levelling = require('../lib/levelling')
let moment = require('moment-timezone')
let handler = async (m, {
   usedPrefix: _p,
   command,
   text,
   args,
   setting
}) => {
   try {
      conn.menu = conn.menu ? conn.menu : {}
      const style = setting.style
      if (style === 1) {
         let tags = {
            anonymous: 'Anonymous',
            database: 'Database',
            downloader: 'Downloader',
            effect: 'Effect',
            fun: 'Fun',
            game: 'Game',
            group: 'Group',
            info: 'Info',
            internet: 'Internet',
            maker: 'Maker',
            owner: 'Owner',
            sticker: 'Sticker',
            tools: 'Tools',
            xp: 'User Info',
            voice: 'Voice',
         }
         const defaultMenu = {
            before: `Hai, %tag👋!
I am an automatic system (WhatsApp Bot), which can help you to complete small jobs such as downloading videos or images etc. just via WhatsApp.

∘  *Version* : ${require('../package.json').version}
∘  *Rest Api* : https://api.alyachan.dev
∘  *Source* : https://github.com/rifnd/moon-bot

If you find a bug or want a premium upgrade, please contact the owner.
%readmore`.trimStart(),
            header: '  –  *%category*\n\n┌─',
            body: '│  ◦  %cmd %isPremium',
            footer: '└─\n',
            after: `${global.set.footer}`,
         }
         let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
         let { exp, limit, level, role } = global.db.data.users[m.sender]
         let { min, xp, max } = levelling.xpRange(level, global.multiplier)
         let name = conn.getName(m.sender)
         let d = new Date(new Date + 3600000)
         let locale = 'id'
         // d.getTimeZoneOffset()
         // Offset -420 is 18.00
         // Offset    0 is  0.00
         // Offset  420 is  7.00
         let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
         let week = d.toLocaleDateString(locale, { weekday: 'long' })
         let date = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
         })
         let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
         }).format(d)
         let time = d.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
         })
         let _uptime = process.uptime() * 1000
         let _muptime
         if (process.send) {
            process.send('uptime')
            _muptime = await new Promise(resolve => {
               process.once('message', resolve)
               setTimeout(resolve, 1000)
            }) * 1000
         }
         let muptime = clockString(_muptime)
         let uptime = clockString(_uptime)
         let totalreg = Object.keys(global.db.data.users).length
         let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
         let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
               help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
               tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
               prefix: 'customPrefix' in plugin,
               limit: plugin.limit,
               premium: plugin.premium,
               enabled: !plugin.disabled,
            }
         })
         for (let plugin of help)
            if (plugin && 'tags' in plugin)
               for (let tag of plugin.tags)
                  if (!(tag in tags) && tag) tags[tag] = tag
         conn.menu = conn.menu ? conn.menu : {}
         let before = conn.menu.before || defaultMenu.before
         let header = conn.menu.header || defaultMenu.header
         let body = conn.menu.body || defaultMenu.body
         let footer = conn.menu.footer || defaultMenu.footer
         let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
         let _text = [
            before,
            ...Object.keys(tags).map(tag => {
               return header.replace(/%category/g, tags[tag]) + '\n' + [
                  ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                     return menu.help.map(help => {
                        return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                           .replace(/%islimit/g, menu.limit ? 'Ⓛ' : '')
                           .replace(/%isPremium/g, menu.premium ? 'Ⓟ' : '')
                           .trim()
                     }).join('\n')
                  }),
                  footer
               ].join('\n')
            }),
            after
         ].join('\n')
         text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
         let replace = {
            '%': '%', p: _p, uptime, muptime, me: conn.user.name, tag: `@${m.sender.replace(/@.+/g, '')}`, npmname: package.name, npmdesc: package.description, version: package.version, exp: exp - min, maxexp: xp, totalexp: exp, xp4levelup: max - exp, github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]', level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role, readmore: readMore
         }
         text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
         conn.sendMessageModify(m.chat, Func.Styles(text.trim()), m, {
            largeThumb: true,
            url: setting.link
         })
      } else if (style === 2) {
         const defaultMenu = {
            before: ``.trimStart(),
            header: '┌─',
            body: `│  ◦  %cmd %isPremium`,
            footer: '└─\n',
            after: ``,
         }
         let tags
         let teks = `${args[0]}`.toLowerCase()
         let arrayMenu = ['anonymous', 'database', 'downloader', 'effect', 'fun', 'game', 'group', 'info', 'internet', 'maker', 'owner', 'sticker', 'tools', 'xp', 'voice']
         if (!arrayMenu.includes(teks)) teks = '404'
         if (teks == 'anonymous') tags = {
            anonymous: 'ANONYMOUS'
         }
         if (teks == 'database') tags = {
            database: 'DATABASE'
         }
         if (teks == 'downloader') tags = {
            downloader: 'DOWNLOADER'
         }
         if (teks == 'effect') tags = {
            effect: 'EFFECT'
         }
         if (teks == 'fun') tags = {
            fun: 'FUN'
         }
         if (teks == 'game') tags = {
            game: 'GAME'
         }
         if (teks == 'group') tags = {
            group: 'GROUP'
         }
         if (teks == 'info') tags = {
            info: 'INFO'
         }
         if (teks == 'internet') tags = {
            internet: 'INTERNET'
         }
         if (teks == 'maker') tags = {
            maker: 'MAKER'
         }
         if (teks == 'owner') tags = {
            owner: 'OWNER'
         }
         if (teks == 'sticker') tags = {
            sticker: 'STICKER'
         }
         if (teks == 'tools') tags = {
            tools: 'TOOLS'
         }
         if (teks == 'xp') tags = {
            xp: 'USER INFO'
         }
         if (teks == 'voice') tags = {
            voice: 'VOICE'
         }

         let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
         let { exp, limit, level, role } = db.data.users[m.sender]
         let { min, xp, max } = levelling.xpRange(level, global.multiplier)
         let name = conn.getName(m.sender)
         let d = new Date(new Date() + 3600000)
         let locale = 'id'
         // d.getTimeZoneOffset()
         // Offset -420 is 18.00
         // Offset    0 is  0.00
         // Offset  420 is  7.00
         let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
         let wita = moment.tz('Asia/Makassar').format('HH:mm:ss')
         let wit = moment.tz('Asia/Jayapura').format('HH:mm:ss')
         let weton = ['pahing', 'pon', 'wage', 'kliwon', 'legi'][Math.floor(d / 84600000) % 5]
         let week = d.toLocaleDateString(locale, {
            weekday: 'long'
         })
         let date = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
         })
         let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
         }).format(d)
         let time = d.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
         })
         let _uptime = process.uptime() * 1000
         let _muptime
         if (process.send) {
            process.send('uptime')
            _muptime = (await new Promise((resolve) => {
               process.once('message', resolve)
               setTimeout(resolve, 1000)
            })) * 1000
         }
         let muptime = clockString(_muptime)
         let uptime = clockString(_uptime)
         let totalreg = Object.keys(db.data.users).length
         let rtotalreg = Object.values(db.data.users).filter((user) => user.registered == true).length
         let help = Object.values(plugins).filter((plugin) => !plugin.disabled).map((plugin) => {
            return {
               help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
               tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
               prefix: 'customPrefix' in plugin,
               limit: plugin.limit,
               premium: plugin.premium,
               enabled: !plugin.disabled,
            }
         })

         if (teks == '404') {
            let caption = `Hi @${m.sender.replace(/@.+/g, '')}👋!\n`
            caption += `I am an automatic system (WhatsApp Bot), which can help you to complete small jobs such as downloading videos or images etc. just via WhatsApp.\n\n`
            caption += `∘  *Version* : ${require('../package.json').version}\n`
            caption += `∘  *Rest Api* : https://api.alyachan.pro\n`
            caption += `∘  *Source* : https://github.com/rifnd/moon-bot\n\n`
            caption += `If you find a bug or want a premium upgrade, please contact the owner.\n\n`
            caption += arrayMenu.sort((a, b) => a.localeCompare(b)).map((v, i) => {
               if (i == 0) {
                  return `┌  ◦  ${_p + command} ${v}`
               } else if (i == arrayMenu.sort((a, b) => a.localeCompare(b)).length - 1) {
                  return `└  ◦  ${_p + command} ${v}`
               } else {
                  return `│  ◦  ${_p + command} ${v}`
               }
            }).join('\n')
            caption += '\n\n' + global.set.footer
            return conn.sendMessageModify(m.chat, Func.Styles(caption.trim()), m, {
               largeThumb: true,
               url: setting.link
            })
         }
         let groups = {}
         for (let tag in tags) {
            groups[tag] = []
            for (let plugin of help)
               if (plugin.tags && plugin.tags.includes(tag))
                  if (plugin.help) groups[tag].push(plugin)
            //for (let tag of plugin.tags)
            //if (!(tag in tags)) tags[tag] = tag
         }

         //conn.menu = conn.menu ? conn.menu: {}
         let before = conn.menu.before || defaultMenu.before
         let header = conn.menu.header || defaultMenu.header
         let body = conn.menu.body || defaultMenu.body
         let footer = conn.menu.footer || defaultMenu.footer
         let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `Powered by https://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after
         let _text = [
            before,
            ...Object.keys(tags).map(tag => {
               return header.replace(/%category/g, tags[tag]) + '\n' + [
                  ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                     return menu.help.map(help => {
                        return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help).replace(/%islimit/g, menu.limit ? 'Ⓛ' : '').replace(/%isPremium/g, menu.premium ? 'Ⓟ' : '').trim()
                     }).join('\n')
                  }), footer
               ].join('\n')
            }), after
         ].join('\n')
         let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
         let replace = {
            '%': '%', p: _p, uptime, muptime, me: conn.user.name, npmname: package.name, npmdesc: package.description, version: package.version, exp: exp - min, maxexp: xp, totalexp: exp, xp4levelup: max - exp, github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]', level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role, readmore: readMore
         }
         text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
         m.reply(Func.Styles(text.trim()))
      } else if (style === 3) {
         const defaultMenu = {
            before: ``.trimStart(),
            header: '┌─',
            body: `│  ◦  %cmd %isPremium`,
            footer: '└─\n',
            after: ``,
         }
         let tags
         let teks = `${args[0]}`.toLowerCase()
         let arrayMenu = ['anonymous', 'database', 'downloader', 'effect', 'fun', 'game', 'group', 'info', 'internet', 'maker', 'owner', 'sticker', 'tools', 'xp', 'voice']
         if (!arrayMenu.includes(teks)) teks = '404'
         if (teks == 'anonymous') tags = {
            anonymous: 'ANONYMOUS'
         }
         if (teks == 'database') tags = {
            database: 'DATABASE'
         }
         if (teks == 'downloader') tags = {
            downloader: 'DOWNLOADER'
         }
         if (teks == 'effect') tags = {
            effect: 'EFFECT'
         }
         if (teks == 'fun') tags = {
            fun: 'FUN'
         }
         if (teks == 'game') tags = {
            game: 'GAME'
         }
         if (teks == 'group') tags = {
            group: 'GROUP'
         }
         if (teks == 'info') tags = {
            info: 'INFO'
         }
         if (teks == 'internet') tags = {
            internet: 'INTERNET'
         }
         if (teks == 'maker') tags = {
            maker: 'MAKER'
         }
         if (teks == 'owner') tags = {
            owner: 'OWNER'
         }
         if (teks == 'sticker') tags = {
            sticker: 'STICKER'
         }
         if (teks == 'tools') tags = {
            tools: 'TOOLS'
         }
         if (teks == 'xp') tags = {
            xp: 'USER INFO'
         }
         if (teks == 'voice') tags = {
            voice: 'VOICE'
         }

         let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
         let { exp, limit, level, role } = db.data.users[m.sender]
         let { min, xp, max } = levelling.xpRange(level, global.multiplier)
         let name = conn.getName(m.sender)
         let d = new Date(new Date() + 3600000)
         let locale = 'id'
         // d.getTimeZoneOffset()
         // Offset -420 is 18.00
         // Offset    0 is  0.00
         // Offset  420 is  7.00
         let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
         let wita = moment.tz('Asia/Makassar').format('HH:mm:ss')
         let wit = moment.tz('Asia/Jayapura').format('HH:mm:ss')
         let weton = ['pahing', 'pon', 'wage', 'kliwon', 'legi'][Math.floor(d / 84600000) % 5]
         let week = d.toLocaleDateString(locale, {
            weekday: 'long'
         })
         let date = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
         })
         let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
         }).format(d)
         let time = d.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
         })
         let _uptime = process.uptime() * 1000
         let _muptime
         if (process.send) {
            process.send('uptime')
            _muptime = (await new Promise((resolve) => {
               process.once('message', resolve)
               setTimeout(resolve, 1000)
            })) * 1000
         }
         let muptime = clockString(_muptime)
         let uptime = clockString(_uptime)
         let totalreg = Object.keys(db.data.users).length
         let rtotalreg = Object.values(db.data.users).filter((user) => user.registered == true).length
         let help = Object.values(plugins).filter((plugin) => !plugin.disabled).map((plugin) => {
            return {
               help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
               tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
               prefix: 'customPrefix' in plugin,
               limit: plugin.limit,
               premium: plugin.premium,
               enabled: !plugin.disabled,
            }
         })

         const label = {
            highlight_label: 'Many Used'
         }
         let sections = []
         arrayMenu.sort((a, b) => a.localeCompare(b)).map((v, i) => sections.push({
            ...(/download|too|gam/.test(v) ? label : {}),
            rows: [{
               title: Func.ucword(v),
               //description: `There are commands`,
               id: `${_p + command} ${v}`
            }]
         }))
         const buttons = [{
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
               title: 'Tap Here!',
               sections
            })
         }]

         if (teks == '404') {
            let caption = `Hi @${m.sender.replace(/@.+/g, '')}👋!\n`
            caption += `I am an automatic system (WhatsApp Bot), which can help you to complete small jobs such as downloading videos or images etc. just via WhatsApp.\n\n`
            caption += `∘  *Version* : ${require('../package.json').version}\n`
            caption += `∘  *Rest Api* : https://api.alyachan.pro\n`
            caption += `∘  *Source* : https://github.com/rifnd/moon-bot\n\n`
            caption += `If you find a bug or want a premium upgrade, please contact the owner.\n`
            return conn.sendAIMessage(m.chat, buttons, m, {
               header: '',
               content: Func.Styles(caption),
               footer: global.set.footer,
               media: setting.cover
            })
         }
         let groups = {}
         for (let tag in tags) {
            groups[tag] = []
            for (let plugin of help)
               if (plugin.tags && plugin.tags.includes(tag))
                  if (plugin.help) groups[tag].push(plugin)
            //for (let tag of plugin.tags)
            //if (!(tag in tags)) tags[tag] = tag
         }

         //conn.menu = conn.menu ? conn.menu: {}
         let before = conn.menu.before || defaultMenu.before
         let header = conn.menu.header || defaultMenu.header
         let body = conn.menu.body || defaultMenu.body
         let footer = conn.menu.footer || defaultMenu.footer
         let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `Powered by https://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after
         let _text = [
            before,
            ...Object.keys(tags).map(tag => {
               return header.replace(/%category/g, tags[tag]) + '\n' + [
                  ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                     return menu.help.map(help => {
                        return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help).replace(/%islimit/g, menu.limit ? 'Ⓛ' : '').replace(/%isPremium/g, menu.premium ? 'Ⓟ' : '').trim()
                     }).join('\n')
                  }), footer
               ].join('\n')
            }), after
         ].join('\n')
         let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
         let replace = {
            '%': '%', p: _p, uptime, muptime, me: conn.user.name, npmname: package.name, npmdesc: package.description, version: package.version, exp: exp - min, maxexp: xp, totalexp: exp, xp4levelup: max - exp, github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]', level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role, readmore: readMore
         }
         text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
         m.reply(Func.Styles(text.trim()))
      }
   } catch (e) {
      console.log(e)
      conn.reply(m.chat, Func.jsonFormat(e), m)
   }
}
handler.command = /^(menu|help|\?)$/i
handler.exp = 3
module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
   let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
   let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
   let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
   return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}