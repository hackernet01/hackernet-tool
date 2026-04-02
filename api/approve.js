export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { uid, days, name, adminKey } = req.body;
    
    if (adminKey !== 'hackernet123') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!uid || uid.length !== 6) {
        return res.status(400).json({ error: 'Invalid UID' });
    }
    
    const UPSTASH_URL = 'https://rich-dory-74324.upstash.io';
    const UPSTASH_TOKEN = 'gQAAAAAAASJUAAIncDEzN2E4MTAzZjIwZTA0NmNkODJjNDY0OWQ5OGJhYzlkZnAxNzQzMjQ';
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));
    
    const userData = {
        uid: uid,
        name: name || 'User',
        days: parseInt(days),
        expiry: expiryDate.toISOString(),
        approvedAt: new Date().toISOString()
    };
    
    console.log('Approving UID:', uid);
    console.log('Expiry Date:', expiryDate.toISOString());
    
    try {
        await fetch(`${UPSTASH_URL}/set/${uid}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${UPSTASH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSON.stringify(userData))
        });
        
        return res.status(200).json({
            success: true,
            uid: uid,
            days: days,
            expiry: expiryDate.toISOString()
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Failed to save' });
    }
            }
