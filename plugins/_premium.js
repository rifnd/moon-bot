let handler = (m) => m;
handler.before = async (m, { conn, isPrems, owner }) => {
  let user = db.data.users[m.sender];
  if (m.chat.endsWith("broadcast")) return;
  if (user.premiumTime != 0 && user.premium) {
    if (new Date() * 1 >= global.db.data.users[m.sender].premiumTime) {
      conn.reply(m.chat, "Masa aktif premium kamu telah habis, jika kamu berminat untuk upgrade premium kembali, silahkan hubungi pemilik.", m).then(() => {
          db.data.users[m.sender].premium = false
          const data = global.owner.filter(([id, isCreator]) => id && isCreator)
          this.sendContact(m.chat, data.map(([id, name]) => [id, name]), m).then(() => {})
        })
    }
  }
};
module.exports = handler
