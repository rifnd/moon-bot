const cluster = require('cluster'), path = require('path'), fs = require('fs'), package = require('./package.json'), CFonts = require('cfonts'), Readline = require('readline'), yargs = require('yargs/yargs')
const readline = Readline.createInterface(process.stdin, process.stdout)

CFonts.say(`MOON-BOT`, {
   font: 'tiny',
   align: 'center',
   colors: ['system']
})
CFonts.say(`Github : https://github.com/rifnd/moon-bot`, {
   font: 'console',
   align: 'center',
   colors: ['system']
})

var isRunning = false
/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
   if (isRunning) return
   isRunning = true
   let args = [path.join(__dirname, file), ...process.argv.slice(2)]
   cluster.setupMaster({
      exec: path.join(__dirname, file),
      args: args.slice(1),
   })
   let p = cluster.fork()
   p.on('message', data => {
      console.log('[RECEIVED]', data)
      switch (data) {
         case 'reset':
            p.process.kill()
            isRunning = false
            start.apply(this, arguments)
         break
         case 'uptime':
            p.send(process.uptime())
         break
      }
   })
   p.on('exit', (_, code) => {
      isRunning = false
      console.error('Exited with code:', code)
      if (code === 0) return
      fs.watchFile(args[0], () => {
         fs.unwatchFile(args[0])
         start(file)
      })
   })
   let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
   if (!opts['test'])
      if (!readline.listenerCount()) readline.on('line', line => {
         p.emit('message', line.trim())
      })
   // console.log(p)
}
start('main.js')