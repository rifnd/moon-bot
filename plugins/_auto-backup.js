let fs = require('fs')
let moment = require('moment-timezone')
let handler = (m) => m
handler.all = async function (m) {
  const setting = db.data.settings[this.user.jid]
  if (setting.backup) {
    if (new Date() * 1 - setting.backupTime > 1000 * 60 * 60) {
      let d = new Date()
      let date = d.toLocaleDateString('id', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      await global.db.write()
      this.reply(global.owner + '@s.whatsapp.net', `Database: ${date}`, null)
      let data = fs.readFileSync('./database.json')
      await this.sendMessage(global.owner + '@s.whatsapp.net', {
        document: data,
        mimetype: 'application/json',
        fileName: 'database.json',
      }, {
        quoted: null
      })
      setting.backupTime = new Date() * 1
    }
  }
  return !0
}
module.exports = handler