let approvedUIDs = {};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { uid, adminKey } = req.body;
    const ADMIN_KEY = 'hackernet123';
    
    if (adminKey !== ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    delete approvedUIDs[uid];
    
    return res.status(200).json({ success: true });
}