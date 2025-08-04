// app/(auth)/login/page.tsx
"use client";

import React from "react";
import AuthForm from "@/components/ui/auth-form";
import {Label} from "@/components/ui/label";
import {useAuth} from "@/providers/AuthProvider";
import Paywall from "@/components/Paywall";

export default function PrivacyPage() {
	const {auth, logout} = useAuth();

	return (
		<div className="max-w-5xl mx-auto space-y-8">
			<Paywall/>
		</div>
	);
}
