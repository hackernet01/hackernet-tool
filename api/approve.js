export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { uid, days, name, adminKey } = req.body;
    const ADMIN_KEY = 'hackernet123';
    const url = 'https://rich-dory-74324.upstash.io';
    const token = 'gQAAAAAAASJUAAIncDEzN2E4MTAzZjIwZTA0NmNkODJjNDY0OWQ5OGJhYzlkZnAxNzQzMjQ';
    
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
    
    await fetch(`${url}/set/${uid}`, {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
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
      }
