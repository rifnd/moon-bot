let handler = async (m, { conn, isBotAdmin }) => {
  try {
    if (m.isGroup) {
      if (!m.quoted) throw m.reply("Reply to the message you want to delete.");
      conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: isBotAdmin ? false : true,
          id: m.quoted.id,
          participant: m.quoted.sender,
        },
      });
    } else if (!m.isGroup) {
      if (!m.quoted) throw false;
      let { chat, fromMe, id, isBaileys } = m.quoted;
      if (!isBaileys) return m.reply("The message was not sent by a bot!.");
      conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: true,
          id: m.quoted.id,
          participant: m.quoted.sender,
        },
      });
    }
  } catch (e) {
    throw m.reply(status.error)
  }
};
handler.help = ["delete"];
handler.tags = ["tools"];
handler.command = /^del(ete)?$/i;
handler.limit = true;

module.exports = handler;
