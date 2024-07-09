const moment = require('moment-timezone')
moment.locale('en')
let handler = async(m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    if (!text) return m.reply(Func.example(usedPrefix, command, '@moonr/to-anime'))
    m.react('🕒')
    const json = await Func.fetchJson(API('alya', '/api/npm', { q: text }, 'apikey'))
    if (!json.status) return m.reply(Func.jsonFormat(json))
    let teks = `– *N P M J S*\n\n`
    json.data.map((v, i) => {
      teks += '*' + (i + 1) + '. ' + v.package.name + '*\n'
      teks += '  ◦  *Version* : ' + v.package.version + '\n'
      teks += '  ◦  *Description* : ' + v.package.description + '\n'
      teks += '  ◦  *Author* : @' + v.package.author.name + '\n'
      teks += '  ◦  *Published* : ' + moment(v.package.date).format('dddd, DD/MM/YYYY hh:mm') + '\n'
      teks += '  ◦  *Link* : ' + v.package.links.npm + '\n\n'
    })
    conn.reply(m.chat, teks + global.set.footer, m)
  } catch (e) {
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['npm']
handler.tags = ['internet']
handler.limit = true
module.exports = handler