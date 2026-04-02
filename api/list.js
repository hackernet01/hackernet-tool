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
                const dataRes = await fetch(`${UPSTASH_URL}/get/${key}`, {
                    headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
                });
                const data = await dataRes.json();
                if (data.result) {
                    uids.push(JSON.parse(data.result));
                }
            }
        }
        
        return res.status(200).json({ uids: uids });
    } catch (error) {
        return res.status(200).json({ uids: [] });
    }
}
