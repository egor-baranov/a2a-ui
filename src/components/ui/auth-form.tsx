"use client";

import React, {useState} from 'react';
import {Mail} from "lucide-react";
import {useGoogleLogin, CredentialResponse, GoogleOAuthProvider, GoogleLogin, CodeResponse} from '@react-oauth/google';
import {PinInput} from "@/components/ui/pin-input";
import {useAuth} from "@/providers/AuthProvider";
import {useRouter} from "next/navigation";
import type {components} from "@/types/api-types";
import {initiateXLogin} from "@/utils/xAuth";

const buttonBaseStyle =
	'w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition';

// Wrapper for consistent layout
function OAuthButtonWrapper({children}: { children: React.ReactNode }) {
	return <div className={buttonBaseStyle}>{children}</div>;
}


type EmailVerificationRequest = components["schemas"]["EmailVerificationRequest"];
type AuthResponse = components["schemas"]["AuthResponse"];
type EmailVerificationCodeRequest = components["schemas"]["EmailVerificationCodeRequest"];


export default function AuthForm() {
	const [formState, setFormState] = useState<'base' | 'email' | 'confirm-email'>('base');

	const [email, setEmail] = useState<string>("");
	const [verificationCode, setVerificationCode] = useState<string>("");

	const {login} = useAuth();
	const router = useRouter();

	/**
	 * Step 1: Request the Google OAuth URL and state from backend,
	 * then redirect browser to it.
	 */
	const handleGoogleLogin = async () => {
		try {
			const res = await fetch(
				"https://svgen-backend-production.up.railway.app/auth/google/login",
				{ method: "GET" }
			);
			if (!res.ok) throw new Error(res.statusText);
			const { auth_url, state } = (await res.json()) as {
				auth_url: string;
				state: string;
			};
			sessionStorage.setItem("oauth_state", state);
			window.location.href = auth_url;
		} catch (err) {
			console.error("Could not start Google flow:", err);
		}
	};

	const handleXLogin = async () => {
		try {
			const res = await fetch(
				"https://svgen-backend-production.up.railway.app/auth/twitter/login",
				{ method: "GET" }
			);
			if (!res.ok) throw new Error(res.statusText);
			const { auth_url, state } = (await res.json()) as {
				auth_url: string;
				state: string;
			};
			sessionStorage.setItem("oauth_state", state);
			window.location.href = auth_url;
		} catch (err) {
			console.error("Could not start X flow:", err);
		}
	};


	const handleAppleLogin = () => {
		const params = new URLSearchParams({
			response_type: 'code id_token',
			response_mode: 'form_post',
			client_id: "",
			redirect_uri: "https://google.com",
			scope: 'email name',
			state: Math.random().toString(36).substring(2),
		});
		window.location.href = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
	};

	const handleEmail = async (): Promise<boolean> => {
		const emailText = email.trim();
		if (!emailText) return false;
		try {
			const emailVerificationRequest: EmailVerificationRequest = {
				email: emailText,
			};

			const res = await fetch(
				"https://svgen-backend-production.up.railway.app/auth/send-verification-code",
				{
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(emailVerificationRequest),
				}
			);
			if (!res.ok) throw new Error(`Send email verification code failed, ${(res.status)}`);
			return res.status >= 200 && res.status < 300;
		} catch (e) {
			console.error("Prompt enhancement failed", e);
			return false;
		}
	};

	const handleVerifyEmail = async (): Promise<AuthResponse | null> => {
		const emailText = email.trim();
		const code = verificationCode.trim();
		if (!emailText) return null;
		try {
			const emailVerificationCodeRequest: EmailVerificationCodeRequest = {
				email: emailText,
				code: code
			};

			const res = await fetch(
				"https://svgen-backend-production.up.railway.app/auth/verify-code",
				{
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(emailVerificationCodeRequest),
				}
			);

			if (!res.ok) throw new Error(`Email verification failed: ${res.status} for request ${JSON.stringify(emailVerificationCodeRequest)}`);
			return (await res.json()) as AuthResponse;
		} catch (e) {
			console.error("Prompt enhancement failed", e);
			return null;
		}
	};


	function baseForm() {
		return <div className="px-6 pt-24 w-full max-w-md mx-auto">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
			>
				<div
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
					}}
					className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#FAF59F] to-[#F788D7] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
				/>
			</div>

			<h2 className="text-4xl font-medium pt-24 flex justify-center mb-8">
				{'Log in or Sign up'}
			</h2>

			<form className="space-y-4">
				<OAuthButtonWrapper>
					<button
						type="button"
						onClick={handleGoogleLogin}
						className="flex items-center gap-2 w-full justify-center cursor-pointer"
					>
						<img src="/google-icon.svg" alt="Google" className="w-5 h-5"/>
						Continue with Google
					</button>
				</OAuthButtonWrapper>

				{/* Apple Login Styled */}
				{/*<OAuthButtonWrapper>*/}
				{/*	<button*/}
				{/*		type="button"*/}
				{/*		onClick={() => {*/}
				{/*			handleAppleLogin();*/}
				{/*		}}*/}
				{/*		className="flex items-center gap-2 w-full justify-center cursor-pointer"*/}
				{/*	>*/}
				{/*		<img src="/apple-icon.svg" alt="Apple" className="w-5 h-5"/>*/}
				{/*		Continue with Apple*/}
				{/*	</button>*/}
				{/*</OAuthButtonWrapper>*/}

				<OAuthButtonWrapper>
					<button
						type="button"
						onClick={handleXLogin}
						className="flex items-center gap-2 w-full justify-center cursor-pointer"
					>
						<img src="/x-icon.png" alt="Google" className="w-5 h-5"/>
						Continue with X
					</button>
				</OAuthButtonWrapper>


				<div className="flex items-center justify-center my-4 text-sm text-gray-500">
					<span className="w-full border-t"></span>
					<span className="px-4">or</span>
					<span className="w-full border-t"></span>
				</div>

				<OAuthButtonWrapper>
					<button
						type="button"
						onClick={() => {
							setFormState('email');
						}}
						className="flex items-center gap-2 w-full justify-center cursor-pointer"
					>
						<Mail className="w-5 h-5"/>
						Continue with email
					</button>
				</OAuthButtonWrapper>

			</form>
		</div>
	}

	function emailForm() {
		return <div className="px-6 pt-6 w-full max-w-md mx-auto space-y-6">
			<h2 className="text-xl font-semibold mb-8">
				{'Enter your email'}
			</h2>

			<div>
				{/*<label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>*/}
				<input
					id="email"
					type="email"
					className="w-full px-4 py-2 border rounded-lg bg-white shadow-none focus:outline-none focus:ring focus:ring-blue-200"
					placeholder="Email address"
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>

			<button
				onClick={() => {
					handleEmail().then(e => {
						if (e) {
							setFormState('confirm-email');
						}
					});
				}}
				type="submit"
				className="cursor-pointer w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition">
				Next
			</button>
		</div>
	}

	function verifyEmailForm() {
		return <div className="px-6 pt-6 w-full max-w-md mx-auto space-y-6">
			<h2 className="text-xl font-semibold mb-8">
				{'Enter verification code'}
			</h2>

			<div className={"items-center justify-center width-full"}><PinInput length={6} onComplete={(e) =>
				setVerificationCode(e)
			}/></div>

			<button onClick={
				() => {
					handleVerifyEmail().then(r => {
						if (r) {
							login(r.access_token, r.user.username, true);
							router.push("/account");
						}
					});
				}
			}
							className="cursor-pointer w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition">
				Create account
			</button>
		</div>
	}


	return (
		<GoogleOAuthProvider clientId={"400757642320-b8dpifok0n8dn44hakv6gfduka1oo16g.apps.googleusercontent.com"}>
			{
				formState == 'base' && baseForm()
			}

			{
				formState == 'email' && emailForm()
			}

			{
				formState == 'confirm-email' && verifyEmailForm()
			}
		</GoogleOAuthProvider>
	);
}