// components/SignInDialog.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Leaf, ArrowLeft } from 'lucide-react';
import { inter } from '@/fonts/google-fonts';

type Flow = 'signin' | 'forgot-email' | 'forgot-otp' | 'create-or-signin';

export default function SignInDialog() {
    const [open, setOpen] = useState(false);
    const [flow, setFlow] = useState<Flow>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const resetState = () => {
        setFlow('signin');
        setEmail('');
        setPassword('');
        setOtp('');
        setNewPassword('');
        setError('');
        setLoading(false);
    };

    const handleClose = () => {
        resetState();
        setOpen(false);
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset state only when dialog closes
            resetState();
        }
    };

    // Regular sign-in: first check if user exists
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Step 1: Verify credentials with the API
            const res = await fetch('/api/auth/create-or-signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            if (!data.valid) throw new Error('Invalid credentials');

            // Step 2: Credentials are valid – sign in with NextAuth
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            if (result?.error) throw new Error(result.error);

            handleClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 1: Forgot password - check email existence and send OTP
    const handleForgotSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/forgot-password/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setFlow('forgot-otp');
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🔍 Reset attempt:', { email, otp, newPassword });

        if (!email || !otp || !newPassword) {
            setError('Missing information. Please start over.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const text = await res.text();
            console.log('📄 Response text:', text);
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(`Invalid JSON: ${text}`);
            }
            if (!res.ok) throw new Error(data.error);
            setFlow('signin');
            setError('Password updated! You can now sign in.');
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    // Create or sign in with email (no password, no magic link)
    const handleCreateOrSignIn = async () => {
        if (!email) {
            setError('Please enter your email first');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // This uses the custom email-signin provider
            const result = await signIn('email-signin', { email, redirect: false });
            if (result?.error) {
                throw new Error(result.error);
            }
            handleClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Render different forms based on flow
    const renderForm = () => {
        switch (flow) {
            case 'signin':
                return (
                    <form onSubmit={handleSignIn} className="space-y-5 mt-2">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="h-4 w-4" /> Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => setFlow('forgot-email')}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full gap-2"
                            onClick={handleCreateOrSignIn}
                            disabled={loading}
                        >
                            <Mail className="h-4 w-4" /> Create or Sign In with Email
                        </Button>
                    </form>
                );

            case 'forgot-email':
                return (
                    <form onSubmit={handleForgotSendOTP} className="space-y-5 mt-2">
                        <div className="space-y-2">
                            <Label htmlFor="reset-email">Email address</Label>
                            <Input
                                id="reset-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your@email.com"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Send Reset Code'}
                        </Button>
                        <button
                            type="button"
                            onClick={() => setFlow('signin')}
                            className="text-sm text-primary hover:underline flex items-center gap-1 mx-auto"
                        >
                            <ArrowLeft className="h-3 w-3" /> Back to sign in
                        </button>
                    </form>
                );

            case 'forgot-otp':
                return (
                    <form onSubmit={handleResetPassword} className="space-y-5 mt-2">
                        <div className="space-y-2">
                            <Label htmlFor="otp">Verification Code</Label>
                            <Input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="6-digit code"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Reset Password'}
                        </Button>
                        <button
                            type="button"
                            onClick={() => setFlow('forgot-email')}
                            className="text-sm text-primary hover:underline"
                        >
                            ← Back
                        </button>
                    </form>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default" className="shadow-md hover:shadow-lg transition-all">
                    Sign In
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Leaf className="h-6 w-6 text-primary" />
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            {flow === 'signin' && 'Welcome Back'}
                            {flow === 'forgot-email' && 'Reset Password'}
                            {flow === 'forgot-otp' && 'Verify Code'}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}
                {renderForm()}
                <p className="text-center text-xs text-muted-foreground mt-4">
                    By signing in, you agree to our Terms & Privacy Policy.
                </p>
            </DialogContent>
        </Dialog>
    );
}