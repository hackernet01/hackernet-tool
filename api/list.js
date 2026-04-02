export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    try {
        // Get all keys
        const keysRes = await fetch(`${url}/keys/*`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const keys = await keysRes.json();
        
        const uids = [];
        if (keys.result && keys.result.length > 0) {
            for (const key of keys.result) {
                const dataRes = await fetch(`${url}/get/${key}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await dataRes.json();
                if (data.result) {
                    const userData = JSON.parse(data.result);
                    uids.push(userData);
                }
            }
        }
        
        const activeCount = uids.filter(u => new Date(u.expiry) > new Date()).length;
        
        return res.status(200).json({
            uids: uids,
            activeUsers: activeCount,
            totalUsers: uids.length,
            pendingRequests: 0
        });
    } catch (error) {
        console.error('List error:', error);
        return res.status(200).json({
            uids: [],
            activeUsers: 0,
            totalUsers: 0,
            pendingRequests: 0
        });
    }
}
