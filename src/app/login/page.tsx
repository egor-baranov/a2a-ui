// app/(auth)/login/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { loadStripe, Stripe, PaymentRequest } from "@stripe/stripe-js";
import {
	Elements,
	CardElement,
	useStripe,
	PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import AuthForm from "@/components/ui/auth-form";

// Replace with your real publishable key
const stripePromise = loadStripe("pk_test_51RowYbPubqePCQoUUq1HwYfxtfCjTo0XeElMC6ZjwmtFJnrLmIgVVXTDpRKAiFbnvbpuj9dBq6zHPaFQJdVgktWd00SaBLGDeu");

// Component to render Apple Pay / Google Pay button
const PaymentRequestButton: React.FC = () => {
	const stripe = useStripe() as Stripe | null;
	const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

	useEffect(() => {
		if (!stripe) return;

		const pr = stripe.paymentRequest({
			country: "US",
			currency: "usd",
			total: { label: "Demo Purchase", amount: 1000 },
			requestPayerName: true,
			requestPayerEmail: true,
		});

		// Only show the button if the user can pay
		pr.canMakePayment().then((result) => {
			if (result && (result.applePay || result.googlePay)) {
				setPaymentRequest(pr);
			}
		});

		// Optionally handle paymentmethod event (demo only)
		pr.on("paymentmethod", (ev) => {
			console.log("Selected payment method:", ev.paymentMethod.type);
			// ev.complete('success');
		});
	}, [stripe]);

	if (!paymentRequest) return null;

	return (
		<PaymentRequestButtonElement
			options={{ paymentRequest }}
			className="stripe-payment-request-button mb-4"
		/>
	);
};

export default function LoginPage() {
	return (
		<div className="max-w-md mx-auto pt-16 space-y-8">
			<AuthForm />

			<Elements stripe={stripePromise}>
				<div>
					<h2 className="text-xl font-semibold mb-4">Payment</h2>

					<div className="p-4 border rounded mb-4">
						<label className="block text-sm font-medium mb-2">Card Details</label>
						<CardElement />
					</div>

					<div className="p-4 border rounded">
						<label className="block text-sm font-medium mb-2">Apple/Google Pay</label>
						<PaymentRequestButton />
					</div>
				</div>
			</Elements>
		</div>
	);
}
