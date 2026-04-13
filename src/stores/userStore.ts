// stores/userStore.ts
import { create } from 'zustand';

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}

/**
 * Zustand store for user authentication state
 * Persists to localStorage so user info survives page refresh (optional)
 */
export const useUserStore = create<UserState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    clearUser: () => set({ user: null, isAuthenticated: false }),
}));