const { canManage, getTargetNumber, isOwner, jidNum } = require('../utils')

module.exports = {
  name: 'ban',
  run: async (sock, from, msg, args, q, ctx) => {
    if (!ctx.isGroup) return sock.sendMessage(from, { text: 'Khusus grup.' }, { quoted: msg })
    if (!(await canManage(sock, from, ctx.sender))) {
      return sock.sendMessage(from, { text: 'Hanya owner atau admin grup.' }, { quoted: msg })
    }
    const num = getTargetNumber(msg, args)
    if (!num) return sock.sendMessage(from, { text: 'Pakai: .ban <nomor> (atau tag / reply)' }, { quoted: msg })
    if (isOwner(num) || num === jidNum(sock.user.id)) {
      return sock.sendMessage(from, { text: 'Tidak bisa ban owner atau bot.' }, { quoted: msg })
    }
    if (!ctx.bannedInGroup.has(from)) ctx.bannedInGroup.set(from, new Set())
    ctx.bannedInGroup.get(from).add(num)
    await sock.sendMessage(from, { text: `${num} di-ban. Pesannya akan dihapus otomatis (bot harus admin grup).` }, { quoted: msg })
  }
}