module.exports = {
   help: ['cai'],
   command: ['character-ai'],
   tags: ['ai'],
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      users,
      Func
   }) => {
      try {
         let args = text.split(' ')
         let action = args[0]?.toLowerCase()
         let content = args.slice(1).join(' ')
         if (!text) return conn.reply(m.chat, Func.example(usedPrefix, command, 'Halo, apa kabar?'), m)
         if (action == 'search') {
            if (!content) return conn.reply(m.chat, Func.example(usedPrefix, command, 'search naruto'), m)
            m.react('🕒')
            let json = await Api.get('api/cai-search', {
               q: content
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            let teks = '乂  *C H A R A S E A R C H*\n\n'
            json.data.map((v, i) => {
               teks += `   *${i + 1}*. ` + v.participant__name + '\n'
               teks += '   ∘  *Greeting* : ' + v.greeting + '\n'
               teks += '   ∘  *Visibility* : ' + v.visibility + '\n'
               teks += '   ∘  *Priority* : ' + v.priority + '\n'
               teks += '   ∘  *Scores* : ' + v.search_score + '\n'
               teks += '   ∘  *Interactions* : ' + v.participant__num_interactions + '\n'
               teks += '   ∘  *Character_Id* : ' + v.external_id + '\n\n'
            })
            m.reply(teks)
         } else if (action == 'set') {
            if (!content) return conn.reply(m.chat, Func.example(usedPrefix, command, 'set p9IKHMlMfxlMMst63NAeqEPMDVpG3ejbmuJ5Mg2hbzU'), m)
            m.react('🕒')
            users.cai = content
            await conn.reply(m.chat, Func.texted('bold', `Successfully set character_id : ${content}.`), m)
         } else if (action == 'generate') {
            if (!content) return conn.reply(m.chat, Func.example(usedPrefix, command, 'generate (​masterpiece:1.3), (8K, Photorealsitic, Raw photography, Top image quality: 1.4), Japan high school girls、(Random hairstyles:1.2)、cleavage of the breast:1.2、Super Detail Face、Eye of Detail、double eyelid、Bring your chest together、sharp focus:1.2、prety woman:1.4、light brown hair、top-quality、​masterpiece、超A high resolution、(Photorealsitic:1.4)、Highly detailed and professional lighting smile、Loose and light knitwear、Shoulder out、slender、serious facial expression、short-haired、Fatal position)'), m)
            m.react('🕒')
            let json = await Api.get('api/cai-image', {
               prompt: content
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            await conn.sendMessage(m.chat, {
               image: { url: json.data.url }, fileName: Func.filename('jpg'), mimetype: 'image/jpeg'
            }, { quoted: m })
         } else {
            // Default action: chatting with the character
            m.react('🕒')
            if (!users.cai) return conn.reply(m.chat, Func.texted('bold', `Not found character_id.`), m)
            let json = await Api.get('api/cai', {
               chara_id: users.cai,
               msg: text,
               single_reply: true
            })
            if (!json.status) return conn.reply(m.chat, Func.jsonFormat(json), m)
            m.reply(json.data.content)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true,
}