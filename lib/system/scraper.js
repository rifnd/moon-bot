const { Scraper } = new (require('@moonr/func'))
const axios = require('axios')

Scraper.simsimi = (text, lang = 'id') => {
   return new Promise(async (resolve) => {
      try {
         let json = await (await axios.post('https://simsimi.vn/web/simtalk', `text=${encodeURI(text)}&lc=${lang}`, {
            headers: {
               'Accept': '*/*',
               'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
               'Referer': 'https://simsimi.net/',
               'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36'
            }
         })).data
         if (json.success.match(new RegExp('Aku tidak mengerti', 'g'))) return resolve({
            creator: creator,
            status: false
         })
         resolve({
            cretor: creator,
            status: true,
            msg: json.success
         })
      } catch (e) {
         console.log(e)
         return resolve({
            creator: creator,
            status: false
         })
      }
   })
}