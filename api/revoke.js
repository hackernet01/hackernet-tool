export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { uid, adminKey } = req.body;
    
    if (adminKey !== 'hackernet123') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const UPSTASH_URL = 'https://rich-dory-74324.upstash.io';
    const UPSTASH_TOKEN = 'gQAAAAAAASJUAAIncDEzN2E4MTAzZjIwZTA0NmNkODJjNDY0OWQ5OGJhYzlkZnAxNzQzMjQ';
    
    await fetch(`${UPSTASH_URL}/del/${uid}`, {
        headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
    });
    
    return res.status(200).json({ success: true });
}
