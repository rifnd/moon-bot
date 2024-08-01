module.exports = {
   run: async (m, {
      conn,
      usedPrefix,
      command,
      Func
   }) => {
      this.game = this.game ? this.game : {}
      let winScore = Func.randomInt(1000, 50000)
      let id = 'family100_' + m.chat
      if (id in this.game) {
         this.reply(m.chat, 'Masih ada kuis yang belum terjawab di chat ini', this.game[id].msg)
         throw false
      }
      let src = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json')
      let json = src[Math.floor(Math.random() * src.length)]
      let caption = `
*Soal:* ${json.soal}

Terdapat *${json.jawaban.length}* jawaban${json.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
`: ''}

+${winScore} Money tiap jawaban benar`.trim()
      this.game[id] = {
         id,
         msg: await m.reply(caption),
         ...json,
         terjawab: Array.from(json.jawaban, () => false),
         winScore,
      }
   },
   help: ['family100'],
   tags: ['game'],
   command: /^(family100)$/i,
   game: true,
   limit: true,
   group: true,
}