const TelegramBot = require("node-telegram-bot-api");
const crypto = require("crypto");

const BOT_TOKEN = process.env.BOT_TOKEN || "8243126223:AAG4at-Kd7IVa156lPS3bNfnIlEpacVO3Mg";
const CHANNEL_ID = -1003497898639;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "YOUR_PAKASIR_WEBHOOK_SECRET";

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const signature = req.headers['x-pakasir-signature'];
        if (!signature) {
            return res.status(400).json({ error: 'No signature provided' });
        }

        const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
        const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
        
        if (signature !== digest) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const { order_id, status, amount, metadata } = req.body;
        
        if (status !== 'completed') {
            return res.status(200).json({ received: true });
        }
        
        if (!metadata || !metadata.userId) {
            return res.status(200).json({ received: true });
        }
        
        const userId = parseInt(metadata.userId);
        const chatId = userId;
        const totalAmount = parseInt(amount);
        
        await bot.sendMessage(
            userId,
            `✅ *Pembayaran Berhasil!*\n\n🎉 Akses grup 18+ sudah aktif\nKlik link di bawah untuk masuk 👇\n\n🔗 [JOIN GROUP 18+](https://t.me/durovcuyy)`,
            {
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            }
        );

        await bot.sendMessage(
            CHANNEL_ID,
            `🎉 *TRANSAKSI BERHASIL*\n\n👤 *User ID* : ${userId}\n📦 *Produk* : Akses Grup 18+\n💰 *Total* : Rp${totalAmount.toLocaleString("id-ID")}\n🕒 *Waktu* : ${new Date().toLocaleString("id-ID")}`,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[
                        { text: "🛒 BUY NOW", url: "https://t.me/assistantAsupan20_bot" }
                    ]]
                }
            }
        );

        return res.status(200).json({ received: true });
        
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
