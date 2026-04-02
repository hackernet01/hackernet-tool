export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { uid, name, ip } = req.body;
    const BOT_TOKEN = '8201380928:AAHaYoyJeIQyev7WM9DSlkvYi1Gl2zmByDw';
    const ADMIN_ID = '6552396222';
    
    if (!uid || !name) {
        return res.status(400).json({ error: 'UID and name required' });
    }
    
    const message = `🔔 NEW ACCESS REQUEST!\n\n🆔 UID: ${uid}\n👤 Name: ${name}\n🌐 IP: ${ip}\n\nTo approve, use Admin Panel or send: /approve ${uid} 30`;
    
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