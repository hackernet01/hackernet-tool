export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { uid } = req.query;
    
    const UPSTASH_URL = 'https://rich-dory-74324.upstash.io';
    const UPSTASH_TOKEN = 'gQAAAAAAASJUAAIncDEzN2E4MTAzZjIwZTA0NmNkODJjNDY0OWQ5OGJhYzlkZnAxNzQzMjQ';
    
    if (!uid || uid.length !== 6) {
        return res.status(200).json({ valid: false, reason: 'Invalid UID format' });
    }
    
    try {
        const response = await fetch(`${UPSTASH_URL}/get/${uid}`, {
            headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
        });
        const data = await response.json();
        
        if (data.result) {
            const userData = JSON.parse(data.result);
            const expiryDate = new Date(userData.expiry);
            const now = new Date();
            
            console.log('Checking UID:', uid);
            console.log('Expiry:', expiryDate);
            console.log('Now:', now);
            
            if (expiryDate > now) {
                return res.status(200).json({
                    valid: true,
                    uid: uid,
                    name: userData.name,
                    expiry: userData.expiry,
                    days: userData.days
                });
            } else {
                // Delete expired UID
                await fetch(`${UPSTASH_URL}/del/${uid}`, {
                    headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
                });
                return res.status(200).json({ valid: false, reason: 'UID Expired' });
            }
        }
        
        return res.status(200).json({ valid: false, reason: 'UID not found' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(200).json({ valid: false, reason: 'Database error' });
    }
}
