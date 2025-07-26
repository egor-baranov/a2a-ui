import React, { useState } from "react";

export default function AuthForm() {
	const [formType, setFormType] = useState<"login" | "signup">("login");

	const sampleOAuthButton = (provider: "Google" | "Apple") => (
		<button
			type="button"
			className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
			onClick={() => console.log(`Sign in with ${provider}`)}
		>
			<img
				src={`/${provider.toLowerCase()}-icon.svg`}
				alt={provider}
				className="w-5 h-5"
			/>
			Continue with {provider}
		</button>
	);

	return (
		<div className="px-6 pt-6 w-full max-w-md mx-auto">
			<h2 className="text-xl font-semibold mb-4">
				{formType === "login" ? "Login to your account" : "Create a new account"}
			</h2>

			<form className="space-y-4">
				{/* Email */}
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="email">
						Email
					</label>
					<input
						id="email"
						type="email"
						className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
						placeholder="you@example.com"
					/>
				</div>

				{/* Password */}
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="password">
						Password
					</label>
					<input
						id="password"
						type="password"
						className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
						placeholder="••••••••"
					/>
				</div>

				{/* Confirm password (signup only) */}
				{formType === "signup" && (
					<div>
						<label
							className="block text-sm font-medium mb-1"
							htmlFor="confirm-password"
						>
							Confirm Password
						</label>
						<input
							id="confirm-password"
							type="password"
							className="w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
							placeholder="••••••••"
						/>
					</div>
				)}

				{/* Submit button */}
				<button
					type="submit"
					className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition"
				>
					{formType === "login" ? "Log In" : "Sign Up"}
				</button>

				{/* Divider */}
				<div className="flex items-center justify-center my-4 text-sm text-gray-500">
					<span className="w-full border-t"></span>
					<span className="px-4">or</span>
					<span className="w-full border-t"></span>
				</div>

				{/* OAuth buttons */}
				{sampleOAuthButton("Google")}
				{sampleOAuthButton("Apple")}
			</form>

			{/* Toggle between login/signup */}
			<div className="text-center mt-6 text-sm">
				{formType === "login" ? (
					<>
						Don’t have an account?{" "}
						<button
							onClick={() => setFormType("signup")}
							className="text-blue-600 hover:underline font-medium ml-2"
						>
							Create account
						</button>
					</>
				) : (
					<>
						Already have an account?{" "}
						<button
							onClick={() => setFormType("login")}
							className="text-blue-600 hover:underline font-medium ml-2"
						>
							Log in
						</button>
					</>
				)}
			</div>
		</div>
	);
}
