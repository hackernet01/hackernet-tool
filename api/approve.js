export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { uid, days, name, adminKey } = req.body;
    const ADMIN_KEY = process.env.ADMIN_KEY || 'hackernet123';
    const BOT_TOKEN = process.env.BOT_TOKEN || '8201380928:AAHaYoyJeIQyev7WM9DSlkvYi1Gl2zmByDw';
    const ADMIN_ID = process.env.ADMIN_ID || '6552396222';
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (adminKey !== ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!uid || !days) {
        return res.status(400).json({ error: 'UID and days required' });
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    
    const userData = {
        uid: uid,
        name: name || 'User',
        days: parseInt(days),
        expiry: expiryDate.toISOString(),
        approvedAt: new Date().toISOString()
    };
    
    // Save to Redis
    await fetch(`${url}/set/${uid}`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(JSON.stringify(userData))
    });
    
    // Send Telegram notification
    const message = `✅ UID ${uid} APPROVED!\n👤 Name: ${userData.name}\n📅 Access: ${days} days\n⏰ Expires: ${expiryDate.toLocaleString()}\n\nUser can now access the tool.`;
    
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: ADMIN_ID, text: message })
        });
    } catch(e) {
        console.error('Telegram error:', e);
    }
    
    return res.status(200).json({ 
        success: true, 
        uid: uid, 
        days: days, 
        expiry: expiryDate.toISOString() 
    });
}
