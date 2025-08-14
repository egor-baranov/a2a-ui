// File: app/auth/callback/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

type JwtPayload = {
	email?: string;
	user_id?: string;
	[key: string]: any;
};

function base64UrlToBase64(input: string) {
	// convert from base64url to base64
	let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
	// pad with '=' to make length a multiple of 4
	const pad = base64.length % 4;
	if (pad) base64 += '='.repeat(4 - pad);
	return base64;
}

function safeDecodeJwtPayload(token: string): JwtPayload | null {
	try {
		const parts = token.split('.');
		if (parts.length < 2) return null;
		const payloadB64Url = parts[1];
		const payloadBase64 = base64UrlToBase64(payloadB64Url);
		// atob can still throw for malformed input; wrap in try/catch
		const json = atob(payloadBase64);
		return JSON.parse(json) as JwtPayload;
	} catch (err) {
		console.error('safeDecodeJwtPayload error', err);
		return null;
	}
}

export default function AuthCallbackPage() {
	const router = useRouter();
	const { login } = useAuth();

	useEffect(() => {
		// don't run multiple times in the same tab
		const RUN_ONCE_KEY = 'auth_callback_processed_v1';

		async function processCallback() {
			try {
				// guard: only run once per tab/session
				if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(RUN_ONCE_KEY)) {
					console.log('Callback already processed in this session — skipping.');
					return;
				}
				if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(RUN_ONCE_KEY, '1');

				const params = new URLSearchParams(window.location.search);
				const token = params.get('token');

				if (!token) {
					console.warn('No token found in callback URL; redirecting to /auth');
					router.replace('/auth');
					return;
				}

				// decode payload robustly
				const decoded = safeDecodeJwtPayload(token);
				if (!decoded) {
					console.error('Failed to decode JWT payload; redirecting to /auth');
					router.replace('/auth');
					return;
				}

				const username = decoded.email || decoded.user_id || '';

				// Persist the token (you already used localStorage previously)
				try {
					localStorage.setItem('auth_token', token);
				} catch (err) {
					console.warn('Failed to write token to localStorage', err);
				}

				// Update React context (login may be sync or async depending on implementation)
				try {
					login(token, username, true);
				} catch (err) {
					console.error('login() threw an error:', err);
					// proceed — the user may still be redirected and rehydrate after route change
				}

				// Remove the token from the URL so reloads won't re-run processing
				try {
					const url = new URL(window.location.href);
					url.searchParams.delete('token');
					// Replace history with the same path but without the token param.
					// This prevents accidental reprocessing on reload.
					history.replaceState(null, '', url.pathname + url.search + url.hash);
				} catch (err) {
					console.warn('Failed to clean token from URL', err);
				}

				// Perform a single, deterministic navigation to /account.
				// Use router.replace (SPA navigation). If SPA navigation fails to land
				// on /account after a short timeout, fallback to a hard navigation.
				try {
					router.replace('/account');

					// small micro-check: if after a short delay we're not on /account, do a hard replace.
					// This helps on platforms where router.replace may silently fail.
					setTimeout(() => {
						try {
							if (window.location.pathname !== '/account') {
								// prefer location.replace (doesn't create a history entry)
								window.location.replace('/account');
							}
						} catch (err) {
							console.warn('Fallback hard navigation failed', err);
						}
					}, 600); // 600ms is arbitrary but short
				} catch (err) {
					console.warn('router.replace failed, falling back to location.replace', err);
					window.location.replace('/account');
				}
			} catch (err) {
				console.error('Unexpected error in processCallback:', err);
				try {
					router.replace('/auth');
				} catch (_) {
					window.location.replace('/auth');
				}
			}
		}

		// call it (no `.then()` chaining needed)
		if (typeof window !== 'undefined') processCallback();
		// we intentionally don't include RUN_ONCE_KEY in the dependency array
		// so that the effect runs once on mount
	}, [login, router]);

	return (
		<div className="flex items-center justify-center h-screen">
			<p className="text-lg">Finalizing login…</p>
		</div>
	);
}
