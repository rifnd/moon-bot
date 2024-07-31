module.exports = {
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
         m.react('🕐')
         const json = await Api.get('api/igstalk', {
            username: text
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let tek = `乂  *I G - S T A L K*\n\n`
         tek += `  ∘  *Username* : ` + json.data.username + '\n'
         tek += `  ∘  *Name* : ` + json.data.full_name + '\n'
         tek += `  ∘  *ID* : ` + json.data.id + '\n'
         tek += `  ∘  *Private* : ` + json.data.is_private + '\n'
         tek += `  ∘  *Follower* : ` + Func.formatNumber(json.data.count_followers) + '\n'
         tek += `  ∘  *Followed* : ` + Func.formatNumber(json.data.count_following) + '\n'
         tek += `  ∘  *Url* : https://instagram.com/` + json.data.username + '\n'
         tek += `  ∘  *Bio* : ` + json.data.biography + '\n\n'
         tek += global.footer
         conn.sendFile(m.chat, json.data.profile_full_HD, '', tek, m)
      } catch (e) {
         console.log(e)
         m.reply(Func.jsonFormat(e))
      }
   },
   help: ['igstalk'],
   use: 'username',
   tags: ['tools'],
   command: /^(igstalk)$/i,
   limit: true,
}