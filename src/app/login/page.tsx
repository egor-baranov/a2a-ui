"use client";

import React from "react";
import AuthForm from "@/components/ui/auth-form";
import Paywall from "@/components/Paywall";

export default function LoginPage() {
	return (
		<div className="max-w-full mx-auto pt-16">
			<AuthForm />
		</div>
	);
}
