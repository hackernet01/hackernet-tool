let approvedUIDs = {
    '123456': { uid: '123456', name: 'Demo User', expiry: new Date(Date.now() + 30*24*60*60*1000).toISOString(), ip: 'demo' }
};
let pendingRequests = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { type } = req.query;
    
    if (type === 'pending') {
        return res.status(200).json({ pending: pendingRequests });
    }
    
    const uidsList = Object.values(approvedUIDs).map(u => ({
        uid: u.uid,
        name: u.name || 'User',
        ip: u.ip || '-',
        expiry: u.expiry
    }));
    
    return res.status(200).json({ uids: uidsList });
}