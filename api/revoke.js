export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { uid, adminKey } = req.body;
    const ADMIN_KEY = process.env.ADMIN_KEY || 'byhackernet0101';
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    const BOT_TOKEN = process.env.BOT_TOKEN || '8201380928:AAHaYoyJeIQyev7WM9DSlkvYi1Gl2zmByDw';
    const ADMIN_ID = process.env.ADMIN_ID || '6552396222';
    
    if (adminKey !== ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Delete from Redis
    await fetch(`${url}/del/${uid}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // Send notification
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: ADMIN_ID, text: `❌ UID ${uid} has been REVOKED! User can no longer access.` })
        });
    } catch(e) {}
    
    return res.status(200).json({ success: true });
}
