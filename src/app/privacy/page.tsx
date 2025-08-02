// app/(auth)/login/page.tsx
"use client";

import React from "react";
import AuthForm from "@/components/ui/auth-form";
import {Label} from "@/components/ui/label";
import {useAuth} from "@/providers/AuthProvider";

export default function PrivacyPage() {
	const {auth, logout} = useAuth();

	return (
		<div className="max-w-md mx-auto pt-16 space-y-8">
			<h1 className="text-xl font-semibold mb-8">
				{'Privacy'}
			</h1>
		</div>
	);
}
