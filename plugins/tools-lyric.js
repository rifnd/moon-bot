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
         conn.lyric = conn.lyric ? conn.lyric : []
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Alone'), m)
         const check = conn.lyric.find((v) => v.jid == m.sender)
         if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
         if (check && !isNaN(text)) {
            if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
            m.react('🕒')
            const json = await Api.get('api/lyric2-get', {
               url: check.results[Number(text) - 1]
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            conn.reply(m.chat, json.data.lirik, m)
         } else {
            m.react('🕒')
            const json = await Api.get('api/lyric2', {
               q: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            if (json.data.length == 0) return m.reply(Func.texted('bold', '🚩 Lyric not found.'))
            if (!check) {
               conn.lyric.push({
                  jid: m.sender,
                  query: text,
                  results: json.data.map((v) => v.result.relationships_index_url),
                  created_at: new Date() * 1
               })
            } else check.results = json.data.map((v) => v.result.relationships_index_url)
            let p = `To get result use this command *${usedPrefix + command} number*\n`
            p += `*Example* : ${usedPrefix + command} 1\n\n`
            json.data.map((v, i) => {
               p += `*${i + 1}*. ${v.result.full_title}\n`
               p += `◦ *Artist* : ${v.result.artist_names}\n`
               p += `◦ *Release* : ${v.result.release_date_for_display}\n\n`
            }).join('\n\n')
            p += global.footer
            conn.reply(m.chat, p, m)
         }
         setInterval(async () => {
            const session = conn.lyric.find((v) => v.jid == m.sender)
            if (session && new Date() - session.created_at > env.timeout) {
               Func.removeItem(conn.lyric, session)
            }
         }, 60_000)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['lyric'],
   use: 'query',
   tags: ['tools'],
   command: /^(lyric|lirik)$/i,
   limit: true,
}