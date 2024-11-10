const cp = require('child_process')
const { promisify, inspect, format } = require('util')
const exec = promisify(cp.exec).bind(cp)
const syntaxerror = require('syntax-error')
let handler = m => m
handler.before = async function (m, _2) {
   let { conn, args, groupMetadata, isOwner, Func, Scraper } = _2
   if (!isOwner) return
   let _return
   let _syntax = ''
   let txt = 'return ' + m.text.slice(3)
   let old = m.exp * 1
   if (m.text.startsWith('=>')) {
      try {
         let i = 15
         let f = {
            exports: {},
         }
         let execFunc = new (async () => { }).constructor('print', 'm', 'handler', 'require', 'conn', 'Func', 'Scraper', 'Array', 'process', 'args', 'groupMetadata', 'module', 'exports', 'argument', txt);
         _return = await execFunc.call(conn, (...args) => {
            if (--i < 1) return
            console.log(...args)
            return conn.reply(m.chat, format(...args), m)
         }, m, handler, require, conn, Func, Scraper, CustomArray, process, args, groupMetadata, f, f.exports, [conn, _2])
      } catch (e) {
         let err = await syntaxerror(txt, 'Execution Function', {
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true,
         })
         if (err) _syntax = '```' + err + '```\n\n'
         _return = e
      } finally {
         conn.reply(m.chat, _syntax + Func.jsonFormat(_return), m)
         m.exp = old
      }
   } else if (m.text.startsWith('>')) {
      let txt = m.text.slice(2)
      try {
         let evaled = await eval(txt)
         if (typeof evaled !== 'string') evaled = inspect(evaled)
         m.reply(evaled)
      } catch (e) {
         m.reply(Func.jsonFormat(e))
      }
   } else if (m.text.startsWith('$')) {
      let command = m.text.slice(2).trim()
      let output
      try {
         output = await exec(command)
      } catch (e) {
         output = e
      } finally {
         let { stdout, stderr } = output
         if (stdout.trim()) m.reply(stdout)
         if (stderr.trim()) m.reply(stderr)
      }
   }
}
module.exports = handler
class CustomArray extends Array {
   constructor(...args) {
      if (typeof args[0] == 'number') return super(Math.min(args[0], 10000))
      else return super(...args)
   }
}