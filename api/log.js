export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { uid, query, type, ip } = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN || '8201380928:AAHaYoyJeIQyev7WM9DSlkvYi1Gl2zmByDw';
    const ADMIN_ID = process.env.ADMIN_ID || '6552396222';
    
    const message = `🔍 SEARCH LOG\n\n🆔 UID: ${uid}\n🔎 Query: ${query}\n📱 Type: ${type}\n🌐 IP: ${ip}\n⏰ Time: ${new Date().toLocaleString()}`;
    
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: ADMIN_ID, text: message })
        });
    } catch(e) {
        console.error('Telegram error:', e);
    }
    
    return res.status(200).json({ success: true });
}
