const { findMedia, dl, ffmpeg } = require('../utils')

module.exports = {
  name: 'toimg',
  run: async (sock, from, msg) => {
    const m = findMedia(msg, ['stickerMessage'])
    if (!m) return sock.sendMessage(from, { text: 'Reply stiker dengan .toimg' }, { quoted: msg })
    const buffer = await dl(sock, m.target)
    const png = await ffmpeg(buffer, 'webp', 'png', ['-frames:v', '1'])
    await sock.sendMessage(from, { image: png, caption: 'Selesai' }, { quoted: msg })
  }
}