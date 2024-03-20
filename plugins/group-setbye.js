let handler = async (m, {
  conn,
  text,
  isOwner,
  isAdmin,
  usedPrefix,
  command,
  env
}) => {
  if (text) {
    db.data.chats[m.chat].sBye = text
    m.reply('Bye berhasil diatur\n@user (Mention)')
  } else throw `Penggunaan:\n${usedPrefix + command} <teks>\n\ncontoh:\n${usedPrefix + command} byebye @user`
}
handler.help = handler.command = ['setbye']
handler.tags = ['group']
handler.group = handler.admin = true
module.exports = handler