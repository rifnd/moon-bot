let handler = async(m, {
    usedPrefix,
    command,
    text
  }) => {
    try {
      if (!text) return m.reply(Func.example(usedPrefix, command, 'moon-bot'))
      conn.react(m.chat, '🕒', m.key)
      const json = await Func.fetchJson(API('alya', '/api/blackbox-ai', { prompt: text }, 'apikey'))
      if (!json.status) return m.reply(Func.jsonFormat(json))
      m.reply(json.data.content)
    } catch(e) {
      console.log(e)
      return m.reply(Func.jsonFormat(e))
    }
  }
  handler.help = handler.command = ['ai-blackbox']
  handler.tags = ['internet']
  handler.limit = true
  module.exports = handler