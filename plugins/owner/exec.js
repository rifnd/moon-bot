const cp = require('child_process')
const { format, promisify, inspect } = require('util')
const exec = promisify(cp.exec).bind(cp)
module.exports = {
   async before(m, {
      conn,
      setting,
      isOwner,
      plugins,
      Scraper,
      Func
   }) {
      if (!isOwner) return
      if (m.text.startsWith('=>')) {
         try {
            let b = await eval(`(async () => { return ${m.text.slice(3)} })()`)
            m.reply(Func.jsonFormat(b))
         } catch (e) {
            m.reply(Func.jsonFormat(e))
         }
      } else if (m.text.startsWith('>')) {
         try {
            let evaled = await eval(m.text.slice(2))
            if (typeof evaled !== 'string') evaled = inspect(evaled)
            await m.reply(evaled)
         } catch (e) {
            await m.reply(Func.jsonFormat(e))
         }
      } else if (m.text.startsWith('$')) {
         let o
         try {
            o = await exec(m.text.slice(2).trimStart())
         } catch (e) {
            o = e
         } finally {
            let { stdout, stderr } = o
            if (stdout.trim()) m.reply(stdout)
            if (stderr.trim()) m.reply(stderr)
         }
      }
   }
}