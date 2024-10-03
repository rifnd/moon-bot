const fs = require('fs')
module.exports = {
   run: async (m, {
      conn,
      usedPrefix: _p,
      command,
      text,
      args,
      env,
      setting,
      Func
   }) => {
      try {
         conn.menu = conn.menu ? conn.menu : {}
         const style = setting.style
         const local_size = fs.existsSync('./database.json') ? await Func.getSize(fs.statSync('./database.json').size) : ''
         const message = setting.msg.replace('+tag', `@${m.sender.replace(/@.+/g, '')}`).replace('+name', m.name).replace('+greeting', Func.greeting()).replace('+db', (/mongo/.test(env.databaseurl) ? 'MongoDB' : `Local : ${local_size}`))
         if (style === 1) {
            let tags = {}
            const defaultMenu = {
               before: `${message}\n`.trimStart(),
               header: '  乂  *%category*\n\n┌─',
               body: '│  ◦  %cmd %isUse %isPremium',
               footer: '└─\n',
               after: `${global.footer}`,
            }
            let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
               return {
                  help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
                  tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                  use: plugin.use,
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
            let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `Powered by https://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after
            let _text = [
               before,
               ...Object.keys(tags).map(tag => {
                  return header.replace(/%category/g, tags[tag]) + '\n' + [
                     ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                        return menu.help.map(help => {
                           return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                              .replace(/%isUse/g, menu.use ? '*' + menu.use + '*' : ' ')
                              .replace(/%islimit/g, menu.limit ? 'Ⓛ' : '')
                              .replace(/%isPremium/g, menu.premium ? 'Ⓟ' : '')
                              .trim()
                        }).join('\n')
                     }), footer
                  ].join('\n')
               }), after
            ].join('\n')
            text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
            let replace = {
               '%': '%', p: _p, tag: `@${m.sender.replace(/@.+/g, '')}`, readmore: readMore
            }
            text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => a.length - b.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
            conn.sendMessageModify(m.chat, Func.Styles(text.trim()), m, {
               largeThumb: true,
               url: setting.link
            })
         } else if (style === 2) {
            const defaultMenu = {
               before: ``.trimStart(),
               header: '┌─',
               body: '│  ◦  %cmd %isUse %isPremium',
               footer: '└─\n',
               after: ``,
            }

            let help = Object.values(global.plugins).filter((plugin) => !plugin.disabled).map((plugin) => {
               return {
                  help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
                  tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                  use: plugin.use,
                  prefix: 'customPrefix' in plugin,
                  limit: plugin.limit,
                  premium: plugin.premium,
                  enabled: !plugin.disabled,
               }
            })

            let tags
            let teks = `${args[0]}`.toLowerCase()
            let arrayMenu = ['admin', 'converter', 'downloader', 'fun', 'game', 'group', 'miscs', 'user', 'tools', 'voice']
            if (!arrayMenu.includes(teks)) teks = '404'

            if (teks == 'admin') tags = {
               'admin': 'admin'
            }
            if (teks == 'converter') tags = {
               'converter': 'conveter'
            }
            if (teks == 'downloader') tags = {
               'downloader': 'downloader'
            }
            if (teks == 'fun') tags = {
               'fun': 'fun'
            }
            if (teks == 'game') tags = {
               'game': 'game'
            }
            if (teks == 'group') tags = {
               'group': 'group'
            }
            if (teks == 'miscs') tags = {
               'miscs': 'miscs'
            }
            if (teks == 'tools') tags = {
               'tools': 'tools'
            }
            if (teks == 'user') tags = {
               'user': 'user'
            }
            if (teks == 'voice') tags = {
               'voice': 'voice'
            }

            if (teks == '404') {
               let caption = `${message}\n\n`
               caption += arrayMenu.sort((a, b) => a.localeCompare(b)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + command} ${v}`
                  } else if (i == arrayMenu.sort((a, b) => a.localeCompare(b)).length - 1) {
                     return `└  ◦  ${_p + command} ${v}`
                  } else {
                     return `│  ◦  ${_p + command} ${v}`
                  }
               }).join('\n')
               caption += '\n\n' + global.footer
               return conn.sendMessageModify(m.chat, Func.Styles(caption.trim()), m, {
                  largeThumb: true,
                  thumbnail: setting.cover,
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
                           return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                              .replace(/%isUse/g, menu.use ? '*' + menu.use + '*' : ' ')
                              .replace(/%islimit/g, menu.limit ? 'Ⓛ' : '')
                              .replace(/%isPremium/g, menu.premium ? 'Ⓟ' : '').trim()
                        }).join('\n')
                     }), footer
                  ].join('\n')
               }), after
            ].join('\n')
            let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
            let replace = {
               '%': '%', p: _p, readmore: readMore
            }
            text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
            m.reply(Func.Styles(text.trim()))
         } else if (style === 3) {
            const defaultMenu = {
               before: ``.trimStart(),
               header: '┌─',
               body: '│  ◦  %cmd %isUse %isPremium',
               footer: '└─\n',
               after: ``,
            }

            let help = Object.values(plugins).filter((plugin) => !plugin.disabled).map((plugin) => {
               return {
                  help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
                  tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                  use: plugin.use,
                  prefix: 'customPrefix' in plugin,
                  limit: plugin.limit,
                  premium: plugin.premium,
                  enabled: !plugin.disabled,
               }
            })

            let tags
            let teks = `${args[0]}`.toLowerCase()
            let arrayMenu = ['admin', 'converter', 'downloader', 'fun', 'game', 'group', 'miscs', 'user', 'tools', 'voice']
            if (!arrayMenu.includes(teks)) teks = '404'

            if (teks == 'admin') tags = {
               'admin': 'admin'
            }
            if (teks == 'converter') tags = {
               'converter': 'conveter'
            }
            if (teks == 'downloader') tags = {
               'downloader': 'downloader'
            }
            if (teks == 'fun') tags = {
               'fun': 'fun'
            }
            if (teks == 'game') tags = {
               'game': 'game'
            }
            if (teks == 'group') tags = {
               'group': 'group'
            }
            if (teks == 'miscs') tags = {
               'miscs': 'miscs'
            }
            if (teks == 'tools') tags = {
               'tools': 'tools'
            }
            if (teks == 'user') tags = {
               'user': 'user'
            }
            if (teks == 'voice') tags = {
               'voice': 'voice'
            }

            const label = {
               highlight_label: 'Many Used'
            }
            let sections = []
            arrayMenu.sort((a, b) => a.localeCompare(b)).map((v, i) => sections.push({
               ...(/download|conver|util/.test(v) ? label : {}),
               rows: [{
                  title: Func.ucword(v),
                  description: `There are commands`,
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
               return conn.sendIAMessage(m.chat, buttons, m, {
                  header: '',
                  content: Func.Styles(message),
                  footer: global.footer,
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
            let after = conn.menu.after || (conn.user.jid == conn.user.jid ? '' : `Powered by httptps://wa.me/${conn.user.jid.split`@`[0]}`) + defaultMenu.after
            let _text = [
               before,
               ...Object.keys(tags).map(tag => {
                  return header.replace(/%category/g, tags[tag]) + '\n' + [
                     ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                        return menu.help.map(help => {
                           return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                              .replace(/%isUse/g, menu.use ? '*' + menu.use + '*' : ' ')
                              .replace(/%islimit/g, menu.limit ? 'Ⓛ' : '')
                              .replace(/%isPremium/g, menu.premium ? 'Ⓟ' : '').trim()
                        }).join('\n')
                     }), footer
                  ].join('\n')
               }), after
            ].join('\n')
            let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
            let replace = {
               '%': '%', p: _p, readmore: readMore
            }
            text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
            return m.reply(Func.Styles(text.trim()))
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
         console.log(e)
      }
   },
   command: /^(menu|help)$/i,
   exp: 3
}
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
