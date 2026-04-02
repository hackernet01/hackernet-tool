export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { uid, name, email, ip } = req.body;
    const BOT_TOKEN = process.env.BOT_TOKEN || '8201380928:AAHaYoyJeIQyev7WM9DSlkvYi1Gl2zmByDw';
    const ADMIN_ID = process.env.ADMIN_ID || '6552396222';
    
    if (!uid || !name) {
        return res.status(400).json({ error: 'UID and name required' });
    }
    
    const message = `🔔 NEW ACCESS REQUEST!\n\n🆔 UID: ${uid}\n👤 Name: ${name}\n📧 Email: ${email || 'N/A'}\n🌐 IP: ${ip}\n\nGo to Admin Panel to approve this UID.\nAdmin Panel: /admin\nKey: hackernet123`;
    
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: ADMIN_ID, text: message })
        });
        return res.status(200).json({ success: true, uid });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to send notification' });
    }
}
