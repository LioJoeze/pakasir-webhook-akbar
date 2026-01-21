const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = "8243126223:AAG4at-Kd7IVa156lPS3bNfnIlEpacVO3Mg";
const CHANNEL_ID = -1003497898639;

const bot = new TelegramBot(BOT_TOKEN, { polling: false });

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { order_id, status, amount } = req.body;

        if (!order_id || !status) {
            return res.json({ ok: true });
        }

        if (status !== "completed") {
            return res.json({ ok: true });
        }

        let userId = null;

        const parts = order_id.split("_");
        if (parts.length >= 2) {
            userId = parseInt(parts[1]);
        }

        if (!userId || isNaN(userId)) {
            return res.json({ ok: true });
        }

        const totalAmount = parseInt(amount || 0);

        await bot.sendMessage(
            userId,
            `✅ *Pembayaran Berhasil!*\n\n🎉 Akses grup 18+ sudah aktif\nKlik link di bawah untuk masuk 👇\n\n🔗 [JOIN GROUP 18+](https://t.me/durovcuyy)`,
            {
                parse_mode: "Markdown",
                disable_web_page_preview: true
            }
        );

        await bot.sendMessage(
            CHANNEL_ID,
            `🎉 *TRANSAKSI BERHASIL*\n\n👤 *User ID* : ${userId}\n📦 *Produk* : Akses Grup 18+\n💰 *Total* : Rp${totalAmount.toLocaleString("id-ID")}\n🕒 *Waktu* : ${new Date().toLocaleString("id-ID")}`,
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [[
                        { text: "🛒 BUY NOW", url: "https://t.me/assistantAsupan20_bot" }
                    ]]
                }
            }
        );

        return res.json({ success: true });

    } catch (err) {
        console.log("Webhook error:", err);
        return res.status(500).json({ error: "error" });
    }
};
