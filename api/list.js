export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const url = 'https://rich-dory-74324.upstash.io';
    const token = 'gQAAAAAAASJUAAIncDEzN2E4MTAzZjIwZTA0NmNkODJjNDY0OWQ5OGJhYzlkZnAxNzQzMjQ';
    
    try {
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
                    uids.push(JSON.parse(data.result));
                }
            }
        }
        
        return res.status(200).json({ uids: uids });
    } catch (error) {
        return res.status(200).json({ uids: [] });
    }
}
