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
    db.data.chats[m.chat].sWelcome = text
    m.reply('Welcome berhasil diatur\n@user (Mention)\n@subject (Judul Grup)\n@desc (Deskripsi Grup)')
  } else throw `Penggunaan:\n${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} selamat datang @user digrup @subject\n\n@desc`
}
handler.help = handler.command = ['setwelcome']
handler.tags = ['group']
handler.group = handler.admin = true
module.exports = handler