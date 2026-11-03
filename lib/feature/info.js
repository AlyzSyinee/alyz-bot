module.exports = {
  name: 'info',
  run: async (sock, from, msg) => {
    await sock.sendMessage(from, { text: 'ALYZ BOT ADALAH PLATFORM BOT TANPA CODING UNTUK SEMUA PENGGUNAAN WHATSAPP' }, { quoted: msg })
  }
}