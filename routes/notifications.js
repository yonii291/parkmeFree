// routes/notifications.js
import express from 'express';
import sendNotification from '../utils/sendNotification.js';

const router = express.Router();

router.post('/send', async (req, res) => {
    const { token, message } = req.body;

    if (!token || !message) {
        return res.status(400).json({ error: 'Token and message are required' });
    }

    try {
        await sendNotification(token, message);
        res.status(200).json({ success: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;