let handler = async (m, {
   usedPrefix,
   command,
   args
}) => {
   try {
      if (!args[0]) return m.reply(Func.example(usedPrefix, command, 'https://www.icocofun.com/share/post/457616496291?lang=id&pkg=id&share_to=copy_link&m=c6d95b35bbbbf91ce3da574262388117&d=f7445b'))
      if (!args[0].match(/(https:\/\/www.icocofun.com)/gi)) return m.reply(status.invalid)
      m.react('🕒')
      const json = await Func.fetchJson(API('alya', '/api/cocofun', {
         url: args[0]
      }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      let cap = `–  *C O C O F U N*\n\n`
      cap += `  ◦  *Title* : ` + json.data.title + `\n`
      cap += `  ◦  *Like* : ` + json.data.like + `\n`
      cap += `  ◦  *Play* : ` + json.data.play_count + `\n`
      cap += `  ◦  *Resolution* : ` + json.data.resolution + `\n`
      cap += `  ◦  *Duration* : ` + json.data.duration + `\n`
      cap += `  ◦  *Description* : ` + json.data.desc + `\n\n`
      cap += global.set.footer
      conn.sendFile(m.chat, json.data.url, '', cap, m)
   } catch (e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
   }
}
handler.help = handler.command = ['cocofun']
handler.tags = ['downloader']
handler.limit = true
module.exports = handler