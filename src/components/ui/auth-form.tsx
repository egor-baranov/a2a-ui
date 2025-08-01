"use client";

import React, {useState} from 'react';
import {Mail} from "lucide-react";
import {useGoogleLogin, CredentialResponse, GoogleOAuthProvider, GoogleLogin, CodeResponse} from '@react-oauth/google';
import {PinInput} from "@/components/ui/pin-input";
import {useAuth} from "@/providers/AuthProvider";
import {useRouter} from "next/navigation";
import type {components} from "@/types/api-types";

const buttonBaseStyle =
	'w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition';

// Wrapper for consistent layout
function OAuthButtonWrapper({children}: { children: React.ReactNode }) {
	return <div className={buttonBaseStyle}>{children}</div>;
}


type EmailVerificationRequest = components["schemas"]["EmailVerificationRequest"];
type EmailVerificationResponse = components["schemas"]["EmailVerificationResponse"];
type EmailVerificationCodeRequest = components["schemas"]["EmailVerificationCodeRequest"];


export default function AuthForm() {
	const [formType, setFormType] = useState<'login' | 'signup'>('login');
	const [formState, setFormState] = useState<'base' | 'email' | 'confirm-email' | 'username'>('base');

	const [email, setEmail] = useState<string>("");
	const [verificationCode, setVerificationCode] = useState<string>("");

	const {login} = useAuth();
	const router = useRouter();

	const handleGoogleSuccess = (response: CredentialResponse) => {
		console.log('Google credential:', response.credential);
		// TODO: POST response.credential to your backend
	};

	const handleGoogleError = () => {
		console.error('Google login failed');
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

	const handleEmail = async () => {
		const email = "".trim();
		if (!email) return;
		try {
			const emailVerificationRequest: EmailVerificationRequest = {
				email: email,
			};

			const res = await fetch(
				"https://svgen-backend-production.up.railway.app/v1/enhance-prompt",
				{
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(emailVerificationRequest),
				}
			);
			if (!res.ok) throw new Error("Enhance request failed");

			const {message, success} = (await res.json()) as EmailVerificationResponse;
		} catch (e) {
			console.error("Prompt enhancement failed", e);
		}
	};

	const handleVerifyEmail = async () => {
		const email = "".trim();
		const code = verificationCode.trim();
		if (!email) return;
		try {
			const emailVerificationCodeRequest: EmailVerificationCodeRequest = {
				email: email,
				code: code
			};

			const res = await fetch(
				"https://svgen-backend-production.up.railway.app/v1/enhance-prompt",
				{
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify(emailVerificationCodeRequest),
				}
			);
			if (!res.ok) throw new Error("Enhance request failed");

			const {message, success} = (await res.json()) as EmailVerificationResponse;
		} catch (e) {
			console.error("Prompt enhancement failed", e);
		}
	};


	function baseForm() {
		return <div className="px-6 pt-6 w-full max-w-md mx-auto">
			<h2 className="text-xl font-semibold mb-8">
				{'Log in or Sign up'}
			</h2>

			<form className="space-y-4">
				<OAuthButtonWrapper>
					<button
						type="button"
						onClick={() => {
							useGoogleLogin({
								onSuccess: (codeResponse: CodeResponse) => {
									console.log('Google auth code:', codeResponse.code);
									// TODO: POST codeResponse.code to your backend
								},
								onError: () => console.error('Google login failed'),
								flow: 'auth-code',  // use auth-code for redirect to consent screen
							});
						}}
						className="flex items-center gap-2 w-full justify-center cursor-pointer"
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
							handleAppleLogin();
						}}
						className="flex items-center gap-2 w-full justify-center cursor-pointer"
					>
						<img src="/apple-icon.svg" alt="Apple" className="w-5 h-5"/>
						Continue with Apple
					</button>
				</OAuthButtonWrapper>

				<OAuthButtonWrapper>
					<button
						type="button"
						onClick={() => {
							useGoogleLogin({
								onSuccess: (codeResponse: CodeResponse) => {
									console.log('Google auth code:', codeResponse.code);
									// TODO: POST codeResponse.code to your backend
								},
								onError: () => console.error('Google login failed'),
								flow: 'auth-code',  // use auth-code for redirect to consent screen
							});
						}}
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
		return <div className="px-6 pt-6 w-full max-w-md mx-auto">
			<h2 className="text-xl font-semibold mb-8">
				{'Enter your email'}
			</h2>

			<form className="space-y-4" onSubmit={() => {
				login("token", "John Doe", true);
				router.push("/account");
			}}>
				{/* Email */}
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

				{/* Code */}
				{formState == 'email' &&
            <div className={"items-center justify-center width-full"}><PinInput length={6} onComplete={(e) =>
							setVerificationCode(e)
						}/></div>}

				<button type="submit"
								className="cursor-pointer w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition">
					Create account
				</button>
			</form>
		</div>
	}

	return (
		<GoogleOAuthProvider clientId={"400757642320-b8dpifok0n8dn44hakv6gfduka1oo16g.apps.googleusercontent.com"}>
			{
				formState == 'base' && baseForm()
			}

			{
				(formState == 'email' || formState == 'confirm-email') && emailForm()
			}
		</GoogleOAuthProvider>
	);
}