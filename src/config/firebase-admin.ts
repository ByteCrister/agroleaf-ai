// config/firebase-admin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
    const envKey = process.env.FIREBASE_ADMIN_KEY;
    if (!envKey) {
        throw new Error(
            'FIREBASE_ADMIN_KEY environment variable is not set. ' +
            'Add it to .env.local (development) or your hosting platform (production).'
        );
    }

    try {
        const serviceAccount = JSON.parse(envKey) as admin.ServiceAccount;
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch {
        throw new Error('Failed to parse FIREBASE_ADMIN_KEY as valid JSON.');
    }
}

export const db = admin.firestore();
export const auth = admin.auth();