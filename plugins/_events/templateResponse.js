const { proto, generateWAMessage, areJidsSameUser } = require('@whiskeysockets/baileys')
const { Plugins } = new(require('@moonr/utils'))
const { plugins } = Plugins
module.exports = {
   async all(m, chatUpdate) {
      if (m.isBot) return
      if (!m.message) return
      if (!(m.message.buttonsResponseMessage || m.message.templateButtonReplyMessage || m.message.interactiveResponseMessage)) return
      let id = m.message.buttonsResponseMessage?.selectedButtonId || m.message.templateButtonReplyMessage?.selectedId || m.message.listResponseMessage?.singleSelectReply?.selectedRowId || JSON.parse(m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson)?.id
      let isIdMessage = false
      for (let name in plugins) {
         let plugin
         if (typeof plugins[name].run === 'function') {
            let ai = plugins[name]
            plugin = ai.run;
            for (let prop in ai) {
               if (prop !== 'run') {
                  plugin[prop] = ai[prop];
               }
            }
         } else {
            plugin = plugins[name]
         }
         if (!plugin) continue
         if (typeof plugin !== 'function') continue
         if (!plugin.command) continue
         let match = (global.db.setting.prefix instanceof Array ? global.db.setting.prefix.map(p => {
            return m.text.startsWith(p)
         }).find(p => p) : false)
         if (match || global.db.setting.noprefix) {
            let displayPrefix = global.db.setting.prefix.find(p => m.text.startsWith(p)) || ''
            let prefix = id.replace(displayPrefix, '')
            let [command] = prefix.trim().split(' ').filter(v => v)
            command = (command || '').toLowerCase()
            let isId = ((Array.isArray(plugin.command) && plugin.command.includes(command)) || (Array.isArray(plugin.help) && plugin.help.includes(command)))
            if (!isId) continue
            isIdMessage = true
         }
      }
      let messages = await generateWAMessage(m.chat, {
         text: id,
         mentions: m.mentionedJid
      }, {
         userJid: this.user.id,
         quoted: m.quoted && m.quoted.fakeObj
      })
      messages.key.fromMe = areJidsSameUser(m.sender, this.user.id)
      messages.key.id = m.key.id
      messages.pushName = m.name
      if (m.isGroup) messages.participant = m.sender
      let msg = {
         ...chatUpdate,
         messages: [proto.WebMessageInfo.fromObject(messages)],
         type: 'append'
      }
      this.ev.emit('messages.upsert', msg)
   }
}