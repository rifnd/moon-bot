const cp = require('child_process')
const { promisify, inspect, format } = require('util')
const exec = promisify(cp.exec).bind(cp)
const syntaxerror = require('syntax-error')
let handler = m => m
handler.before = async function (m, _2) {
   let { conn, args, groupMetadata, plugins, isOwner, Func, Scraper, setting } = _2
   if (!isOwner && !m.fromMe) return
   let _return
   let _syntax = ''
   let txt = 'return ' + m.text.slice(3)
   if (m.text.startsWith('=>')) {
      try {
         let i = 15
         let f = {
            exports: {},
         }
         let execFunc = new (async () => { }).constructor('print', 'm', 'handler', 'require', 'conn', 'Func', 'Scraper', 'setting', 'Array', 'process', 'args', 'groupMetadata', 'plugins', 'module', 'exports', 'argument', txt)
         _return = await execFunc.call(conn, (...args) => {
            if (--i < 1) return
            console.log(...args)
            return conn.reply(m.chat, format(...args), m)
         }, m, handler, require, conn, Func, Scraper, setting, CustomArray, process, args, groupMetadata, plugins, f, f.exports, [conn, _2])
      } catch (e) {
         let err = await syntaxerror(txt, 'Execution Function', {
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true,
         })
         if (err) _syntax = '```' + err + '```\n\n'
         _return = e
      } finally {
         conn.reply(m.chat, _syntax + Func.jsonFormat(_return), m)
      }
   } else if (m.text.startsWith('>')) {
      let txt = m.text.slice(2)
      try {
         let evaled = await eval(txt)
         if (typeof evaled !== 'string') evaled = inspect(evaled)
         conn.reply(m.chat, evaled, m)
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
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
         if (stdout.trim()) conn.reply(m.chat, Func.texted('monospace', stdout), m)
         if (stderr.trim()) conn.reply(m.chat, Func.texted('monospace', stderr), m)
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