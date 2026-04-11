'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/stores/userStore';

/**
 * This component syncs NextAuth session with Zustand store.
 * Place it inside your SessionProvider (e.g., in a client layout).
 */
export function SessionSync() {
    const { data: session, status } = useSession();
    const { setUser, clearUser } = useUserStore();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setUser({
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
            });
        } else if (status === 'unauthenticated') {
            clearUser();
        }
    }, [session, status, setUser, clearUser]);

    return null; // This component doesn't render anything
}