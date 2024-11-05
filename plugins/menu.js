const fs = require('fs')
module.exports = {
   command: /^(menu|help)$/i,
   run: async (m, {
      conn,
      usedPrefix: _p,
      command,
      text,
      args,
      env,
      setting,
      plugins,
      Func
   }) => {
      try {
         conn.menu = conn.menu ? conn.menu : {}
         const style = setting.style
         const local_size = fs.existsSync('./database.json') ? await Func.getSize(fs.statSync('./database.json').size) : ''
         const message = setting.msg.replace('+tag', `@${m.sender.replace(/@.+/g, '')}`).replace('+name', m.name).replace('+greeting', Func.greeting()).replace('+db', (/mongo/.test(env.databaseurl) ? 'MongoDB' : /postgresql/.test(env.databaseurl) ? 'PostgreSQL' : `Local : ${local_size}`))
         if (style === 1) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.help)
            let cmd = Object.fromEntries(filter)
            let category = {}
            for (let name in cmd) {
               let obj = cmd[name]
               if (!obj) continue
               if (!obj.tags || setting.hidden.includes(obj.tags[0])) continue
               if (!category[obj.tags[0]]) {
                  category[obj.tags[0]] = []
               }
               let usageList = obj.help.constructor.name === 'Array' ? obj.help : [obj.help]
               usageList.forEach(usage => {
                  if (!category[obj.tags[0]].some(item => item.usage === usage)) {
                     category[obj.tags[0]].push({
                        usage: usage,
                        use: obj.use ? Func.texted('bold', obj.use) : ''
                     })
                  }
               })
            }
            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001)

            for (let k of keys) {
               print += '\n\n乂  *' + k.toUpperCase().split('').join(' ') + '*\n\n'
               let commands = category[k].sort((a, b) => a.usage.localeCompare(b.usage))
               print += commands.map(v => `	◦  ${_p + v.usage} ${v.use}`).join('\n')
            }

            conn.sendMessageModify(m.chat, print + '\n\n' + global.footer, m, {
               ads: false,
               largeThumb: true,
               thumbnail: setting.cover,
               url: setting.link
            })
         } else if (style === 2) {
            // Filter hanya plugin yang memiliki 'help' dan simpan dalam variabel cmd
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.help)
            let cmd = Object.fromEntries(filter)

            // Gunakan objek kosong untuk menyimpan kategori
            let category = {}

            for (let name in cmd) {
               let obj = cmd[name]
               if (!obj) continue
               if (!obj.tags || setting.hidden.includes(obj.tags[0])) continue

               // Cek jika kategori sudah ada, jika tidak, inisialisasi sebagai array
               if (!category[obj.tags[0]]) {
                  category[obj.tags[0]] = []
               }

               // Tambahkan command ke kategori jika belum ada (mencegah duplikasi)
               let usageList = obj.help.constructor.name === 'Array' ? obj.help : [obj.help]
               usageList.forEach(usage => {
                  if (!category[obj.tags[0]].some(item => item.usage === usage)) {
                     category[obj.tags[0]].push({
                        usage: usage,
                        use: obj.use ? Func.texted('bold', obj.use) : ''
                     })
                  }
               })
            }

            // Dapatkan kunci kategori dan urutkan
            const keys = Object.keys(category).sort()
            let print = message
            // Tambahkan karakter invisible untuk memastikan pesan lengkap muncul di WhatsApp
            print += '\n' + String.fromCharCode(8206).repeat(4001)

            for (let k of keys) {
               // Tambahkan header untuk setiap kategori
               print += '\n\n –  *' + k.toUpperCase().split('').join(' ') + '*\n\n'

               // Ambil semua command dalam kategori ini dan urutkan berdasarkan `usage`
               let commands = category[k].sort((a, b) => a.usage.localeCompare(b.usage))

               // Map setiap command ke dalam format tampilan yang diinginkan
               print += commands.map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + v.usage} ${v.use}`
                  } else if (i == commands.length - 1) {
                     return `└  ◦  ${_p + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${_p + v.usage} ${v.use}`
                  }
               }).join('\n')
            }

            // Kirim pesan modifikasi ke pengguna
            conn.sendMessageModify(m.chat, print + '\n\n' + global.footer, m, {
               ads: false,
               largeThumb: true,
               thumbnail: setting.cover,
               url: setting.link
            })
         } else if (style === 3) {
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.help && v.tags && v.tags.includes(text.trim().toLowerCase()) && !setting.hidden.includes(v.tags[0]))
               let commands = []
               cmd.forEach(([_, v]) => {
                  if (v.help) {
                     if (Array.isArray(v.help)) {
                        v.help.forEach(x => {
                           commands.push({
                              usage: x,
                              use: v.use ? Func.texted('bold', v.use) : ''
                           })
                        })
                     } else {
                        commands.push({
                           usage: v.help,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        })
                     }
                  }
               })
               commands = commands.filter((v, i, self) => i === self.findIndex((t) => (t.usage === v.usage))).sort((a, b) => a.usage.localeCompare(b.usage))

               let print = commands.map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + v.usage} ${v.use}`
                  } else if (i == commands.length - 1) {
                     return `└  ◦  ${_p + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${_p + v.usage} ${v.use}`
                  }
               }).join('\n')
               m.reply(print)

            } else {
               let print = message
               print += '\n' + String.fromCharCode(8206).repeat(4001) + '\n'

               let category = {}
               Object.entries(plugins).forEach(([name, obj]) => {
                  if (obj.help && obj.tags && !setting.hidden.includes(obj.tags[0])) {
                     if (!category[obj.tags[0]]) {
                        category[obj.tags[0]] = []
                     }
                     if (!category[obj.tags[0]].some(item => item.usage === obj.help)) {
                        if (Array.isArray(obj.help)) {
                           obj.help.forEach(x => category[obj.tags[0]].push({ usage: x, use: obj.use ? Func.texted('bold', obj.use) : '' }))
                        } else {
                           category[obj.tags[0]].push({ usage: obj.help, use: obj.use ? Func.texted('bold', obj.use) : '' })
                        }
                     }
                  }
               })
               const keys = Object.keys(category).sort()
               print += keys.map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + command} ${v}`
                  } else if (i == keys.length - 1) {
                     return `└  ◦  ${_p + command} ${v}`
                  } else {
                     return `│  ◦  ${_p + command} ${v}`
                  }
               }).join('\n')
               conn.sendMessageModify(m.chat, print + '\n\n' + global.footer, m, {
                  ads: false,
                  largeThumb: true,
                  thumbnail: setting.cover,
                  url: setting.link
               })
            }
         } else if (style === 4) {
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.help && v.tags && v.tags.includes(text.trim().toLowerCase()) && !setting.hidden.includes(v.tags[0]))
               let commands = []
               cmd.forEach(([_, v]) => {
                  if (v.help) {
                     if (Array.isArray(v.help)) {
                        v.help.forEach(x => {
                           commands.push({
                              usage: x,
                              use: v.use ? Func.texted('bold', v.use) : ''
                           })
                        })
                     } else {
                        commands.push({
                           usage: v.help,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        })
                     }
                  }
               })
               commands = commands.filter((v, i, self) => i === self.findIndex((t) => (t.usage === v.usage))).sort((a, b) => a.usage.localeCompare(b.usage))

               let print = commands.map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + v.usage} ${v.use}`
                  } else if (i == commands.length - 1) {
                     return `└  ◦  ${_p + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${_p + v.usage} ${v.use}`
                  }
               }).join('\n')
               m.reply(print)

            } else {
               let print = message
               print += '\n' + String.fromCharCode(8206).repeat(4001) + '\n'

               let category = {}
               Object.entries(plugins).forEach(([name, obj]) => {
                  if (obj.help && obj.tags && !setting.hidden.includes(obj.tags[0])) {
                     if (!category[obj.tags[0]]) {
                        category[obj.tags[0]] = []
                     }
                     if (!category[obj.tags[0]].some(item => item.usage === obj.help)) {
                        if (Array.isArray(obj.help)) {
                           obj.help.forEach(x => category[obj.tags[0]].push({ usage: x, use: obj.use ? Func.texted('bold', obj.use) : '' }))
                        } else {
                           category[obj.tags[0]].push({ usage: obj.help, use: obj.use ? Func.texted('bold', obj.use) : '' })
                        }
                     }
                  }
               })
               const keys = Object.keys(category).sort()
               let sections = []
               const label = {
                  highlight_label: 'Many Used'
               }
               keys.sort((a, b) => a.localeCompare(b)).forEach((v, i) => sections.push({
                  ...(/download|conver|util/.test(v) ? label : {}),
                  rows: [{
                     title: Func.ucword(v),
                     description: `There are ${Func.arrayJoin(Object.entries(plugins).filter(([_, x]) => x.help && x.tags && x.tags.includes(v.trim().toLowerCase())).map(([_, x]) => x.help)).length} commands`,
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
               conn.sendIAMessage(m.chat, buttons, m, {
                  header: '',
                  content: print,
                  footer: global.footer,
                  media: setting.cover
               })
            }
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   exp: 3
}