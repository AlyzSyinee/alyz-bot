const { canManage, jidNum } = require('../utils')

module.exports = {
  name: 'tagall',
  run: async (sock, from, msg, args, q, ctx) => {
    if (!ctx.isGroup) return sock.sendMessage(from, { text: 'Khusus grup.' }, { quoted: msg })
    if (!(await canManage(sock, from, ctx.sender))) {
      return sock.sendMessage(from, { text: 'Hanya owner atau admin grup.' }, { quoted: msg })
    }
    const md = await sock.groupMetadata(from)
    const ids = md.participants.map((p) => p.id)
    const list = ids.map((id) => `@${jidNum(id)}`).join('\n')
    await sock.sendMessage(from, { text: `${q || 'TAG ALL'}\n\n${list}`, mentions: ids })
  }
}