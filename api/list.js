export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const UPSTASH_URL = 'https://rich-dory-74324.upstash.io';
    const UPSTASH_TOKEN = 'gQAAAAAAASJUAAIncDEzN2E4MTAzZjIwZTA0NmNkODJjNDY0OWQ5OGJhYzlkZnAxNzQzMjQ';
    
    try {
        // Get all keys
        const keysRes = await fetch(`${UPSTASH_URL}/keys/*`, {
            headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
        });
        const keys = await keysRes.json();
        
        const uids = [];
        
        if (keys.result && keys.result.length > 0) {
            for (const key of keys.result) {
                try {
                    const dataRes = await fetch(`${UPSTASH_URL}/get/${key}`, {
                        headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
                    });
                    const data = await dataRes.json();
                    
                    if (data.result) {
                        const userData = JSON.parse(data.result);
                        // Validate expiry date
                        if (userData.expiry) {
                            uids.push({
                                uid: userData.uid,
                                name: userData.name,
                                days: userData.days,
                                expiry: userData.expiry,
                                approvedAt: userData.approvedAt
                            });
                        }
                    }
                } catch (err) {
                    console.error('Error parsing key:', key, err);
                }
            }
        }
        
        // Sort by expiry date (newest first)
        uids.sort((a, b) => new Date(b.expiry) - new Date(a.expiry));
        
        return res.status(200).json({ uids: uids });
    } catch (error) {
        console.error('List error:', error);
        return res.status(200).json({ uids: [] });
    }
}
