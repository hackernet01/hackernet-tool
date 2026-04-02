let approvedUIDs = {};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { uid, days, adminKey } = req.body;
    const ADMIN_KEY = 'hackernet123';
    const BOT_TOKEN = '8201380928:AAHaYoyJeIQyev7WM9DSlkvYi1Gl2zmByDw';
    const ADMIN_ID = '6552396222';
    
    if (adminKey !== ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!uid || !days) {
        return res.status(400).json({ error: 'UID and days required' });
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    approvedUIDs[uid] = {
        uid, days, expiry: expiryDate.toISOString(),
        approvedAt: new Date().toISOString()
    };
    
    // Send confirmation to admin
    const message = `✅ UID ${uid} APPROVED!\n📅 Access: ${days} days\n⏰ Expires: ${expiryDate.toLocaleString()}`;
    
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: ADMIN_ID, text: message })
    });
    
    return res.status(200).json({ success: true, uid, days, expiry: expiryDate.toISOString() });
      }
