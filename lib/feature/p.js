const { isOwner, normNum } = require('../utils')

module.exports = {
  name: 'p',
  run: async (sock, from, msg, args, q, ctx) => {
    if (!msg.key.fromMe && !isOwner(ctx.sender)) {
      return sock.sendMessage(from, { text: 'Hanya owner.' }, { quoted: msg })
    }
    const m = q.match(/^([\s\S]+?)\s+(62\d{6,15})$/)
    if (!m) return sock.sendMessage(from, { text: 'Pakai: .p <teks> <62xxxxxxxx>' }, { quoted: msg })
    const text = m[1]
    const jid = normNum(m[2]) + '@s.whatsapp.net'
    const [exists] = await sock.onWhatsApp(jid)
    if (!exists || !exists.exists) {
      return sock.sendMessage(from, { text: 'Nomor tidak terdaftar di WhatsApp.' }, { quoted: msg })
    }
    await sock.sendMessage(exists.jid, { text })
    await sock.sendMessage(from, { text: 'Terkirim.' }, { quoted: msg })
  }
}