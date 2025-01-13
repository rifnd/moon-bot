const { Functions: Func } = new (require('@moonr/utils'))

module.exports = conn => {
   conn.setBio = async (status) => {
      return await conn.query({
         tag: "iq",
         attrs: {
            to: "s.whatsapp.net",
            type: "set",
            xmlns: "status",
         },
         content: [{
            tag: "status",
            attrs: {},
            content: Buffer.from(status, "utf-8"),
         }]
      })
   }
}

Func.updateFile(require.resolve(__filename))