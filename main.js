"use strict"
require('./lib/system/config')
const { Connection, Mongo, Postgre, Functions: Func } = new (require('@moonr/utils')), { existsSync, mkdirSync, readdirSync, unlinkSync, statSync, openSync } = require('fs'), env = require('./config.json'), path = require('path')
const database = /mongo/.test(process.env.DATABASE_URL) ? new Mongo(process.env.DATABASE_URL, env.database) : /postgres/.test(process.env.DATABASE_URL) ? new Postgre(process.env.DATABASE_URL, env.database) : new (require('./lib/system/localdb'))(env.database)

const conn = new Connection({
   session: 'session', /** this is for the folder storing the session */
   store: 'data.store.json', /** file store */
   online: false, /** in for online view on whatsapp */
   browser: ['Ubuntu', 'Chrome', '20.0.04'] /** this is for the browser version */
})

/** connection already established */
conn.once('connect', async ex => {
   try {
      /** database */
      global.db = { users: {}, groups: {}, chats: {}, setting: {}, stats: {}, sticker: {}, msgs: {}, store: [], transactions: [], ...(await database.fetch() || {}) }
      /** save database */
      await database.save(global.db)
   } catch (e) {
      console.error(e)
   }
})

/** for connection preparation */
conn.once('prepare', async () => {
   try {
      /* auto restart if ram usage is over */
      const ramCheck = setInterval(() => {
         var ramUsage = process.memoryUsage().rss
         if (ramUsage >= require('bytes')(env.ram_limit)) {
            clearInterval(ramCheck)
            process.send('reset')
         }
      }, 60 * 1000)

      /* create temp directory if doesn't exists */
      if (!existsSync('./tmp')) mkdirSync('./tmp')

      /* clear temp folder every 10 minutes */
      setInterval(async () => {
         try {
            const tmpFiles = readdirSync('./tmp')
            if (tmpFiles.length > 0) {
               tmpFiles.filter(v => !v.endsWith('.file')).map(v => unlinkSync('./tmp/' + v))
            }
         } catch { }
      }, 60 * 1000 * 10)

      /** clear session & store */
      setInterval(async () => {
         /** session */
         const sessionFiles = readdirSync('./session')
         if (sessionFiles.length > 0) {
            sessionFiles.filter(v => v !== 'creds.json').map(v => unlinkSync('./session/' + v))
         }
         /** store file */
         unlinkSync('data.store.json')
      }, 60 * 1000 * 60)

      /** save database every 30 seconds */
      setInterval(async () => {
         if (global.db) await database.save(global.db)
      }, 60_000)
   } catch (e) {
      console.error(e)
   }
})

/** reloading important files */
conn.ev('import', ctx => {
   try {
      require('./handler')(conn.sock, ctx)
      require('./lib/system/simple')(conn.sock)
      require('./lib/system/functions')
      require('./lib/system/scraper')
   } catch (e) {
      console.error(e)
   }
})

/** incoming/outgoing group members */
conn.ev('group-participants.update', async ctx => {
   let group = global.db.groups[ctx.jid] || {}
   var text = ''
   switch (ctx.action) {
      case 'add':
      case 'remove':
         let pic = await conn.sock.profilePictureUrl(ctx.member, 'image') || await Func.fetchBuffer('./src/image/default.jpg')
         text = (ctx.action === 'add' ? (group.sWelcome || 'Welcome to @subject @user\n\n@desc').replace('@user', '@' + ctx.member.split('@')[0]).replace('@subject', ctx.subject).replace('@desc', ctx.groupMetadata.desc.toString()) : (group.sBye || 'Goodbye @user.').replace('@user', '@' + ctx.member.split('@')[0]))
         if (group && group.welcome) conn.sock.sendMessageModify(ctx.jid, text, null, {
            largeThumb: true,
            thumbnail: pic,
            url: global.db.setting.link
         })
      break
      case 'promote':
         text = ('@user is now Admin!')
      case 'demote':
         if (!text) text = ('@user is now not Admin!')
         text = text.replace('@user', '@' + ctx.member.split('@')[0])
         if (group.detect) conn.sock.fakeText(ctx.jid, text, global.footer)
      break
   }
})

/** detection of changes in the group */
conn.ev('group.detect', async ctx => {
   let group = global.db.groups[ctx.jid], text = ''
   if (ctx.action.subject) text = ('Group title has been changed to : @subject').replace('@subject', ctx.action.subject)
   if (ctx.action.inviteCode) text = ('Group link has been changed to :\n\nhttps://chat.whatsapp.com/@revoke').replace('@revoke', ctx.action.inviteCode)
   if (ctx.action.announce === true) text = 'Group has been closed'
   if (ctx.action.announce === false) text = 'Group has been opened'
   if (group && group.detect) conn.sock.fakeText(ctx.jid, text, global.footer)
})

/** anti-delete message */
conn.ev('message.delete', async ctx => {
   let group = global.db.groups[ctx.jid] || {}
   if (group && group.antidelete) await conn.sock.copyNForward(ctx.jid, ctx.msg).catch(e => console.log(e, ctx.msg))
})

/** typing detection, recording while afk */
conn.ev('presence.update', ctx => {
   const sock = conn.sock
   if (!ctx) return
   const { id, presences } = ctx
   if (id.endsWith('g.us')) {
      for (let jid in presences) {
         if (!presences[jid] || jid == sock.decodeJid(sock.user.id)) continue
         if ((presences[jid].lastKnownPresence === 'composing' || presences[jid].lastKnownPresence === 'recording') && global.db && global.db.users && global.db.users[jid] && global.db.users[jid].afk > -1) {
            sock.reply(id, `System detects activity from @${jid.replace(/@.+/, '')} after being offline for : ${Func.texted('bold', Func.toTime(new Date - global.db.users[jid].afk))}\n\n➠ ${Func.texted('bold', 'Reason')} : ${global.db.users[jid].afkReason ? global.db.users[jid].afkReason : '-'}`, global.db.users[jid].afkObj)
            global.db.users[jid].afk = -1
            global.db.users[jid].afkReason = ''
            global.db.users[jid].afkObj = {}
         }
      }
   }
})

/** reject call */
conn.ev('call', async ctx => {
   if (global.db.setting && global.db.setting.anticall) {
      for (const id of ctx) {
         if (id.status === 'offer') {
            let msg = await conn.sock.fakeText(id.from, `Sorry for now, we cannot accept calls, either in groups or privately\n\nIf you need help or request features, please chat with the owner :p`, global.footer)
            conn.sock.sendContact(id.from, [{
               name: env.owner_name,
               number: env.owner,
               about: 'Owner & Creator'
            }], msg, {
               org: 'Moon Support',
               website: 'https://api.alyachan.dev',
               email: 'contact@moonx.my.id'
            })
            await conn.sock.rejectCall(id.id, id.from)
         }
      }
   }
})