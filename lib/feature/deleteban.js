const { canManage, getTargetNumber } = require('../utils')

module.exports = {
  name: 'deleteban',
  run: async (sock, from, msg, args, q, ctx) => {
    if (!ctx.isGroup) return sock.sendMessage(from, { text: 'Khusus grup.' }, { quoted: msg })
    if (!(await canManage(sock, from, ctx.sender))) {
      return sock.sendMessage(from, { text: 'Hanya owner atau admin grup.' }, { quoted: msg })
    }
    const num = getTargetNumber(msg, args)
    if (!num) return sock.sendMessage(from, { text: 'Pakai: .deleteban <nomor> (atau tag / reply)' }, { quoted: msg })
    const set = ctx.bannedInGroup.get(from)
    if (set && set.delete(num)) {
      return sock.sendMessage(from, { text: `Ban ${num} dicabut.` }, { quoted: msg })
    }
    await sock.sendMessage(from, { text: `${num} tidak sedang di-ban.` }, { quoted: msg })
  }
}