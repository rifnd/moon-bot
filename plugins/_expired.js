module.exports = {
  async all(m) {
    if (!m.isGroup) return
    let chats = global.db.data.chats[m.chat]
    if (!chats.expired) return !0
    if (+new Date() > chats.expired) {
      const data = global.owner.filter(([id, isCreator]) => id && isCreator)
      await m.reply("Masa aktif sewa di grup ini telah habis, bot akan keluar dari grup, jika ingin menyewa kembali silahkan hubungi Owner.")
      chats.expired = 0
      await this.sendContact(m.chat, data.map(([id, name]) => [id, name]), m)
      await this.delay(10000)
      await this.groupLeave(m.chat)
    }
  },
}