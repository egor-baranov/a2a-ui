// app/(auth)/login/page.tsx
"use client";

import React from "react";
import AuthForm from "@/components/ui/auth-form";
import {Label} from "@/components/ui/label";
import {useAuth} from "@/providers/AuthProvider";

export default function AccountPage() {
	const {auth, logout} = useAuth();

	return (
		<div className="max-w-md mx-auto pt-16 space-y-8">
			<h2 className="text-xl font-semibold mb-8">
				{'Account'}
			</h2>

			<Label>John Doe</Label>

			<button
				onClick={() => logout()}
				type="submit"
							className="cursor-pointer w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
				Log out
			</button>
		</div>
	);
}
