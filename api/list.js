// In-memory storage
let approvedUIDs = {
    '123456': {
        uid: '123456',
        name: 'Demo User',
        expiry: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        approvedAt: new Date().toISOString()
    }
};
let pendingRequests = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { type, adminKey } = req.query;
    const ADMIN_KEY = 'hackernet123';
    
    // Admin verification for sensitive data
    const isAdmin = (adminKey === ADMIN_KEY);
    
    if (type === 'pending' && isAdmin) {
        return res.status(200).json({ pending: pendingRequests });
    }
    
    if (type === 'all' && isAdmin) {
        const uidsList = Object.values(approvedUIDs).map(u => ({
            uid: u.uid,
            name: u.name,
            expiry: u.expiry,
            approvedAt: u.approvedAt
        }));
        return res.status(200).json({ uids: uidsList, pending: pendingRequests });
    }
    
    // Public endpoint - only show non-expired UIDs count
    const activeCount = Object.values(approvedUIDs).filter(u => new Date(u.expiry) > new Date()).length;
    
    return res.status(200).json({ 
        activeUsers: activeCount,
        totalUsers: Object.keys(approvedUIDs).length 
    });
}
