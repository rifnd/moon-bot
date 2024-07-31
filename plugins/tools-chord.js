module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      env,
      Func
   }) => {
      try {
         conn.chord = conn.chord ? conn.chord : []
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Alone'), m)
         const check = conn.chord.find((v) => v.jid == m.sender)
         if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
         if (check && !isNaN(text)) {
            if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data`))
            m.react('🕒')
            const json = await Api.get('api/chord-get', {
               url: check.results[Number(text) - 1]
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.reply(m.chat, json.data.chord, m)
         } else {
            m.react('🕒')
            const json = await Api.get('api/chord', {
               q: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            if (json.data.length == 0) return m.reply(Func.texted('bold', '🚩 Lyric not found'))
            if (!check) {
               conn.chord.push({
                  jid: m.sender,
                  query: text,
                  results: json.data.map((v) => v.url),
                  created_at: new Date() * 1
               })
            } else check.results = json.data.map((v) => v.url)
            let p = `To get result use this command *${usedPrefix + command} number*\n`
            p += `*Examplw* : ${usedPrefix + command} 1\n\n`
            json.data.map((v, i) => {
               p += `*${i + 1}*. ${v.title}\n\n`
            }).join('\n\n')
            p += global.footer
            conn.reply(m.chat, p, m)
         }
         setInterval(async () => {
            const session = conn.chord.find((v) => v.jid == m.sender)
            if (session && new Date() - session.created_at > env.timer) {
               Func.removeItem(conn.chord, session)
            }
         }, 60_000)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['chord'],
   use: 'query',
   tags: ['tools'],
   command: /^(chord)$/i,
   limit: true,
}