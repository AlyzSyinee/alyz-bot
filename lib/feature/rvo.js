const { downloadMediaMessage } = require('@whiskeysockets/baileys')

module.exports = {
    name: 'rvo',
    run: async (sock, msg, { from, q, dl }) => {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
            const quotedViewOnce = quoted?.viewOnceMessageV2?.message || quoted?.viewOnceMessage?.message || quoted?.viewOnceMessageV2Extension?.message
            
            // cek apakah reply ke view once
            if (!quoted) {
                return sock.sendMessage(from, { text: '❌ Reply ke foto/video View Once yang mau dibuka!\n\nContoh: reply pesan view once lalu ketik .rvo' }, { quoted: msg })
            }

            const msgToView = quotedViewOnce || quoted

            if (!msgToView) {
                return sock.sendMessage(from, { text: '❌ Itu bukan pesan View Once' }, { quoted: msg })
            }

            const type = Object.keys(msgToView)[0]
            
            if (type !== 'imageMessage' && type !== 'videoMessage' && type !== 'audioMessage') {
                // coba cek view once image/video langsung
                if (!quotedViewOnce) {
                    return sock.sendMessage(from, { text: '❌ Gagal detect view once, pastikan itu pesan view once' }, { quoted: msg })
                }
            }

            await sock.sendMessage(from, { text: '⏳ Membuka view once...' }, { quoted: msg })

            // download media
            const buffer = await downloadMediaMessage(
                { message: msgToView },
                'buffer',
                {},
                { 
                    logger: { level: 'silent' },
                    reuploadRequest: sock.updateMediaMessage
                }
            )

            if (!buffer) {
                return sock.sendMessage(from, { text: '❌ Gagal download media' }, { quoted: msg })
            }

            const finalType = Object.keys(msgToView)[0]
            const caption = msgToView[finalType]?.caption || '✅ View Once dibuka oleh ALYZ BOT'

            if (finalType === 'imageMessage') {
                await sock.sendMessage(from, { image: buffer, caption }, { quoted: msg })
            } else if (finalType === 'videoMessage') {
                await sock.sendMessage(from, { video: buffer, caption }, { quoted: msg })
            } else if (finalType === 'audioMessage') {
                await sock.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4', ptt: msgToView[finalType]?.ptt || false }, { quoted: msg })
            } else {
                await sock.sendMessage(from, { image: buffer, caption }, { quoted: msg })
            }

        } catch (e) {
            console.log('RVO ERROR:', e)
            await sock.sendMessage(from, { text: `❌ Error rvo: ${e.message}` }, { quoted: msg })
        }
    }
}