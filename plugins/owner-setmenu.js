let handler = async(m, {
  usedPrefix,
  command,
  args,
  setting,
  env
}) => {
  try {
    if (!args[0]) return m.reply(Func.example(usedPrefix, command, '2'))
    if (!['1', '2'].includes(args[0])) return m.reply(`Style tidak tersedia`)
    conn.reply(m.chat, `🚩 Berhasil menggunakan style *${args[0]}*.`, m).then(() => setting.style = parseInt(args[0]))
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['setmenu']
handler.tags = ['owner']
handler.command = /^(setmenu)$/i
handler.owner = true
module.exports = handler