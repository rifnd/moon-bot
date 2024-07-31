let cp = require('child_process')
let { promisify } = require('util')
let exec = promisify(cp.exec).bind(cp)
module.exports = {
   run: async (m, {
      conn,
      isOwner,
      command,
      text
   }) => {
      if (conn.user.jid != conn.user.jid) return
      m.reply('Executing...')
      let o
      try {
         o = await exec(command.trimStart() + ' ' + text.trimEnd())
      } catch (e) {
         o = e
      } finally {
         let { stdout, stderr } = o
         if (stdout.trim()) m.reply(stdout)
         if (stderr.trim()) m.reply(stderr)
      }
   },
   customPrefix: /^[$] /,
   command: new RegExp,
   owner: true
}