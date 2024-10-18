module.exports = {
   help: ['sendcontact'],
   tags: ['fun'],
   command: /^(sendcontact)$/i,
   run: async (m, {
      conn,
      command,
      usedPrefix,
      text,
      Func
   }) => {
      try {
         this.anonymous = this.anonymous ? this.anonymous : {}
         let who = m.sender
         let room = Object.values(this.anonymous).find(room => room.check(who))
         if (!room) return m.reply(Func.texted('bold', 'You are not in anonymous chat'))
         let other = room.other(who)
         var name
         if (text) name = text
         else name = conn.getName(m.sender)
         var number = who.split('@')[0]
         let vcard = `
  BEGIN:VCARD
  VERSION:3.0
  FN:${name.replace(/\n/g, '\\n')}
  TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
  END:VCARD`
         this.reply(m.chat, Func.texted('bold', `You successfully sent a contact to your partner.`), m)
         if (other) this.reply(other, Func.texted('bold', `Partner sends contact to you`), m)
         if (other) this.sendMessage(other, {
            contacts: {
               displayName: name,
               contacts: [{ vcard }]
            }
         })
      } catch (e) {
         console.log(e)
      }
   },
   private: true
}