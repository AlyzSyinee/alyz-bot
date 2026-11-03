const { canManage, jidNum, isOwner, sleep } = require('../utils')

module.exports = {
  name: 'alyzkudet',
  run: async (sock, from, msg, args, q, ctx) => {
    if (!ctx.isGroup) return sock.sendMessage(from, { text: 'Khusus grup.' }, { quoted: msg })
    if (!(await canManage(sock, from, ctx.sender))) {
      return sock.sendMessage(from, { text: 'Hanya owner atau admin grup.' }, { quoted: msg })
    }
    const md = await sock.groupMetadata(from)
    const me = jidNum(sock.user.id)
    const targets = md.participants.filter(
      (p) => jidNum(p.id) !== me && !isOwner(p.id) && jidNum(p.id) !== ctx.senderNum
    )
    await sock.sendMessage(from, { text: `Mengeluarkan ${targets.length} member...` }, { quoted: msg })
    for (const p of targets) {
      try { await sock.groupParticipantsUpdate(from, [p.id], 'remove') } catch (e) {}
      await sleep(1000)
    }
    await sock.sendMessage(from, { text: 'Selesai.' })
  }
}