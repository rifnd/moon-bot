async function handler(m, {
  command,
  usedPrefix
}) {
  command = command.toLowerCase()
  this.anonymous = this.anonymous ? this.anonymous : {}
  switch (command) {
    case 'next':
    case 'skip':
    case 'stop': {
      let room = Object.values(this.anonymous).find((room) => room.check(m.sender))
      if (!room) {
        await this.reply(m.chat, Func.texted('bold', `You are not in anonymous chat!, send ${usedPrefix}start to start anonymous chat`), m)
        throw 0
      }
      this.reply(m.chat, Func.texted('bold', `You have dismissed the chat.`), m)
      let other = room.other(m.sender)
      if (other) this.reply(m.chat, Func.texted('bold', `The partner has stopped the chat, type .start to find the partner again.`), m)
      delete this.anonymous[room.id]
      if (command === 'stop') break
    }
    case 'search':
    case 'start': {
      if (Object.values(this.anonymous).find((room) => room.check(m.sender))) return m.reply(Func.texted('bold', 'You are still in anonymous chat'))
      let room = Object.values(this.anonymous).find((room) => room.state === 'WAITING' && !room.check(m.sender))
      if (room) {
        this.reply(room.a, Func.texted('bold', `Finding a partner`), m)
        room.b = m.sender
        room.state = 'CHATTING'
        this.reply(room.b, Func.texted('bold', 'Finding a partner'), m)
      } else {
        let id = +new Date()
        this.anonymous[id] = {
          id,
          a: m.sender,
          b: '',
          state: 'WAITING',
          check: function (who = '') {
            return [this.a, this.b].includes(who)
          },
          other: function (who = '') {
            return who === this.a ? this.b : who === this.b ? this.a : ''
          },
        }
        m.reply(Func.texted('bold', 'Waiting for a partner...'))
      }
      break
    }
  }
}
handler.help = handler.command = ['start', 'skip', 'stop', 'next', 'search']
handler.tags = ['anonymous']
handler.private = true
module.exports = handler