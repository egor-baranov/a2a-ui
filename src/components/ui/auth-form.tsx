// File: app/auth/callback/page.tsx (Next.js 13 app directory)

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthCallbackPage() {
	const router = useRouter();
	const { login } = useAuth();

	useEffect(() => {
		// Parse token and state directly from window.location
		const params = new URLSearchParams(window.location.search);
		const token = params.get('token');
		const returnedState = params.get('state');
		const storedState = sessionStorage.getItem('oauth_state');

		// Validate token presence
		if (!token) {
			console.error('No token found in callback URL');
			router.replace('/auth');
			return;
		}

		// Validate OAuth state
		if (!returnedState || returnedState !== storedState) {
			console.error('OAuth state mismatch');
			sessionStorage.removeItem('oauth_state');
			router.replace('/auth');
			return;
		}

		try {
			// Decode JWT payload
			const [, payload] = token.split('.');
			const decoded = JSON.parse(atob(payload));
			const username = decoded.email || decoded.user_id || '';

			// Persist token and clear state
			localStorage.setItem('auth_token', token);
			sessionStorage.removeItem('oauth_state');

			// Update global auth state
			login(token, username, true);

			// Clean URL without reloading
			if (typeof window !== 'undefined') {
				const url = new URL(window.location.href);
				url.search = '';
				window.history.replaceState({}, '', url.toString());
			}

			// Navigate to account
			router.push('/account');
		} catch (err) {
			console.error('Failed to process auth callback:', err);
			router.replace('/auth');
		}
	}, [login, router]);

	return (
		<div className="flex items-center justify-center h-screen">
			<p className="text-lg">Finalizing login…</p>
		</div>
	);
}
