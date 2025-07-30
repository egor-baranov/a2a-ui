import React from "react";
import AuthForm from "@/components/ui/auth-form";
import Paywall from "@/components/Paywall";

export default function LoginTab() {
	return (
		<div className="max-w-full mx-auto">
			<AuthForm />

			<Paywall/>
		</div>
	);
}
