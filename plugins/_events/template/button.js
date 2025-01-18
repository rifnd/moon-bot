module.exports = {
   async all(m, chatUpdate) {
      try {
         if (m.isBot) return
         if (!m.message) return
         if (!(m.message.buttonsResponseMessage || m.message.templateButtonReplyMessage || m.message.listResponseMessage || m.message.interactiveResponseMessage)) return
         let id = m.message.buttonsResponseMessage?.selectedButtonId ?? m.message.templateButtonReplyMessage?.selectedId ?? m.message.listResponseMessage?.singleSelectReply?.selectedRowId ?? (() => {
            try {
               const params = JSON.parse(m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || "{}")
               return params?.id ?? null
            } catch (error) {
               return null
            }
         })()
         let text = m.message.buttonsResponseMessage?.selectedDisplayText ?? m.message.templateButtonReplyMessage?.selectedDisplayText ?? m.message.listResponseMessage?.title ?? m.message.interactiveResponseMessage?.body?.text ?? null
         const toCmd = id || text
         if (!toCmd) return
         await this.appendTextMessage(m, toCmd, chatUpdate)
      } catch (e) {
         console.log(e)
      }
   }
}