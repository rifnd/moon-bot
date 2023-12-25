let handler = async(m, {
  usedPrefix,
  command,
  args
}) => {
  try {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.capcut.com/template-detail/7261093127484722433?template_id=7261093127484722433&share_token=37433a9d-37b0-407e-a0b8-a92d70b41631&enter_from=template_detail&region=ID&language=in&platform=copy_link&is_copy_link=1'))
    if (!args[0].match('capcut.com')) return m.reply(status.invalid)
    switch (command) {
      case 'capcut': {
        m.react('🕒')
        const json = await Func.fetchJson(API('alya', '/api/capcut', { url: args[0], type: 'nowatermark' }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        let teks = `乂  *C A P C U T*\n\n`
        teks += `  ◦  *Title* : ` + json.data.title + `\n`
        teks += `  ◦  *Size* : ` + json.data.size + `\n`
        teks += `  ◦  *Type* : ` + `Nowatermark` + `\n\n`
        teks += global.set.footer
        conn.sendFile(m.chat, json.data.url, '', teks, m)
      }
      break
      case 'capcutwm': {
        m.react('🕒')
        const json = await Func.fetchJson(API('alya', '/api/capcut', { url: args[0], type: 'watermark' }, 'apikey'))
        if (!json.status) return m.reply(Func.jsonFormat(json))
        let teks = `乂  *C A P C U T*\n\n`
        teks += `  ◦  *Title* : ` + json.data.title + `\n`
        teks += `  ◦  *Size* : ` + json.data.size + `\n`
        teks += `  ◦  *Type* : ` + `Watermark` + `\n\n`
        teks += global.set.footer
        conn.sendFile(m.chat, json.data.url, '', teks, m)
      }
    }
  } catch (e) {
    m.reply(Func.jsonFormat(e))
  }
}
handler.help = handler.command = ['capcut', 'capcutwm']
handler.tags = ['downloader']
handler.limit = true
module.exports = handler