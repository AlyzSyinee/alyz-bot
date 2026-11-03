const { canManage } = require('../utils')

module.exports = {
  name: 'open',
  run: async (sock, from, msg, args, q, ctx) => {
    if (!ctx.isGroup) return sock.sendMessage(from, { text: 'Khusus grup.' }, { quoted: msg })
    if (!(await canManage(sock, from, ctx.sender))) {
      return sock.sendMessage(from, { text: 'Hanya owner atau admin grup.' }, { quoted: msg })
    }
    await sock.groupSettingUpdate(from, 'not_announcement')
    await sock.sendMessage(from, { text: 'Grup dibuka, semua member bisa chat.' }, { quoted: msg })
  }
}