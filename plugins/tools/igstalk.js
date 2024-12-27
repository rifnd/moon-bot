module.exports = {
   help: ['igstalk'],
   use: 'username',
   tags: ['tools'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Func
   }) => {
      try {
         if (!text) return m.reply(Func.example(usedPrefix, command, 'bulansutena'))
         m.react('🕒')
         const json = await Api.get('api/igstalk', {
            username: text
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let tek = `乂  *I G - S T A L K*\n\n`
         tek += `   ◦  *Username* : ` + json.data.username + '\n'
         tek += `   ◦  *Name* : ` + json.data.fullname + '\n'
         tek += `   ◦  *Followers* : ` + Func.formatNumber(json.data.followers) + '\n'
         tek += `   ◦  *Followed* : ` + Func.formatNumber(json.data.following) + '\n'
         tek += `   ◦  *Posts* : ` + Func.formatNumber(json.data.post) + '\n'
         tek += `   ◦  *Url* : https://instagram.com/` + json.data.username + '\n'
         tek += `   ◦  *Bio* : ` + json.data.bio || '-'
         tek += `\n\n` + global.footer
         conn.sendFile(m.chat, json.data.profile, Func.filename('jpg'), tek, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true
}