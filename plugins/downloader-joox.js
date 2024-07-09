let handler = async (m, {
   usedPrefix,
   command,
   text
}) => {
   try {
      switch (command) {
         case 'joox': {
            if (!text) return m.reply(Func.example(usedPrefix, command, 'a7x'))
            m.react('🕒')
            var json = await Func.fetchJson(API('alya', '/api/joox', {
               q: text
            }, 'apikey'))
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            if (json.data.length == 0) return m.reply(Func.texted('bold', '🚩 Not found.'))
            var sections = []
            json.data.map((v, i) => {
               sections.push({
                  rows: [{
                     title: `${v.name}`,
                     description: `[ Artist : ${v.artist_list[0].name} ]`,
                     id: `${usedPrefix}joxget ${v.id}`
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

         case 'joxget': {
            if (!text) return
            m.react('🕒')
            var json = await Func.fetchJson(API('alya', '/api/joox-get', {
               id: text
            }, 'apikey'))
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.sendMessage(m.chat, {
               document: { url: json.data.download },
               fileName: json.data.name + ' - ' + json.data.artist + '.mp3',
               mimetype: 'audio/mpeg'
            }, { quoted: m })
         }
         break
      }
   } catch (e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
   }
}
handler.help = ['joox'].map(v => v + ' ')
handler.tags = ['downloader']
handler.command = /^(joox|joxget)$/i
handler.limit = 1
module.exports = handler