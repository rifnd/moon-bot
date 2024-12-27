module.exports = {
   help: ['cai', 'cai-generate', 'cai-search', 'cai-set'],
   tags: ['internet'],
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
         if (command == 'cai') {
            if (!text) return m.reply(Func.example(usedPrefix, command, 'Halo perkenalkan dirimu'))
            m.react('🕒')
            if (!users.cai) return conn.reply(m.chat, Func.texted('bold', `Not found character_id.`), m)
            let json = await Api.get('api/cai', {
               chara_id: users.cai,
               msg: text,
               single_reply: true
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            m.reply(json.data.content)
         } else if (command == 'cai-generate') {
            if (!text) return m.reply(Func.example(usedPrefix, command, '(​masterpiece:1.3), (8K, Photorealsitic, Raw photography, Top image quality: 1.4), Japan high school girls、(Random hairstyles:1.2)、cleavage of the breast:1.2、Super Detail Face、Eye of Detail、double eyelid、Bring your chest together、sharp focus:1.2、prety woman:1.4、light brown hair、top-quality、​masterpiece、超A high resolution、(Photorealsitic:1.4)、Highly detailed and professional lighting smile、Loose and light knitwear、Shoulder out、slender、serious facial expression、short-haired、Fatal position'))
            m.react('🕒')
            let json = await Api.get('api/cai-image', {
               prompt: text
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            await conn.sendMessage(m.chat, {
               image: { url: json.data.url }, fileName: Func.filename('jpg'), mimetype: 'image/jpeg'
            }, { quoted: m })
         } else if (command == 'cai-set') {
            if (!text) return m.reply(Func.example(usedPrefix, command, 'p9IKHMlMfxlMMst63NAeqEPMDVpG3ejbmuJ5Mg2hbzU'))
            m.react('🕒')
            users.cai = text
            await conn.reply(m.chat, Func.texted('bold', `Sucessfully set character_id : ${text}.`), m)
         } else if (command == 'cai-search') {
            if (!text) return m.reply(Func.example(usedPrefix, command, 'Alya'))
            let json = await Api.get('api/cai-search', { q: text })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            let teks = '乂  *C H A R A - S E A R C H*\n\n'
            json.data.map(v => {
               teks += '  ∘  *Name* : ' + v.participant__name + '\n'
               teks += '  ∘  *Greeting* : ' + v.greeting + '\n'
               teks += '  ∘  *Visibility* : ' + v.visibility + '\n'
               teks += '  ∘  *Priority* : ' + v.priority + '\n'
               teks += '  ∘  *Scores* : ' + v.search_score + '\n'
               teks += '  ∘  *Interactions* : ' + v.participant__num_interactions + '\n'
               teks += '  ∘  *Character_Id* : ' + v.external_id + '\n\n'
            })
            m.reply(teks)
         }
      } catch (e) {
         return conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   limit: true,
   premium: true,
}