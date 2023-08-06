const axios = require('axios'),
   fetch = require('node-fetch'),
   cheerio = require('cheerio'),
   fs = require('fs'),
   path = require('path'),
   mime = require('mime-types'),
   FormData = require('form-data'),
   NodeID3 = require('node-id3'),
   { fromBuffer } = require('file-type'),
   { read, MIME_JPEG, RESIZE_BILINEAR, AUTO } = require('jimp')

// Dari https://www.npmjs.com/package/@neoxr/neoxr-js

exports.delay = time => new Promise(res => setTimeout(res, time))

exports.isUrl = (url) => {
   return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
}

exports.fetchJson = async (url, options = {}) => {
   try {
      const result = await (await fetch(url, {
         headers: options
      })).json()
      return result
   } catch (e) {
      return ({
         status: false,
         msg: `System cannot detect JSON!`
      })
   }
}

exports.fetchBuffer = async (file, options = {}) => {
   return new Promise(async (resolve, reject) => {
      try {
         if (this.isUrl(file)) {
            let buff = await (await axios.get(file, { responseType: "arraybuffer", headers: options })).data
            resolve(buff)
         } else {
            let buff = fs.readFileSync(file)
            resolve(buff)
         }
      } catch (e) {
         return ({
            status: false,
            msg: `System cannot detect Buffer!`
         })
      }
   })
}

exports.texted = (type, text) => {
   switch (type) {
      case 'bold':
         return '*' + text + '*'
         break
      case 'italic':
         return '_' + text + '_'
         break
      case 'monospace':
         return '```' + text + '```'
   }
}

exports.example = (usedPrefix, command, args) => {
   return `• ${this.texted('bold', 'Contoh')} : ${usedPrefix + command} ${args}`
}

exports.toTime = (ms) => {
   let h = Math.floor(ms / 3600000)
   let m = Math.floor(ms / 60000) % 60
   let s = Math.floor(ms / 1000) % 60
   return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

exports.filename = (extension) => {
   return `${Math.floor(Math.random() * 10000)}.${extension}`
}

exports.uuid = () => {
   var dt = new Date().getTime()
   var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      var y = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
   });
   return uuid
}

exports.random = (list) => {
   return list[Math.floor(Math.random() * list.length)]
}

exports.formatSize = (size) => {
   function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0)
      return Math.round(value * multiplier) / multiplier
   }
   var megaByte = 1024 * 1024
   var gigaByte = 1024 * megaByte
   var teraByte = 1024 * gigaByte
   if (size < 1024) {
      return size + ' B'
   } else if (size < megaByte) {
      return round(size / 1024, 1) + ' KB'
   } else if (size < gigaByte) {
      return round(size / megaByte, 1) + ' MB'
   } else if (size < teraByte) {
      return round(size / gigaByte, 1) + ' GB'
   } else {
      return round(size / teraByte, 1) + ' TB'
   }
   return ''
}

exports.getSize = async (str) => {
   if (!isNaN(str)) return this.formatSize(str)
   let header = await (await axios.get(str)).headers
   return this.formatSize(header['content-length'])
}

exports.sizeLimit = (str, max) => {
   let data
   if (str.match('G') || str.match('GB') || str.match('T') || str.match('TB')) return data = {
      oversize: true
   }
   if (str.match('M') || str.match('MB')) {
      let first = str.replace(/MB|M|G|T/g, '').trim()
      if (isNaN(first)) return data = {
         oversize: true
      }
      if (first > max) return data = {
         oversize: true
      }
      return data = {
         oversize: false
      }
   } else {
      return data = {
         oversize: false
      }
   }
}

exports.jsonFormat = (obj) => {
   try {
      let print = (obj && (obj.constructor.name == 'Object' || obj.constructor.name == 'Array')) ? require('util').format(JSON.stringify(obj, null, 2)) : require('util').format(obj)
      return print
   } catch {
      return require('util').format(obj)
   }
}

exports.toDate = (ms) => {
   let temp = ms
   let days = Math.floor(ms / (24 * 60 * 60 * 1000));
   let daysms = ms % (24 * 60 * 60 * 1000);
   let hours = Math.floor((daysms) / (60 * 60 * 1000));
   let hoursms = ms % (60 * 60 * 1000);
   let minutes = Math.floor((hoursms) / (60 * 1000));
   let minutesms = ms % (60 * 1000);
   let sec = Math.floor((minutesms) / (1000));
   if (days == 0 && hours == 0 && minutes == 0) {
      return "Recently"
   } else {
      return days + "D " + hours + "H " + minutes + "M";
   }
}

exports.timeFormat = (value) => {
   const sec = parseInt(value, 10)
   let hours = Math.floor(sec / 3600)
   let minutes = Math.floor((sec - (hours * 3600)) / 60)
   let seconds = sec - (hours * 3600) - (minutes * 60)
   if (hours < 10) hours = '0' + hours
   if (minutes < 10) minutes = '0' + minutes
   if (seconds < 10) seconds = '0' + seconds
   if (hours == parseInt('00')) return minutes + ':' + seconds
   return hours + ':' + minutes + ':' + seconds
}

exports.makeId = (length) => {
   var result = ''
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
   var charactersLength = characters.length
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
   }
   return result
}

exports.jsonRandom = (file) => {
   let json = JSON.parse(fs.readFileSync(file))
   return json[Math.floor(Math.random() * json.length)]
}

exports.reSize = async (buffer, x, z) => {
   return new Promise(async (resolve, reject) => {
      var buff = await read(buffer)
      var ab = await buff.resize(x, z).getBufferAsync(MIME_JPEG)
      resolve(ab)
   })
}

exports.shortlink = async (url) => {
   isurl = /https?:\/\//.test(url)
   return isurl
     ? (
         await require('axios').get(
           'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url),
         )
       ).data
     : ''
 } 

const chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
   fs.unwatchFile(file)
   console.log(chalk.redBright("Update 'functions.js'"))
   delete require.cache[file]
   require(file)
})