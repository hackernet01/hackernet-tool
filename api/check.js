export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { uid } = req.query;
    
    // Upstash Database
    const UPSTASH_URL = 'https://rich-dory-74324.upstash.io';
    const UPSTASH_TOKEN = 'gQAAAAAAASJUAAIncDEzN2E4MTAzZjIwZTA0NmNkODJjNDY0OWQ5OGJhYzlkZnAxNzQzMjQ';
    
    if (!uid || uid.length !== 6) {
        return res.status(200).json({ valid: false, reason: 'Invalid UID format' });
    }
    
    try {
        // Get data from Upstash
        const response = await fetch(`${UPSTASH_URL}/get/${uid}`, {
            headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
        });
        const data = await response.json();
        
        if (data.result) {
            const userData = JSON.parse(data.result);
            const expiryDate = new Date(userData.expiry);
            
            if (expiryDate > new Date()) {
                return res.status(200).json({
                    valid: true,
                    uid: uid,
                    name: userData.name,
                    expiry: userData.expiry,
                    days: userData.days
                });
            } else {
                // Expired - delete it
                await fetch(`${UPSTASH_URL}/del/${uid}`, {
                    headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
                });
                return res.status(200).json({ valid: false, reason: 'UID Expired' });
            }
        }
        
        return res.status(200).json({ valid: false, reason: 'UID not found. Contact admin.' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(200).json({ valid: false, reason: 'Database error' });
    }
            }
