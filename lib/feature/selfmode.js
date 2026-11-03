const { isOwner } = require('../utils')

module.exports = {
  name: 'selfmode',
  run: async (sock, from, msg, args, q, ctx) => {
    if (!msg.key.fromMe && !isOwner(ctx.sender)) {
      return sock.sendMessage(from, { text: 'Hanya owner.' }, { quoted: msg })
    }
    const v = (args[0] || '').toLowerCase()
    if (v !== 'on' && v !== 'off') {
      return sock.sendMessage(from, { text: 'Pakai: .selfmode on / .selfmode off' }, { quoted: msg })
    }
    ctx.selfMode.set(ctx.number, v === 'on')
    await sock.sendMessage(from, { text: `Self mode ${v.toUpperCase()}` }, { quoted: msg })
  }
}