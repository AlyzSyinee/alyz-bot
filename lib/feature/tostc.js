const { findMedia, dl, ffmpeg } = require('../utils')

const VF = 'scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0'

module.exports = {
  name: 'tostc',
  run: async (sock, from, msg) => {
    const m = findMedia(msg, ['imageMessage', 'videoMessage'])
    if (!m) return sock.sendMessage(from, { text: 'Kirim atau reply foto/video (maks 8 detik) dengan .tostc' }, { quoted: msg })
    const buffer = await dl(sock, m.target)
    const isVid = m.type === 'videoMessage'
    const args = ['-vf', VF, '-vcodec', 'libwebp', '-q:v', '70', '-compression_level', '6', '-an', '-loop', '0']
    if (isVid) args.push('-t', '8', '-r', '15')
    else args.push('-frames:v', '1')
    const webp = await ffmpeg(buffer, isVid ? 'mp4' : 'jpg', 'webp', args)
    await sock.sendMessage(from, { sticker: webp }, { quoted: msg })
  }
}