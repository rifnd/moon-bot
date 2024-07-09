let handler = async (m, {
   usedPrefix,
   command,
   text
}) => {
   try {
      switch (command) {
         case 'spotify': {
            if (!text) return m.reply(Func.example(usedPrefix, command, 'kemarin'))
            m.react('🕒')
            var json = await Func.fetchJson(API('alya', '/api/spotify', {
               q: text
            }, 'apikey'))
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            if (json.data.length == 0) return m.reply(Func.texted('bold', '🚩 Not found.'))
            var sections = []
            json.data.map((v, i) => {
               sections.push({
                  rows: [{
                     title: `${v.title}`,
                     description: `[ Artist : ${v.artist} | Popularity : ${v.popularity} ]`,
                     id: `${usedPrefix}spoget ${v.url}`
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

         case 'spoget': {
            if (!text) return
            m.react('🕒')
            var json = await Func.fetchJson(API('alya', '/api/spotify-dl', {
               url: text
            }, 'apikey'))
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.sendMessage(m.chat, {
               document: { url: json.data.url },
               fileName: json.data.artist + ' - ' + json.data.title + '.mp3',
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
handler.help = ['spotify'].map(v => v + '')
handler.tags = ['downloader']
handler.command = /^(spotify|spoget)$/i
handler.limit = 1
module.exports = handler