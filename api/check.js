const DATA = {};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { uid } = req.query;
    
    if (!uid || uid.length !== 6) {
        return res.status(200).json({ valid: false, reason: 'invalid_format' });
    }
    
    // Demo approved UIDs for testing
    const approvedUIDs = {
        '123456': { expiry: new Date(Date.now() + 30*24*60*60*1000).toISOString(), name: 'Demo User' }
    };
    
    // Check if UID starts with 1 (for testing)
    if (uid.startsWith('1')) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        return res.status(200).json({ valid: true, expiry: expiryDate.toISOString(), name: 'Verified User' });
    }
    
    if (approvedUIDs[uid]) {
        const expiryDate = new Date(approvedUIDs[uid].expiry);
        if (expiryDate > new Date()) {
            return res.status(200).json({ valid: true, expiry: approvedUIDs[uid].expiry, name: approvedUIDs[uid].name });
        }
    }
    
    return res.status(200).json({ valid: false, reason: 'not_found' });
}