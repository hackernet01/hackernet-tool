export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { uid } = req.query;
    
    // Upstash Database Config
    const UPSTASH_URL = 'https://rich-dory-74324.upstash.io';
    const UPSTASH_TOKEN = 'gQAAAAAAASJUAAIncDEzN2E4MTAzZjIwZTA0NmNkODJjNDY0OWQ5OGJhYzlkZnAxNzQzMjQ';
    
    if (!uid || uid.length !== 6) {
        return res.status(200).json({ valid: false, message: 'UID must be 6 digits' });
    }
    
    try {
        const response = await fetch(`${UPSTASH_URL}/get/${uid}`, {
            headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
        });
        const data = await response.json();
        
        if (data.result) {
            const user = JSON.parse(data.result);
            const expiry = new Date(user.expiry);
            const now = new Date();
            
            if (expiry > now) {
                return res.status(200).json({
                    valid: true,
                    uid: uid,
                    name: user.name,
                    expiry: user.expiry,
                    days: user.days
                });
            } else {
                // Delete expired UID
                await fetch(`${UPSTASH_URL}/del/${uid}`, {
                    headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
                });
                return res.status(200).json({ valid: false, message: 'UID Expired' });
            }
        }
        
        return res.status(200).json({ valid: false, message: 'UID not found. Contact admin.' });
    } catch (error) {
        return res.status(200).json({ valid: false, message: 'Database error. Try again.' });
    }
}
