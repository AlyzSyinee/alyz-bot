module.exports = {
  name: 'owner',
  run: async (sock, from, msg) => {
    await sock.sendMessage(from, { text: 'OWNER : 6283176204764 - DEVELOPER BOT ALYZ' }, { quoted: msg })
  }
}