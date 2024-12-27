const http = require('http')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080

const server = async () => {
   app.get('/', async (req, res) => {
      res.status(200).json({
         status: true,
         uptime: process.uptime(),
         timestamp: new Date().toISOString()
      })
   })
   const index = http.createServer(app)
   index.listen(PORT, () => console.log(`Server is running -- ${PORT}`))
}
server().catch(() => server())