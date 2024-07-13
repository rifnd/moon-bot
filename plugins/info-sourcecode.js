const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta')
let handler = async m => {
  let json = await Func.fetchJson('https://api.github.com/repos/moonxxl/moon-bot')
  let capt = `–  *S C R I P T*\n\n`
  capt += `  ∘  *Name* : ${json.name}\n`
  capt += `  ∘  *Size* : ${(json.size / 1024).toFixed(2)} MB\n`
  capt += `  ∘  *Updated* : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`
  capt += `  ∘  *Url* : ${json.html_url}\n`
  capt += `  ∘  *Forks* : ${json.forks_count}\n`
  capt += `  ∘  *Stars* : ${json.stargazers_count}\n`
  capt += `  ∘  *Issues* : ${json.open_issues_count}\n\n`
  capt += global.set.footer
  conn.sendMessageModify(m.chat, capt, m, {
    title: 'Moon - Bot',
    body: 'hi everybody',
    largeThumb: true,
    url: 'https://github.com/Nando35/moon-bot'
  })
}
handler.help = ['sourcecode']
handler.tags = ['info']
handler.command = ['sc', 'sourcecode']
module.exports = handler