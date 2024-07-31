module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      text,
      Scraper,
      Func
   }) => {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'Penemu listrik'))
      m.react('🕒')
      try {
         const json = await Api.get('api/brainly', {
            q: text, lang: 'id'
         })
         if (!json.status) return m.reply(Func.jsonFormat(json))
         let teks = `乂  *B R A I N L Y*\n\n`
         json.data.map((v, i) => {
            teks += `*${(i + 1)}*. ${v.question}\n`
            teks += `›  *Answer* : \n${v.answers}\n\n`
         })
         m.reply(teks + global.footer)
      } catch {
         console.log(e)
      }
   },
   help: ['brainly'],
   use: 'query',
   tags: ['tools'],
   command: /^(brainly)$/i,
   limit: true,
}