const fetch = require('node-fetch')
module.exports = {
   help: ['igstalk'],
   use: 'username',
   tags: ['tools'],
   command: /^(igstalk)$/i,
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'bulansutena'))
         m.react('🕒')
         const json = await Api.get('api/igstalk', {
            username: text
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let tek = `乂  *I G S T A L K*\n\n`
         tek += `  ∘  *Username* : ` + json.data.username + '\n'
         tek += `  ∘  *Name* : ` + json.data.fullname + '\n'
         tek += `  ∘  *ID* : ` + json.data.id + '\n'
         tek += `  ∘  *Private* : ` + json.data.is_private + '\n'
         tek += `  ∘  *Followers* : ` + Func.formatNumber(json.data.followers) + '\n'
         tek += `  ∘  *Followed* : ` + Func.formatNumber(json.data.following) + '\n'
         tek += `  ∘  *Url* : https://instagram.com/` + json.data.username + '\n'
         tek += `  ∘  *Bio* : ` + json.data.biography ? json.data.biography : '-' + '\n'
         tek += '\n' + global.footer
         try {
            const res = await fetch(json.data.hd_profile_pic_url_info.url)
            if (res.ok) {
               return conn.sendFile(m.chat, json.data.hd_profile_pic_url_info.url, Func.filename('jpg'), tek, m)
            } else {
               return conn.reply(m.chat, tek, m)
            }
         } catch (error) {
            return conn.reply(m.chat, tek, m)
         }
      } catch (e) {
         console.log(e)
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
}