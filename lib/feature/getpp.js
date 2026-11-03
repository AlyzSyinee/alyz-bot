const { getPP, getTargetNumber, jidNum } = require('../utils')

module.exports = {
  name: 'getpp',
  run: async (sock, from, msg, args, q, ctx) => {
    const num = getTargetNumber(msg, args) || ctx.senderNum
    const jid = num + '@s.whatsapp.net'
    try {
      const buffer = await getPP(sock, jid)
      await sock.sendMessage(from, { image: buffer, caption: `Foto profil ${num}` }, { quoted: msg })
    } catch (e) {
      await sock.sendMessage(from, { text: 'Foto profil tidak ditemukan atau disembunyikan.' }, { quoted: msg })
    }
  }
}