// Complete working check.js
let approvedUIDs = {};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { uid } = req.query;
    
    // GET request - Check UID validity
    if (req.method === 'GET') {
        if (!uid || uid.length !== 6) {
            return res.status(200).json({ valid: false, reason: 'invalid_format' });
        }
        
        console.log('Checking UID:', uid);
        console.log('Approved UIDs:', approvedUIDs);
        
        // Check if UID is approved
        if (approvedUIDs[uid]) {
            const expiryDate = new Date(approvedUIDs[uid].expiry);
            if (expiryDate > new Date()) {
                return res.status(200).json({ 
                    valid: true, 
                    expiry: approvedUIDs[uid].expiry, 
                    name: approvedUIDs[uid].name 
                });
            } else {
                delete approvedUIDs[uid];
            }
        }
        
        return res.status(200).json({ valid: false, reason: 'not_found' });
    }
    
    // POST request - Approve new UID
    if (req.method === 'POST') {
        const { uid, days, name, adminKey } = req.body;
        const ADMIN_KEY = 'byhackernet0101';
        
        if (adminKey !== ADMIN_KEY) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        if (!uid || !days) {
            return res.status(400).json({ error: 'UID and days required' });
        }
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(days));
        
        approvedUIDs[uid] = {
            uid: uid,
            name: name || 'User',
            expiry: expiryDate.toISOString(),
            approvedAt: new Date().toISOString()
        };
        
        return res.status(200).json({ 
            success: true, 
            uid: uid, 
            days: days, 
            expiry: expiryDate.toISOString() 
        });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
