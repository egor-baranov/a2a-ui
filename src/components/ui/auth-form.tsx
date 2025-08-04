// File: app/auth/callback/page.tsx (Next.js 13 app directory)

'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { login } = useAuth();

	useEffect(() => {
		const token = searchParams.get('token');
		const returnedState = searchParams.get('state');
		const storedState = sessionStorage.getItem('oauth_state');

		if (!token) {
			console.error('No token found in callback URL');
			router.replace('/auth');
			return;
		}
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

			// Persist token
			localStorage.setItem('auth_token', token);
			sessionStorage.removeItem('oauth_state');

			// Update global auth state
			login(token, username, true);

			// Clean URL
			const url = new URL(window.location.href);
			url.search = '';
			window.history.replaceState({}, '', url.toString());

			// Redirect to account
			router.push('/account');
		} catch (err) {
			console.error('Failed to process auth callback:', err);
			router.replace('/auth');
		}
	}, [login, router, searchParams]);

	return (
		<div className="flex items-center justify-center h-screen">
			<p className="text-lg">Finalizing login…</p>
		</div>
	);
}
