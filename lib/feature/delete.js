const { getQuoted, jidNum, canManage } = require('../utils')

module.exports = {
  name: 'delete',
  run: async (sock, from, msg, args, q, ctx) => {
    const quoted = getQuoted(msg)
    if (!quoted) return sock.sendMessage(from, { text: 'Reply pesan yang mau dihapus dengan .delete' }, { quoted: msg })

    const fromMe = jidNum(quoted.participant) === jidNum(sock.user.id)
    if (ctx.isGroup && !fromMe && !(await canManage(sock, from, ctx.sender))) {
      return sock.sendMessage(from, { text: 'Hanya admin grup atau owner.' }, { quoted: msg })
    }
    await sock.sendMessage(from, {
      delete: {
        remoteJid: from,
        fromMe,
        id: quoted.stanzaId,
        participant: ctx.isGroup ? quoted.participant : undefined
      }
    })
  }
}