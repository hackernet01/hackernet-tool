let searchLogs = [];
let approvedUIDs = {};
let pendingRequests = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { type } = req.query;
    
    if (type === 'logs') {
        return res.status(200).json({ logs: searchLogs });
    }
    
    const activeUsers = Object.values(approvedUIDs).filter(u => new Date(u.expiry) > new Date()).length;
    const totalUsers = Object.keys(approvedUIDs).length;
    const totalSearches = searchLogs.length;
    
    return res.status(200).json({
        activeUsers,
        totalUsers,
        totalSearches,
        pendingRequests: pendingRequests.length
    });
}