// File: app/auth/callback/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthCallbackPage() {
	const router = useRouter();
	const { login } = useAuth();

	useEffect(() => {
		async function processCallback() {
			const params = new URLSearchParams(window.location.search);
			const token = params.get('token');

			if (!token) {
				console.error('No token found in callback URL');
				router.replace('/auth');
				return;
			}

			try {
				// Decode JWT to get username (optional)
				const [, payload] = token.split('.');
				const decoded = JSON.parse(atob(payload));
				const username = decoded.email || decoded.user_id || '';

				// Persist the token
				localStorage.setItem('auth_token', token);

				// Update React context
				login(token, username, true);

				// Try client-side push
				router.push('/account');

				// If router.push didn’t navigate, fallback to full reload
				if (window.location.pathname !== '/account') {
					window.location.href = '/account';
				}
			} catch (err) {
				console.error('Failed to process auth callback:', err);
				router.replace('/auth');
			}
		}

		processCallback().then();
	}, [login, router]);

	return (
		<div className="flex items-center justify-center h-screen">
			<p className="text-lg">Finalizing login…</p>
		</div>
	);
}
