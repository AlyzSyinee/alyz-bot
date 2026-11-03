const axios = require('axios')

// API gratis pihak ketiga. Jika respons/endpoint berubah, ubah dua konstanta ini.
const SEARCH_API = 'https://api.ryzendesu.vip/api/search/yt'
const YTMP3_API = 'https://api.ryzendesu.vip/api/downloader/ytmp3'

function pickFirst(data) {
  const list =
    (Array.isArray(data) && data) ||
    data?.videos || data?.result || data?.results || data?.data || []
  const arr = Array.isArray(list) ? list : [list]
  const v = arr[0]
  if (!v) return null
  const url = v.url || v.link || (v.videoId ? `https://www.youtube.com/watch?v=${v.videoId}` : null)
  return url ? { url, title: v.title || v.name || 'Lagu' } : null
}

function pickDownload(data) {
  return (
    data?.url || data?.download || data?.link ||
    data?.result?.url || data?.result?.download ||
    data?.data?.url || data?.data?.download || null
  )
}

module.exports = {
  name: 'alyzmusik',
  run: async (sock, from, msg, args, q) => {
    if (!q) return sock.sendMessage(from, { text: 'Pakai: .alyzmusik <nama lagu>' }, { quoted: msg })
    await sock.sendMessage(from, { text: 'Mencari lagu...' }, { quoted: msg })

    const s = await axios.get(SEARCH_API, { params: { query: q }, timeout: 30000 })
    const song = pickFirst(s.data)
    if (!song) return sock.sendMessage(from, { text: 'Lagu tidak ditemukan.' }, { quoted: msg })

    const d = await axios.get(YTMP3_API, { params: { url: song.url }, timeout: 60000 })
    const dlUrl = pickDownload(d.data)
    if (!dlUrl) return sock.sendMessage(from, { text: 'Gagal mengambil link audio dari API.' }, { quoted: msg })

    const audio = await axios.get(dlUrl, { responseType: 'arraybuffer', timeout: 120000 })
    await sock.sendMessage(
      from,
      { audio: Buffer.from(audio.data), mimetype: 'audio/mpeg', fileName: `${song.title}.mp3` },
      { quoted: msg }
    )
  }
}