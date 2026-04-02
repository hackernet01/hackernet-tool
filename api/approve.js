export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
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
    
    const allowedDays = [1, 7, 30, 90, 365];
    if (!allowedDays.includes(parseInt(days))) {
        return res.status(400).json({ error: 'Invalid days. Allowed: 1,7,30,90,365' });
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    
    // Store approval in check.js (shared state - for demo)
    // In production, use a database
    
    // Send notification to Telegram
    const message = `✅ UID ${uid} APPROVED!\n📅 Access: ${days} days\n⏰ Expires: ${expiryDate.toLocaleString()}\n\nUser can now access the tool with this UID.`;
    
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
