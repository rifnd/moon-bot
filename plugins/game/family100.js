let handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   Func
}) => {
   conn.family100 = conn.family100 ? conn.family100 : {}
   let winScore = Func.randomInt(env.min_reward, env.max_reward)
   let id = 'family100_' + m.chat
   if (id in conn.family100) conn.reply(m.chat, 'Masih ada kuis yang belum terjawab', conn.family100[id].msg)
   let src = await Func.fetchJson('https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json')
   let json = src[Math.floor(Math.random() * src.length)]
   let caption = `
*Soal:* ${json.soal}

Terdapat *${json.jawaban.length}* jawaban${json.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
`: ''}

+${Func.formatNumber(winScore)} EXP tiap jawaban benar`.trim()
   conn.family100[id] = {
      id,
      msg: await m.reply(caption),
      ...json,
      terjawab: Array.from(json.jawaban, () => false),
      winScore,
   }
}
handler.help = ['family100']
handler.tags = ['game']
handler.limit = handler.game = handler.group = handler.register = true
module.exports = handler