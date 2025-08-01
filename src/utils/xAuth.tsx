// utils/xAuth.ts
/**
 * Generates a random URL-safe string for PKCE verifier/challenge.
 */
async function generatePkcePair(): Promise<{ verifier: string; challenge: string }> {
	// 1) generate random verifier
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	const verifier = btoa(String.fromCharCode(...array))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");

	// 2) SHA-256 and base64-url encode for challenge
	const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
	const hashArray = Array.from(new Uint8Array(hash));
	const challenge = btoa(String.fromCharCode(...hashArray))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");

	return { verifier, challenge };
}

/**
 * Call this to start the X OAuth login flow.
 * It will:
 *   • generate a PKCE pair,
 *   • stash the verifier in sessionStorage for your callback to read,
 *   • redirect the browser to X’s /authorize endpoint.
 */
export async function initiateXLogin() {
	const { verifier, challenge } = await generatePkcePair();
	sessionStorage.setItem("x_pkce_verifier", verifier);

	const params = new URLSearchParams({
		response_type: "code",
		client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,          // ← set in your .env
		redirect_uri: `${window.location.origin}/api/auth/x/callback`,  // ← your callback route
		scope: "users.read tweet.read email",                           // adjust scopes as needed
		state: Math.random().toString(36).substring(2),
		code_challenge: challenge,
		code_challenge_method: "S256",
	});

	window.location.href = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
}
