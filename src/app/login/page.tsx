// app/(auth)/login/page.tsx
"use client";

import React from "react";
import AuthForm from "@/components/ui/auth-form";

export default function LoginPage() {
	return (
		<div className="max-w-md mx-auto pt-16 space-y-8">
			<AuthForm />
		</div>
	);
}
