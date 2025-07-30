import React, {useState} from 'react';
import {GoogleLogin, CredentialResponse, GoogleOAuthProvider} from '@react-oauth/google';
import AppleLogin from "react-apple-login";

const buttonBaseStyle =
	'w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition';

// Wrapper for consistent layout
function OAuthButtonWrapper({children}: { children: React.ReactNode }) {
	return <div className={buttonBaseStyle}>{children}</div>;
}

export default function AuthForm() {
	const [formType, setFormType] = useState<'login' | 'signup'>('login');

	const handleGoogleSuccess = (response: CredentialResponse) => {
		console.log('Google credential:', response.credential);
		// TODO: POST response.credential to your backend
	};

	const handleGoogleError = () => {
		console.error('Google login failed');
	};

	// const handleAppleSignIn = () => {
	//   /* global AppleID */
	//   AppleID.auth.init({
	//     clientId: process.env.REACT_APP_APPLE_CLIENT_ID!,
	//     scope: 'email name',
	//     redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI!,
	//     usePopup: true,
	//   });
	//   AppleID.auth.signIn().then((data: any) => {
	//     console.log('Apple response:', data);
	//     // TODO: POST data.authorization.code to your backend
	//   });
	// };

	return (
		<GoogleOAuthProvider clientId={"400757642320-b8dpifok0n8dn44hakv6gfduka1oo16g.apps.googleusercontent.com"}>
			<div className="px-6 pt-6 w-full max-w-md mx-auto">
				<h2 className="text-xl font-semibold mb-4">
					{formType === 'login' ? 'Login to your account' : 'Create a new account'}
				</h2>

				<form className="space-y-4">
					{/* Email */}
					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
						<input
							id="email"
							type="email"
							className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
							placeholder="you@example.com"
						/>
					</div>

					{/* Password */}
					<div>
						<label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
						<input
							id="password"
							type="password"
							className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
							placeholder="••••••••"
						/>
					</div>

					{/* Confirm password (signup only) */}
					{formType === 'signup' && (
						<div>
							<label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Confirm Password</label>
							<input
								id="confirm-password"
								type="password"
								className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
								placeholder="••••••••"
							/>
						</div>
					)}

					<button type="submit"
									className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition">
						{formType === 'login' ? 'Log In' : 'Sign Up'}
					</button>

					<div className="flex items-center justify-center my-4 text-sm text-gray-500">
						<span className="w-full border-t"></span>
						<span className="px-4">or</span>
						<span className="w-full border-t"></span>
					</div>

					<div style={{ display: 'none' }}>
						<GoogleLogin
							width="100%" // required to remove default width
							theme="outline"
							size="medium"
							text="signin_with"
							shape="rectangular"
							logo_alignment="left"
							onSuccess={() => {}}
							useOneTap={true}
							ux_mode={'popup'}
						/>
					</div>

					<OAuthButtonWrapper>
						<button
							type="button"
							onClick={() => {
								/* global google */
								// google.accounts.id.prompt();
							}}
							className="flex items-center gap-2 w-full justify-center"
						>
							<img src="/google-icon.svg" alt="Google" className="w-5 h-5"/>
							Continue with Google
						</button>
					</OAuthButtonWrapper>

					{/* Apple Login Styled */}
					<OAuthButtonWrapper>
						<button
							type="button"
							onClick={() => {
								/* global AppleID */
								// AppleID.auth.init({
								//   clientId: process.env.REACT_APP_APPLE_CLIENT_ID!,
								//   scope: 'email name',
								//   redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URI!,
								//   usePopup: true,
								// });
								// AppleID.auth.signIn().then((data: any) => {
								//   console.log('Apple response:', data);
								// });
							}}
							className="flex items-center gap-2 w-full justify-center"
						>
							<img src="/apple-icon.svg" alt="Apple" className="w-5 h-5"/>
							Continue with Apple
						</button>
					</OAuthButtonWrapper>

				</form>

				<div className="text-center mt-6 text-sm">
					{formType === 'login' ? (
						<>
							Don’t have an account?{' '}
							<button onClick={() => setFormType('signup')} className="text-blue-600 hover:underline font-medium ml-2">
								Create account
							</button>
						</>
					) : (
						<>
							Already have an account?{' '}
							<button onClick={() => setFormType('login')} className="text-blue-600 hover:underline font-medium ml-2">
								Log in
							</button>
						</>
					)}
				</div>
			</div>
		</GoogleOAuthProvider>
	);
}