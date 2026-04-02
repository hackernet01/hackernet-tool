export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { uid } = req.query;
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!uid || uid.length !== 6) {
        return res.status(200).json({ valid: false, reason: 'invalid_format' });
    }
    
    try {
        // Fetch from Redis
        const response = await fetch(`${url}/get/${uid}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.result) {
            const userData = JSON.parse(data.result);
            const expiryDate = new Date(userData.expiry);
            
            if (expiryDate > new Date()) {
                return res.status(200).json({
                    valid: true,
                    expiry: userData.expiry,
                    name: userData.name,
                    days: userData.days
                });
            } else {
                // Expired - delete from Redis
                await fetch(`${url}/del/${uid}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                return res.status(200).json({ valid: false, reason: 'expired' });
            }
        }
        
        return res.status(200).json({ valid: false, reason: 'not_found' });
    } catch (error) {
        console.error('Redis error:', error);
        return res.status(200).json({ valid: false, reason: 'error' });
    }
}
