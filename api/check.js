export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { uid } = req.query;
    const url = 'https://rich-dory-74324.upstash.io';
    const token = 'gQAAAAAAASJUAAIncDEzN2E4MTAzZjIwZTA0NmNkODJjNDY0OWQ5OGJhYzlkZnAxNzQzMjQ';
    
    if (!uid || uid.length !== 6) {
        return res.status(200).json({ valid: false, reason: 'invalid_format' });
    }
    
    try {
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
            }
        }
        
        return res.status(200).json({ valid: false, reason: 'not_found' });
    } catch (error) {
        return res.status(200).json({ valid: false, reason: 'error' });
    }
}
