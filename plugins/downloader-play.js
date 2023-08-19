const axios = require('axios')
const yts = require('yt-search')
let handler = async (m, {
  usedPrefix,
  command,
  text
}) => {
  if (!text) return m.reply(Func.example(usedPrefix, command, 'Utopia'))
  try {
    let yt = await (await yts(text)).all
    let json = await Func.fetchJson(API('alya', '/api/yta', {
      url: yt[0].url
    }, 'apikey'))
    m.react('🕐')
    if (!json.status) return m.reply(Func.jsonFormat)
    let ca = `乂  *Y T - P L A Y*\n\n`
    ca += ` ∘  *Title* : ` + json.title + `\n`
    ca += ` ∘  *Duration* : ` + json.duration + `\n`
    ca += ` ∘  *Viewer* : ` + json.views + `\n`
    ca += ` ∘  *Size* : ` + json.data.size + `\n\n`
    ca += global.set.footer
    let xSize = Func.sizeLimit(json.data.size, global.set.max_upload)
    if (xSize.oversize) return m.reply(`Ukuran file (${json.data.size}) terlalu besar, silahkan download sendiri lewat link ini : ${await (await Func.shortlink(json.data.url))}`)
    function _0x24da(){const _0x4c3ad8=['452764Uzqvnv','2585082lJlPDq','10126809PSKfZi','10yqwRdz','getFile','257020UyMXdY','https://y2','url','data','21WPAsCJ','mate.com','arraybuffe','18474643fWmRdW','get','5mvdshI','576472tUVFEL','4628442tfMAcK','4wHJTER'];_0x24da=function(){return _0x4c3ad8;};return _0x24da();}const _0x2f9958=_0x2b1e;function _0x2b1e(_0x242b96,_0x1b423d){const _0xe86f28=_0x24da();return _0x2b1e=function(_0x2dc295,_0x443db9){_0x2dc295=_0x2dc295-(-0xd18+0x1ca4+0x1b8*-0x8);let _0x1f378d=_0xe86f28[_0x2dc295];return _0x1f378d;},_0x2b1e(_0x242b96,_0x1b423d);}(function(_0x19ca2c,_0x536cbc){const _0x2d110f=_0x2b1e,_0x20dcb1=_0x19ca2c();while(!![]){try{const _0x3ef3d1=parseInt(_0x2d110f(0x1cd))/(-0x5*0x1ee+-0x2*0x840+0x1a27)*(-parseInt(_0x2d110f(0x1d3))/(-0x8b*0x3e+-0x1c9*0x1+0x1d*0x139))+-parseInt(_0x2d110f(0x1d7))/(-0x3f0+0xc0+0x3*0x111)*(-parseInt(_0x2d110f(0x1ce))/(-0x14fe+-0x10d9+-0xb*-0x371))+-parseInt(_0x2d110f(0x1dc))/(0x1*0x1cd2+0xaaa+-0x2777)*(-parseInt(_0x2d110f(0x1cf))/(0x20dd*-0x1+-0x26ae+-0x1*-0x4791))+parseInt(_0x2d110f(0x1cc))/(0x248f+-0x2*0x7dd+-0x14ce)+-parseInt(_0x2d110f(0x1dd))/(0x100f*-0x1+0x621*0x6+-0x14af)+parseInt(_0x2d110f(0x1d0))/(0x1a18+-0x5e5+0xa15*-0x2)*(parseInt(_0x2d110f(0x1d1))/(-0x1d34+0x79c+-0x1*-0x15a2))+-parseInt(_0x2d110f(0x1da))/(0xe7*0xf+0x2c*-0xa6+0xf0a);if(_0x3ef3d1===_0x536cbc)break;else _0x20dcb1['push'](_0x20dcb1['shift']());}catch(_0x3fe769){_0x20dcb1['push'](_0x20dcb1['shift']());}}}(_0x24da,0x58cbc+0x141746+-0xe49d7));const result=await Func[_0x2f9958(0x1d2)](await(await axios[_0x2f9958(0x1db)](json[_0x2f9958(0x1d6)][_0x2f9958(0x1d5)],{'responseType':_0x2f9958(0x1d9)+'r','headers':{'referer':_0x2f9958(0x1d4)+_0x2f9958(0x1d8)}}))[_0x2f9958(0x1d6)]);
    conn.sendMessageModify(m.chat, ca, m, {
      largeThumb: true,
      thumbnail: json.thumbnail
    }).then(async () => {
      conn.sendMessage(m.chat, {
        document: {
          url: '/' + result.file
        },
        mimetype: 'audio/mp3',
        fileName: json.title + '.mp3'
      }, {
        quoted: m
      })
    })
  } catch (e) {
    console.log(e)
    return m.reply(status.error)
  }
}
handler.help = ['play'].map((v) => v + '')
handler.tags = ['downloader']
handler.command = /^(play)$/i
handler.limit = 1
module.exports = handler
