// GANTI FOTO SAMPUL MENU DI SINI. Kosongkan ('') untuk kirim teks saja.
// Bukan dari media/QR.jpg, file itu hanya untuk .order
const MENU_COVER_LINK = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'

const { OWNER_NUMBER } = require('../utils')

const CATEGORIES = {
  UMUM: ['info', 'owner', 'order'],
  GRUP: ['open', 'close', 'tagall', 'h', 'ban', 'deleteban', 'delete', 'alyzkudet'],
  MEDIA: ['rvo', 'toptv', 'toimg', 'tostc', 'getpp', 'alyzmusik'],
  LAINNYA: ['selfmode', 'p']
}

module.exports = {
  name: 'menu',
  run: async (sock, from, msg, args, q, ctx) => {
    const names = [...ctx.features.keys()].filter((n) => n !== 'menu')
    const used = new Set()
    let list = ''

    for (const [cat, items] of Object.entries(CATEGORIES)) {
      const present = items.filter((i) => names.includes(i))
      present.forEach((i) => used.add(i))
      if (!present.length) continue
      list += `\n+-- ${cat}\n` + present.map((i) => `|  ${ctx.prefix}${i}`).join('\n') + '\n+--\n'
    }
    const rest = names.filter((n) => !used.has(n))
    if (rest.length) {
      list += `\n+-- FITUR LAIN\n` + rest.map((i) => `|  ${ctx.prefix}${i}`).join('\n') + '\n+--\n'
    }

    const menuText =
`+==============================+
|   ALYZ BOT - MULTI PLATFORM  |
+==============================+

Owner  : ${OWNER_NUMBER}
Bot    : ${ctx.number}
Prefix : ${ctx.prefix}
Fitur  : ${names.length}
${list}
ALYZ BOT v3.0 FINAL`

    if (MENU_COVER_LINK && /^https?:\/\//i.test(MENU_COVER_LINK)) {
      try {
        return await sock.sendMessage(
          from,
          { image: { url: MENU_COVER_LINK }, caption: menuText },
          { quoted: msg }
        )
      } catch (e) { /* gagal ambil gambar, kirim teks saja */ }
    }
    await sock.sendMessage(from, { text: menuText }, { quoted: msg })
  }
}