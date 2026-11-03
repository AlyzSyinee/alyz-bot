const { findMedia, dl } = require('../utils')

module.exports = {
  name: 'toptv',
  run: async (sock, from, msg) => {
    const m = findMedia(msg, ['videoMessage'])
    if (!m) return sock.sendMessage(from, { text: 'Reply video dengan .toptv' }, { quoted: msg })
    const buffer = await dl(sock, m.target)
    await sock.sendMessage(from, { video: buffer, ptv: true }, { quoted: msg })
  }
}