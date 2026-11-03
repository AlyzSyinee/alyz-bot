const { canManage } = require('../utils')

module.exports = {
  name: 'h',
  run: async (sock, from, msg, args, q, ctx) => {
    if (!ctx.isGroup) return sock.sendMessage(from, { text: 'Khusus grup.' }, { quoted: msg })
    if (!(await canManage(sock, from, ctx.sender))) {
      return sock.sendMessage(from, { text: 'Hanya owner atau admin grup.' }, { quoted: msg })
    }
    if (!q) return sock.sendMessage(from, { text: 'Pakai: .h <teks>' }, { quoted: msg })
    const md = await sock.groupMetadata(from)
    await sock.sendMessage(from, { text: q, mentions: md.participants.map((p) => p.id) })
  }
}