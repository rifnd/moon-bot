module.exports = {
   async before(m, {
      body,
      env,
      setting,
      Func
   }) {
      try {
         if (setting.chatbot && body && !env.evaluate_chars.some(v => body.startsWith(v)) && !m.isGroup) {
            const json = await Api.get('api/ai-logic', {
               system: 'Sekarang nama kamu adalah moon',
               prompt: body,
            })
            if (!json.status) return console.log(json)
            if (!m.fromMe && !m.isGroup && json.status) return conn.reply(m.chat, json.data.content, null)
         }
      } catch (e) {
         console.log(e)
      }
      return true
   }
}