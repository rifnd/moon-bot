const moment = require('moment-timezone')
moment.locale('en')
module.exports = {
   help: ['npmjs'],
   use: 'query',
   tags: ['internet'],
   command: /^(npmjs)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, '@moonr/to-anime'))
         m.react('🕒')
         const json = await Api.get('api/npm', {
            q: text
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         if (json.data.length == 0) return m.reply(Func.texted('bold', '🚩 Package not found.'))
         let teks = `– *N P M J S*\n\n`
         json.data.map((v, i) => {
            teks += '*' + (i + 1) + '. ' + v.package.name + '*\n'
            teks += '  ◦  *Version* : ' + v.package.version + '\n'
            teks += '  ◦  *Description* : ' + v.package.description + '\n'
            teks += '  ◦  *Author* : @' + v.package.author.name + '\n'
            teks += '  ◦  *Published* : ' + moment(v.package.date).format('dddd, DD/MM/YYYY hh:mm') + '\n'
            teks += '  ◦  *Link* : ' + v.package.links.npm + '\n\n'
         })
         conn.reply(m.chat, teks + global.footer, m)
      } catch (e) {
         console.log(e)
         return m.reply(Func.texted('bold', '🚩 Package not found.'))
      }
   },
   limit: true,
}