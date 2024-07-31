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
         conn.dongeng = conn.dongeng ? conn.dongeng : []
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Legenda'), m)
         const check = conn.dongeng.find((v) => v.jid == m.sender)
         if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
         if (check && !isNaN(text)) {
            if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
            m.react('🕒')
            const json = await Api.get('api/dongeng-get', {
               url: check.results[Number(text) - 1]
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            let cap = `–  *D O N G E N G*\n\n`
            cap += `◦ *Title* : ${json.data.title}\n`
            cap += `◦ *Publish* : ${json.data.date}\n`
            cap += `◦ *Author* : ${json.data.author}\n`
            cap += `◦ *Tags* : ${json.data.tag}\n\n`
            cap += `${json.data.content}`
            conn.reply(m.chat, cap, m)
         } else {
            m.react('🕒')
            const json = await Api.get('api/dongeng', {
               q: text
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            if (!check) {
               conn.dongeng.push({
                  jid: m.sender,
                  query: text,
                  results: json.data.map((v) => v.url),
                  created_at: new Date() * 1
               })
            } else check.results = json.data.map((v) => v.url)
            let p = `To get result use this command *${usedPrefix + command} number*\n`
            p += `*Example* : ${usedPrefix + command} 1\n\n`
            json.data.map((v, i) => {
               p += `*${i + 1}*. ${v.title}\n`
               p += `◦ *Summary* : ${v.summary}\n\n`
            }).join('\n\n')
            p += global.footer
            conn.reply(m.chat, p, m)
         }
         setInterval(async () => {
            const session = conn.dongeng.find((v) => v.jid == m.sender)
            if (session && new Date() - session.created_at > env.timeout) {
               Func.removeItem(conn.dongeng, session)
            }
         }, 60_000)
      } catch (e) {
         console.log(e)
         return m.reply(Func.jsonFormat(e))
      }
   },
   help: ['dongeng'],
   use: 'query',
   tags: ['tools'],
   command: /^(dongeng)$/i,
   limit: true,
}