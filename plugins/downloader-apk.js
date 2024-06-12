let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  try {
    switch (command) {
      case 'apk': {
        if (!text) return m.reply(Func.example(usedPrefix, command, 'bakso'))
        m.react('🕒')
        var json = await Func.fetchJson(API('alya', '/api/apk', { q: text }, 'apikey'))
        if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
        if (json.data.length == 0) return m.reply(Func.texted('bold', '🚩 Not found.'))
        var sections = []
        json.data.map((v, i) => {
          sections.push({
            rows: [{
              title: `${v.name}`,
              description: `[ Size : ${v.size} | Rating : ${v.rating} ]`,
              id: `${usedPrefix}apkget ${v.path}`
            }]
          })
        })
        const buttons = [{
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: 'Tap Here!',
            sections
          })
        }]
        await conn.sendAIMessage(m.chat, buttons, m, {
          header: ``,
          content: `Here are the search results for "${text}"`,
          footer: global.set.footer
        })
      }
      break

      case 'apkget': {
        if (!text) return
        m.react('🕒')
        var json = await Func.fetchJson(API('alya', '/api/apkget', { path: text }, 'apikey'))
        if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
        let teks = `乂  *A P K*\n\n`
        teks += '  ◦  *Name* : ' + json.data.name + '\n'
        teks += '  ◦  *Size* : ' + json.data.size + '\n'
        teks += '  ◦  *Version* : ' + json.data.version + '\n'
        teks += '  ◦  *Update* : ' + json.data.updated + '\n\n'
        teks += global.set.footer
        const chSize = Func.sizeLimit(json.data.size, global.max_upload)
        if (chSize.oversize) return m.reply(`💀 Ukuran file ( ${json.data.size} ) terlalu besar, silahkan download sendiri lewat link ini :  ${json.data.url}`)
        conn.sendMessageModify(m.chat, teks, m, {
          largeThumb: true,
          thumbnail: json.data.thumbnail
        }).then(() => {
          conn.sendMedia(m.chat, json.data.url, m, {
            fileName: json.data.name + '.apk',
            mimetype: 'application'
          })
        })
      }
        break
    }
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['apk'].map(v => v + ' ')
handler.tags = ['downloader']
handler.command = /^(apk|apkget)$/i
handler.limit = 1
module.exports = handler