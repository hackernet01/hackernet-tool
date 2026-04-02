// In-memory storage for demo
let approvedUIDs = {
    '123456': {
        uid: '123456',
        name: 'Demo User',
        expiry: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        ip: 'demo',
        approvedAt: new Date().toISOString()
    },
    '513358': {
        uid: '513358',
        name: 'HackerNet',
        expiry: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        ip: '182.189.93.193',
        approvedAt: new Date().toISOString()
    },
    '968842': {
        uid: '968842',
        name: 'HackerNet',
        expiry: new Date(Date.now() + 1*24*60*60*1000).toISOString(),
        ip: '182.189.93.193',
        approvedAt: new Date().toISOString()
    }
};

let pendingRequests = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { type, adminKey } = req.query;
    const ADMIN_KEY = 'hackernet123';
    const isAdmin = (adminKey === ADMIN_KEY);
    
    // Get all UIDs
    if (type === 'all' || !type) {
        const uidsList = Object.values(approvedUIDs).map(u => ({
            uid: u.uid,
            name: u.name,
            ip: u.ip || '-',
            expiry: u.expiry,
            approvedAt: u.approvedAt
        }));
        
        const activeCount = uidsList.filter(u => new Date(u.expiry) > new Date()).length;
        
        return res.status(200).json({ 
            uids: uidsList,
            activeUsers: activeCount,
            totalUsers: uidsList.length,
            pendingRequests: pendingRequests.length
        });
    }
    
    // Get pending requests (admin only)
    if (type === 'pending' && isAdmin) {
        return res.status(200).json({ pending: pendingRequests });
    }
    
    return res.status(200).json({ 
        uids: [],
        activeUsers: 0,
        totalUsers: 0,
        pendingRequests: 0
    });
}
