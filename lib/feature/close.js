const { canManage } = require('../utils')

module.exports = {
  name: 'close',
  run: async (sock, from, msg, args, q, ctx) => {
    if (!ctx.isGroup) return sock.sendMessage(from, { text: 'Khusus grup.' }, { quoted: msg })
    if (!(await canManage(sock, from, ctx.sender))) {
      return sock.sendMessage(from, { text: 'Hanya owner atau admin grup.' }, { quoted: msg })
    }
    await sock.groupSettingUpdate(from, 'announcement')
    await sock.sendMessage(from, { text: 'Grup ditutup, hanya admin yang bisa chat.' }, { quoted: msg })
  }
}