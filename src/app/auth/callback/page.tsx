// File: app/auth/callback/page.tsx (Next.js 13 app directory)

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthCallbackPage() {
	const router = useRouter();
	const { login } = useAuth();

	useEffect(() => {
		// Parse token from URL query string
		const params = new URLSearchParams(window.location.search);
		const token = params.get('token');

		if (!token) {
			console.error('No token found in callback URL');
			// Optionally redirect to login
			router.replace('/auth');
			return;
		}

		try {
			// Decode payload if needed, or just store token
			// e.g., parse JWT payload
			const [, payload] = token.split('.');
			const decoded = JSON.parse(atob(payload));
			const username = decoded.email || decoded.user_id || null;

			// Persist token in your chosen storage
			// e.g., localStorage or secure cookie
			localStorage.setItem('auth_token', token);

			// Call your AuthProvider login method
			login(token, username, true);

			// Clean up URL to remove token param
			router.replace('/account');
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
