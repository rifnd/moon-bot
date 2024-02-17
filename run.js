var bs = require('child_process')
process.env.TZ = 'Asia/Jakarta'

bs.spawn('bash', [], {
  stdio: ['inherit', 'inherit', 'inherit', 'ipc']
})