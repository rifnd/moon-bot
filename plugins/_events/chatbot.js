module.exports = {
   async before(m, {
      conn,
      body,
      env,
      setting,
      Func
   }) {
      try {
         if (setting.chatbot && body && !env.evaluate_chars.some(v => body.startsWith(v)) && !m.isGroup) {
            const json = await Api.post('api/completions', {
               model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
               messages: JSON.stringify([{ role: 'system', content: 'Be a helpful assistant' }, { role: 'user', content: `${body}` }])
            })
            if (!json.status) return console.log(json)
            if (!m.fromMe && !m.isGroup && json.status) return conn.reply(m.chat, json.data.choices[0].message.content, null)
         }
      } catch (e) {
         console.log(e)
      }
      return true
   }
}