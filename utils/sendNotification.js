// utils/sendNotification.js
import { client, ONESIGNAL_APP_ID } from '../config/onesignal.js';
import * as OneSignal from '@onesignal/node-onesignal';

const sendNotification = async (token, message) => {
    const notification = new OneSignal.Notification();
    notification.app_id = ONESIGNAL_APP_ID;
    notification.include_player_ids = [token];
    notification.contents = {
        en: message
    };

    try {
        const { id } = await client.createNotification(notification);
        console.log('Notification envoyée avec succès, ID:', id);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
    }
};

export default sendNotification;