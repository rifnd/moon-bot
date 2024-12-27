const generate = (x, y, bombs) => {
   const field = Array.from({ length: x }, () => Array(y).fill(0))

   for (let i = 0; i < bombs; i++) {
      let xBomb, yBomb
      do {
         xBomb = Math.floor(Math.random() * x)
         yBomb = Math.floor(Math.random() * y)
      } while (field[xBomb][yBomb] === 'x')
      field[xBomb][yBomb] = 'x'
   }

   for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
         if (field[i][j] !== 'x') {
            for (let k = -1; k <= 1; k++) {
               for (let l = -1; l <= 1; l++) {
                  const ni = i + k
                  const nj = j + l
                  if (ni >= 0 && ni < x && nj >= 0 && nj < y && field[ni][nj] === 'x') {
                     field[i][j]++
                  }
               }
            }
         }
      }
   }

   return field
}

const generateEmpty = (x, y) => {
   return Array.from({ length: x }, () => Array(y).fill(0))
}

const translate = (value) => {
   switch (value) {
      case 0: return '⬜'
      case 1: return '1️⃣'
      case 2: return '2️⃣'
      case 3: return '3️⃣'
      case 4: return '4️⃣'
      case 5: return '5️⃣'
      case 6: return '6️⃣'
      case 7: return '7️⃣'
      case 8: return '8️⃣'
      case 'x': return '💣'
      case 'e': return '⏹️'
      case 'f': return '🚩'
   }
}

const generateString = (map) => {
   return map.map(row => row.map(cell => translate(cell)).join('')).join('\n')
}

const detectZero = (map, x, y) => {
   const queue = [[x, y]]
   const result = []
   const visited = new Set()

   while (queue.length > 0) {
      const [cx, cy] = queue.shift()

      if (!visited.has(`${cx},${cy}`)) {
         visited.add(`${cx},${cy}`)
         result.push([cx, cy])

         if (map[cx][cy] === 0) {
            for (let i = -1; i <= 1; i++) {
               for (let j = -1; j <= 1; j++) {
                  const ni = cx + i
                  const nj = cy + j
                  if (ni >= 0 && ni < map.length && nj >= 0 && nj < map[0]?.length) {
                     queue.push([ni, nj])
                  }
               }
            }
         }
      }
   }

   return result
}

const handler = async (m, {
   conn,
   usedPrefix,
   command,
   env,
   args,
   Func
}) => {
   conn.minessweeper = conn.minessweeper ? conn.minessweeper : {}
   let id = m.chat, poin = Func.randomInt(env.min_reward, env.max_reward)

   const orgs = args[0]
   const oX = args[1]
   const oY = args[2]
   const F = args[3]

   if (!orgs) {
      await conn.reply(m.chat, `乂  *M I N E S W E E P E R*\n\n◦ *${usedPrefix + command} go* - Start the Game\n◦ *${usedPrefix + command} open* - Open a cell\n◦ *${usedPrefix + command} surrender* - Surrender\n\n◦ *Example:* ${usedPrefix + command} go`, m)
      return
   }

   switch (orgs.toLowerCase()) {
      case 'go':
      case 'start':
         const map = generate(10, 10, 15)
         const empty = generateEmpty(10, 10)
         const { key } = await conn.reply(m.chat, `乂  *M I N E S W E E P E R*\n\nBoard :\n${generateString(empty)}`, m)

         conn.minessweeper[id] = {
            map: map,
            current: empty,
            key: key
         }
      break

      case 'surrender':
      case 'stop':
      case 'end':
         if (conn.minessweeper[id]) {
            delete conn.minessweeper[id]
            await conn.reply(m.chat, '🚩 You surrender.', m)
         } else {
            await conn.reply(m.chat, '🚩 No active game sessions.', m)
         }
      break

      case 'open':
      case 'o':
      case 'buka':
         if (!conn.minessweeper[id]) {
            await conn.reply(m.chat, '🚩 No active game sessions.', m)
            return
         }

         if (oX > 10 || !oX || !oY) {
            await conn.reply(m.chat, `◦ *Example* : ${usedPrefix + command} open 2 5`, m)
            return
         }

         const g = conn.minessweeper[id]

         if (F === 'f') {
            g.current[oY - 1][oX - 1] = '🚩'
         } else {
            const openedCell = g.map[oX - 1][oY - 1]

            if (openedCell === 0) {
               const zero = detectZero(g.map, oX - 1, oY - 1)
               for (const coords of zero) {
                  g.current[coords[0]][coords[1]] = g.map[coords[0]][coords[1]]
               }
            } else {
               if (openedCell === 'x') {
                  delete conn.minessweeper[id]
                  global.db.users[m.sender].exp -= poin

                  const { key: loseKey } = await conn.reply(m.chat, `*BOOMB*\nYou open a bomb, EXP is reduced ${Func.formatNumber(poin)}`, m)
                  conn.minessweeper[id] = { key: loseKey }
                  return
               }

               g.current[oY - 1][oX - 1] = openedCell
               global.db.users[m.sender].exp += poin
            }
         }

         await conn.sendMessage(m.chat, { delete: g.key })

         const { key: newKey } = await conn.reply(m.chat, `乂  *M I N E S W E E P E R*\n\nBoard :\n${generateString(g.current)}\n\nIf you win, you get *+${Func.formatNumber(poin)}* EXP`, m)
         conn.minessweeper[id].key = newKey
      break
   }
}
handler.help = ['minesweeper']
handler.command = ['mw']
handler.tags = ['game']
handler.limit = handler.game = handler.group = handler.register = true
module.exports = handler