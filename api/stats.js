// In-memory storage
let approvedUIDs = {
    '123456': { expiry: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
    '513358': { expiry: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
    '968842': { expiry: new Date(Date.now() + 1*24*60*60*1000).toISOString() }
};

let searchLogs = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { type } = req.query;
    
    // Return logs
    if (type === 'logs') {
        return res.status(200).json({ logs: searchLogs });
    }
    
    // Calculate stats
    const activeUsers = Object.values(approvedUIDs).filter(u => new Date(u.expiry) > new Date()).length;
    const totalUsers = Object.keys(approvedUIDs).length;
    const totalSearches = searchLogs.length;
    
    return res.status(200).json({
        activeUsers: activeUsers,
        totalUsers: totalUsers,
        totalSearches: totalSearches,
        pendingRequests: 0
    });
}
