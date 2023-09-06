let handler = async (m, {
  usedPrefix,
  command,
  args,
  text
}) => {
  let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
  let name = m.sender
  let [_, code] = text.match(linkRegex) || []
  if (!args[0]) return m.reply(`Masukan link grup!`)
  if (!code) return m.reply(`Link tidak valid!`)
  if (!args[1]) return m.reply(`Masukan jumlah hari!`)
  if (isNaN(args[1])) return m.reply(`Hanya format angka mewakili jumlah hari.`)
  m.reply(status.wait)
  await Func.delay(3000)
  try {
    var res = await conn.groupAcceptInvite(code)
    var b = await conn.groupMetadata(res)
    var d = b.participants.map(v => v.id)
    var member = d.toString()
    var e = await d.filter(v => v.endsWith(anubot + '@s.whatsapp.net'))
    var jumlahHari = 86400000 * args[1]
    var now = new Date() * 1
    if (now < db.data.chats[res].expired) db.data.chats[res].expired += jumlahHari
    else db.data.chats[res].expired = now + jumlahHari
    if (e.length) await m.reply(`Sukses invite bot ke group\n\n${await conn.getName(res)}\n\nBot akan keluar secara otomatis setelah *${msToDate(global.db.data.chats[res].expired - now)}*`)
    conn.reply(res, `Halo semuanya👋\n\nSaya adalah Moon, whatsapp bot yang siap membantu kamu mendapatkan data, informasi, mendownload media, dll hanya melalui whatsapp\n\nBot akan keluar otomatis setelah masa aktif habis\n*TimeOut* : *${msToDate(db.data.chats[res].expired - now)}*`, null, {
      mentions: [d]
    })
  } catch (e) {
    console.log(e)
    return m.reply(Func.jsonFormat(e))
  }
}
handler.help = ['join']
handler.tags = ['owner']
handler.command = ['join']
handler.owner = true
module.exports = handler
