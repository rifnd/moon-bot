module.exports = {
   help: ['asupan'],
   use: 'username (optional)',
   tags: ['downloader'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      args,
      Func
   }) => {
      try {
         m.react('🕒')
         let old = new Date()
         let json = await Api.get('api/tiktok-post', {
            q: args[0] || Func.random(['_hanna4yours', 'moodaaii', 'imnotnoncakeithh', 'athaw041', 'jacquelinesndr', 'joanne_flute', 'auwa___', 'aikolovesushi', 'liayuhuuu_', 'mrchellacty', 'michellechristoo', 'nauraurelia0'])
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let ran = Math.floor(json.data.length * Math.random())
         let cap = `乂  *A S U P A N*\n\n`
         cap += `   ∘  *Author* : ${json.data[ran].author.nickname}\n`
         cap += `   ∘  *Views* : ${json.data[ran].play_count}\n`
         cap += `   ∘  *Like* : ${json.data[ran].digg_count}\n`
         cap += `   ∘  *Comment* : ${json.data[ran].comment_count}\n`
         cap += `   ∘  *Share* : ${json.data[ran].share_count}\n`
         cap += `   ∘  *Duration* : ${Func.timeFormat(json.data[ran].duration)}\n`
         cap += `   ∘  *Sound* : ${json.data[ran].music_info.title} - ${json.data[ran].music_info.author}\n`
         cap += `   ∘  *Caption* : ${json.data[ran].title}\n`
         cap += `   ◦  *Fetching* : ${(new Date() - old) * 1} ms\n\n`
         cap += global.footer
         conn.sendFile(m.chat, json.data[ran].play, '', cap, m)
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true
}