// In-memory storage (Vercel serverless mein kaam karega)
let approvedUIDs = {};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { uid } = req.query;
    const method = req.method;
    
    // GET request - Check UID validity
    if (method === 'GET') {
        if (!uid || uid.length !== 6) {
            return res.status(200).json({ valid: false, reason: 'invalid_format' });
        }
        
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
                // Expired - remove from storage
                delete approvedUIDs[uid];
            }
        }
        
        return res.status(200).json({ valid: false, reason: 'not_found' });
    }
    
    // POST request - Approve new UID (Admin use)
    if (method === 'POST') {
        const { uid, days, name, adminKey } = req.body;
        const ADMIN_KEY = 'hackernet123';
        
        if (adminKey !== ADMIN_KEY) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        if (!uid || !days) {
            return res.status(400).json({ error: 'UID and days required' });
        }
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);
        
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
