// utils/auth/user.ts
import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function createUserIfNotExists(user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}) {
    const userRef = doc(db, "users", user.id);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        await setDoc(userRef, {
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: new Date().toISOString(),
        });
    }
}