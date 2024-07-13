const yts = require('yt-search')
let handler = async (m, {
   text,
   usedPrefix,
   command
}) => {
   try {
      if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Utopia'), m)
      let yt = await (await yts(text)).all
      if (yt.length == 0) return conn.reply(m.chat, Func.jsonFormat(yt), m)
      m.react('🕒')
      var sections = []
      yt.filter(p => p.type == 'video').map(async (v, i) => {
         if (i < 8) {
            sections.push({
               rows: [{
                  title: `${v.title}`,
                  description: `AUDIO`,
                  id: `${usedPrefix}yta ${v.url}`
               }, {
                  title: `${v.title}`,
                  description: `VIDEO`,
                  id: `${usedPrefix}ytv ${v.url}`
               }]
            })
         }
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
   } catch (e) {
      console.log(e)
      return conn.reply(m.chat, status.error, m)
   }
}
handler.help = ['ytsearch']
handler.tags = ['internet']
handler.command = ['yts', 'ytsearch']
module.exports = handler